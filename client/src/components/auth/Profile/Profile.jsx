import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../../context/authContext';
import * as consoleService from '../../../services/consoleService';
import * as profileService from '../../../services/profileService';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import styles from './Profile.module.css';
import { Link } from 'react-router-dom';
import { Path } from '../../../utils/pathUtils';
import sharedStyles from '../../../styles/shared/ConsoleCard.module.css';
import { DEFAULT_AVATAR } from '../../../utils/constants';

// В началото на компонента, преди export default function Profile()
const getManufacturerClass = (manufacturer) => {
    const manufacturerMap = {
        'Nintendo': 'nintendo',
        'Sony': 'sony',
        'Microsoft': 'microsoft',
        'Sega': 'sega'
    };
    return manufacturerMap[manufacturer] || '';
};

// Main Component
export default function Profile() {
    const { userId, email, username: authUsername, imageUrl: authImageUrl, updateUser } = useAuthContext();
    const [profileData, setProfileData] = useState({
        userConsoles: [],
        username: authUsername || '',
        // Използваме authImageUrl само ако съществува, иначе DEFAULT_AVATAR
        profileImage: authImageUrl || DEFAULT_AVATAR
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [userConsoles, setUserConsoles] = useState([]);
    
    // Връщаме updateProcessRef за предотвратяване на race conditions
    const updateProcessRef = useRef(false);

    useEffect(() => {
        if (!userId || updateProcessRef.current) {
            return;
        }

        const loadProfileData = async () => {
            try {
                updateProcessRef.current = true;
                setIsLoading(true);
                const [profile, consoles] = await Promise.all([
                    profileService.getProfile(userId),
                    consoleService.getUserConsoles(userId)
                ]);
                
                setProfileData(prev => ({
                    ...prev,
                    ...profile,
                    // Използваме съществуващата снимка или DEFAULT_AVATAR
                    profileImage: profile?.imageUrl || DEFAULT_AVATAR
                }));
                setUserConsoles(consoles || []);
            } catch (err) {
                console.error('Failed to load profile data:', err);
                setError('Failed to load profile data');
            } finally {
                setIsLoading(false);
                updateProcessRef.current = false;
            }
        };

        loadProfileData();
    }, [userId]);

    const handleEdit = () => setIsEditing(true);

    const handleSave = async () => {
        if (!profileData.username || isSaving) {
            return;
        }
        
        try {
            setIsSaving(true);
            
            await profileService.updateProfile(userId, {
                username: profileData.username,
                imageUrl: profileData.profileImage
            });

            await updateUser({ 
                username: profileData.username, 
                imageUrl: profileData.profileImage 
            });
            
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageEdit = () => setIsEditingImage(true);

    const handleImageSave = async () => {
        if (!imageUrl) {
            return;
        }
        
        try {
            setIsSaving(true);
            setError(null);
            
            await profileService.updateProfile(userId, {
                username: profileData.username,
                imageUrl: imageUrl
            });

            setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
            await updateUser({ imageUrl });
            setIsEditingImage(false);
            setImageUrl('');
        } catch (err) {
            setError('Failed to update profile image. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }
    
    if (error) {
        return <ErrorBox error={error} />;
    }

    return (
        <section className={styles.profile}>
            <div className={styles.userInfo}>
                <div className={styles.profileImageContainer}>
                    <img 
                        src={profileData.profileImage} 
                        alt={profileData.username}
                        className={styles.profileImage}
                        // Премахваме onError handler-а, тъй като DEFAULT_AVATAR е винаги валиден
                    />
                    <button onClick={handleImageEdit} className={styles.editImageBtn}>
                        <i className="fa-solid fa-camera"></i>
                    </button>
                </div>

                {isEditingImage && (
                    <div className={styles.editForm}>
                        <input
                            type="text"
                            placeholder="Enter image URL..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className={styles.editInput}
                        />
                        <div className={styles.editButtons}>
                            <button onClick={handleImageSave} className={styles.saveBtn}>Save</button>
                            <button onClick={() => setIsEditingImage(false)} className={styles.cancelBtn}>Cancel</button>
                        </div>
                    </div>
                )}

                {isEditing ? (
                    <div className={styles.editForm}>
                        <input
                            type="text"
                            value={profileData.username}
                            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                            className={styles.editInput}
                            placeholder="Enter username"
                        />
                        <div className={styles.editButtons}>
                            <button onClick={handleSave} className={styles.saveBtn}>
                                Save
                            </button>
                            <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.username}>{profileData.username}</h2>
                        <button onClick={handleEdit} className={styles.editUsernameBtn}>
                            Edit Username
                        </button>
                    </>
                )}
                
                <p className={styles.email}>{email}</p>
                <p className={styles.consoleCount}>
                    Total Consoles: {userConsoles.length}
                </p>
            </div>

            <div className={styles.userConsoles}>
                <h2>My Consoles</h2>
                {userConsoles.length === 0 ? (
                    <div className={styles.noConsoles}>
                        <p>You haven&apos;t added any consoles yet.</p>
                        <Link to={Path.ConsoleCreate} className={styles.addButton}>
                            Add Your First Console
                        </Link>
                    </div>
                ) : (
                    <div className={styles.consolesGrid}>
                        {userConsoles.map(console => (
                            <div key={console._id} className={sharedStyles.consoleCard}>
                                <img 
                                    src={console.imageUrl} 
                                    alt={console.consoleName}
                                    className={sharedStyles.consoleImage}
                                />
                                <div className={sharedStyles.consoleInfo}>
                                    <h3 className={sharedStyles.consoleName}>
                                        {console.consoleName}
                                    </h3>
                                    <p className={`${sharedStyles.consoleManufacturer} ${sharedStyles[getManufacturerClass(console.manufacturer)]}`}>
                                        {console.manufacturer}
                                    </p>
                                    <div className={sharedStyles.consoleDetails}>
                                        <span className={sharedStyles.consolePrice}>
                                            {Number(console.price).toFixed(2)}&nbsp;€
                                        </span>
                                        <Link 
                                            to={`/consoles/${console._id}`} 
                                            className={sharedStyles.viewDetailsBtn}
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}