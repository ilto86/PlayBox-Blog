import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../../context/authContext';
import * as consoleService from '../../../services/consoleService';
import * as profileService from '../../../services/profileService';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import styles from './Profile.module.css';
import sharedStyles from '../../consoles/ConsoleDetails/ConsoleDetails.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { Path } from '../../../utils/pathUtils';
import { DEFAULT_AVATAR, DEFAULT_CONSOLE_IMAGE } from '../../../utils/constants';
import { useErrorHandling } from '../../../hooks/useErrorHandling';
import Modal from '../../common/Modal/Modal';
import * as authService from '../../../services/authService';
import LikeButton from '../../likes/LikeButton';
import { getManufacturerClass, formatManufacturerForDisplay } from '../../../utils/consoleDisplayUtils';
import AuthContext from '../../../context/authContext';
import { useContext } from 'react';

// Helper function to validate image URLs
const getValidImageUrl = (url) => {
    if(!url) { return DEFAULT_AVATAR; }
    if(url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return DEFAULT_AVATAR;
};

export default function Profile() {
    const { email, username: authUsername, imageUrl: authImageUrl, updateUser, deleteAccountHandler, logout } = useAuthContext();
    const { userId: authUserId } = useContext(AuthContext);

    // Component state
    const [profileData, setProfileData] = useState({
        userConsoles: [],
        username: authUsername || '',
        profileImage: authImageUrl || DEFAULT_AVATAR
    });
    const [userConsoles, setUserConsoles] = useState([]);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { error, setError: setComponentError, executeWithErrorHandling } = useErrorHandling();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    // Ref to prevent race conditions during data loading   
    const dataLoadRef = useRef(false);

    useEffect(() => {
        if(!authUserId || dataLoadRef.current) {
            setIsLoading(false);
            return;
        }

        const loadProfileData = async () => {
            dataLoadRef.current = true;
            setIsLoading(true);
            setComponentError(null);

            await executeWithErrorHandling(async () => {
                const [profile, consoles] = await Promise.all([
                    profileService.getProfile(authUserId),
                    consoleService.getUserConsoles(authUserId)
                ]);
                setProfileData(prev => ({
                    ...prev,
                    username: profile?.username || authUsername || '',
                    profileImage: profile?.imageUrl || authImageUrl || DEFAULT_AVATAR
                }));
                setUserConsoles(consoles || []);
            }, {
                errorPrefix: 'Failed to load profile data'
            });

            setIsLoading(false);
            dataLoadRef.current = false;
        };

        loadProfileData();
    }, [authUserId, authUsername, authImageUrl, executeWithErrorHandling, setComponentError]);

    // Handlers for editing username
    const handleEditUsername = () => setIsEditingUsername(true);
    const handleCancelEditUsername = () => setIsEditingUsername(false);
    const handleSaveUsername = async () => {
        if(!profileData.username || isSaving) {
            return;
        }
        setIsSaving(true);
        setComponentError(null);

        await executeWithErrorHandling(async () => {
            await profileService.updateProfile(authUserId, { username: profileData.username });
            await updateUser({ username: profileData.username });
            setIsEditingUsername(false);
        }, { errorPrefix: 'Failed to update username' });

        setIsSaving(false);
    };

    // Handlers for editing profile image
    const handleEditImage = () => setIsEditingImage(true);
    const handleCancelEditImage = () => {
        setIsEditingImage(false);
        setNewImageUrl('');
    };
    const handleSaveImage = async () => {
        if(!newImageUrl || isSaving) {
            return;
        }
        setIsSaving(true);
        setComponentError(null);

        await executeWithErrorHandling(async () => {
            await profileService.updateProfile(authUserId, { imageUrl: newImageUrl });
            setProfileData(prev => ({ ...prev, profileImage: newImageUrl }));
            await updateUser({ imageUrl: newImageUrl });
            setIsEditingImage(false);
            setNewImageUrl('');
        }, { errorPrefix: 'Failed to update profile image' });

        setIsSaving(false);
    };

    // Handlers for deleting profile
    const openDeleteModal = () => setShowDeleteModal(true);
    const closeDeleteModal = () => setShowDeleteModal(false);
    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        setComponentError(null);
        console.log('Starting account deletion from Profile component');

        try {
            if(typeof deleteAccountHandler === 'function') {
                console.log('Using deleteAccountHandler from context');
                await deleteAccountHandler();
            } else {
                console.log('Using authService.deleteAccount directly');
                await authService.deleteAccount();
            }

            console.log('Account deletion successful');
            closeDeleteModal();

            if(typeof logout === 'function') {
                logout();
            }
            navigate('/');
        } catch(err) {
            console.error('Error in handleDeleteConfirm:', err);
            setComponentError(`Failed to delete account: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    if(isLoading) {
        return <Spinner />;
    }

    if(error) {
        return <ErrorBox error={error} />;
    }

    return (
        <div className={styles.profileContainer}>
            <section className={styles.profile}>
                <div className={styles.userInfo}>
                    {/* Profile Image Section */}
                    <div className={styles.profileImageContainer}>
                        <img
                            src={getValidImageUrl(profileData.profileImage)}
                            alt={profileData.username}
                            className={styles.profileImage}
                            onError={(e) => {
                                e.target.src = DEFAULT_AVATAR;
                                e.target.onerror = null;
                            }}
                        />
                        <button onClick={handleEditImage} className={styles.editImageBtn} aria-label="Edit profile image">
                            <i className="fa-solid fa-camera"></i>
                        </button>
                    </div>

                    {/* Image Edit Form */}
                    {isEditingImage && (
                        <div className={styles.editForm}>
                            <input
                                type="text"
                                placeholder="Enter image URL..."
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                className={styles.editInput}
                                aria-label="Image URL input"
                            />
                            <div className={styles.editButtons}>
                                <button onClick={handleSaveImage} className={styles.saveBtn} disabled={isSaving || !newImageUrl}>
                                    {isSaving ? 'Saving...' : 'Save Image'}
                                </button>
                                <button onClick={handleCancelEditImage} className={styles.cancelBtn} disabled={isSaving}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Username Section */}
                    {isEditingUsername ? (
                        <div className={styles.editForm}>
                            <input
                                type="text"
                                value={profileData.username}
                                onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                                className={styles.editInput}
                                placeholder="Enter username"
                                aria-label="Username input"
                            />
                            <div className={styles.editButtons}>
                                <button onClick={handleSaveUsername} className={styles.saveBtn} disabled={isSaving || !profileData.username}>
                                    {isSaving ? 'Saving...' : 'Save Username'}
                                </button>
                                <button onClick={handleCancelEditUsername} className={styles.cancelBtn} disabled={isSaving}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className={styles.username}>{profileData.username}</h2>
                            <button
                                onClick={handleEditUsername}
                                className={styles.editUsernameBtn}
                            >
                                Edit Username
                            </button>
                        </>
                    )}

                    {/* Email and Console Count */}
                    <p className={styles.email}>{email}</p>
                    <p className={styles.consoleCount}>
                        Total Consoles: {userConsoles.length}
                    </p>

                    {/* Delete Profile Button */}
                    <button
                        className={styles.deleteButton}
                        onClick={openDeleteModal}
                    >
                        Delete Profile
                    </button>
                </div>

                {/* User's Consoles Section */}
                <div className={styles.userConsoles}>
                    <h2>My Consoles</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : error ? (
                        <ErrorBox error={error} />
                    ) : userConsoles.length === 0 ? (
                        <div className={styles.noConsoles}>
                            <p>You haven&apos;t added any consoles yet.</p>
                            <Link to={Path.ConsoleCreate} className={styles.addButton}>
                                Add Your First Console
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className={styles.consolesGrid}>
                                {userConsoles.map(console => {
                                    const manufacturerClassName = getManufacturerClass(console.manufacturer, sharedStyles);
                                    const displayManufacturerName = formatManufacturerForDisplay(console.manufacturer);
                                    const isOwner = authUserId === console._ownerId;

                                    return (
                                        <div key={console._id} className={sharedStyles.consoleCard}>
                                            <img
                                                src={console.imageUrl || DEFAULT_CONSOLE_IMAGE}
                                                alt={console.consoleName}
                                                className={sharedStyles.consoleImage}
                                                onError={(e) => {
                                                    e.target.src = DEFAULT_CONSOLE_IMAGE;
                                                    e.target.onerror = null;
                                                }}
                                            />
                                            <div className={sharedStyles.consoleInfo}>
                                                <h3 className={sharedStyles.consoleName}>
                                                    {console.consoleName}
                                                </h3>
                                                <p className={`${sharedStyles.consoleManufacturer} ${manufacturerClassName}`}>
                                                    {displayManufacturerName}
                                                </p>
                                                <div className={sharedStyles.consoleDetails}>
                                                    <span className={sharedStyles.consolePrice}>
                                                        {Number(console.price).toFixed(2)}&nbsp;€
                                                    </span>
                                                    <div className={sharedStyles.actionButtons}>
                                                        <Link
                                                            to={`/consoles/${console._id}`}
                                                            className={sharedStyles.viewDetailsBtn}
                                                        >
                                                            View Details
                                                        </Link>
                                                        {!isOwner && (
                                                            <LikeButton
                                                                consoleId={console._id}
                                                                isOwner={isOwner}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Show 'Add Console' button only when consoles exist */}
                            <div className={styles.addConsoleBtnWrapper}>
                                <Link to={Path.ConsoleCreate} className={styles.addConsoleBtn}>
                                    Add Console
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>
            
            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onClose={closeDeleteModal}
                title="Confirm Delete"
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
            >
                <p>
                    Are you sure you want to delete{' '}
                    <strong>{profileData.username}</strong>&apos;s Profile?
                </p>
                <p>⚠️ This action cannot be undone!</p>
            </Modal>
        </div>
    );
}