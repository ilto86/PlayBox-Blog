import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../../context/authContext';
import * as consoleService from '../../../services/consoleService';
import * as profileService from '../../../services/profileService';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import styles from './Profile.module.css';
import { Link } from 'react-router-dom';

// Constants
const DEFAULT_AVATAR = 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg';

// Components
const ProfileHeader = ({ username, image, onEdit }) => (
    <div className={styles.profileHeader}>
        <img src={image} alt={username} />
        <h1>{username}</h1>
        <button onClick={onEdit}>Edit Profile</button>
    </div>
);

const ConsolesList = ({ consoles }) => (
    <div className={styles.consolesList}>
        {consoles.map(console => (
            <ConsoleCard key={console._id} {...console} />
        ))}
    </div>
);

// Main Component
export default function Profile() {
    const { userId, email, username: authUsername, imageUrl: authImageUrl, updateUser } = useAuthContext();
    const [profileData, setProfileData] = useState({
        userConsoles: [],
        username: authUsername || '',
        profileImage: authImageUrl || DEFAULT_AVATAR
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [userConsoles, setUserConsoles] = useState([]);
    
    // Просто използваме един ref за предотвратяване на двойни заявки
    const updateProcessRef = useRef(false);

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                setIsLoading(true);
                const [profile, consoles] = await Promise.all([
                    profileService.getProfile(userId),
                    consoleService.getUserConsoles(userId)
                ]);
                
                setProfileData(prev => ({ ...prev, ...profile }));
                setUserConsoles(consoles);
            } catch (err) {
                console.error('Failed to load profile data:', err);
                setError('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            loadProfileData();
        }
    }, [userId]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!profileData.username || isSaving) return;
        
        try {
            setIsSaving(true);
            
            // Записваме в profiles колекцията
            await profileService.updateProfile(userId, {
                username: profileData.username,
                imageUrl: profileData.profileImage
            });

            // Обновяваме auth контекста
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

    const handleImageEdit = () => {
        setIsEditingImage(true);
    };

    const handleImageSave = async () => {
        if (!imageUrl || isSaving) return;
        
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

    if (isLoading) { return <Spinner />; }
    if (error) { return <ErrorBox error={error} />; }

    return (
        <section className={styles.profile}>
            <div className={styles.userInfo}>
                <div className={styles.profileImageContainer}>
                    <img 
                        src={profileData.profileImage} 
                        alt={profileData.username} 
                        className={styles.profileImage}
                    />
                    <button onClick={handleImageEdit} className={styles.editImageBtn}>
                        <i className="fas fa-camera"></i>
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
                        />
                        <div className={styles.editButtons}>
                            <button onClick={handleSave} className={styles.saveBtn}>Save</button>
                            <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>Cancel</button>
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
                        <p>You haven't added any consoles yet.</p>
                        <Link to="/consoles/create" className={styles.addButton}>
                            Add Your First Console
                        </Link>
                    </div>
                ) : (
                    <div className={styles.consoleGrid}>
                        {userConsoles.map(console => (
                            <div key={console._id} className={styles.consoleCard}>
                                <img src={console.imageUrl} alt={console.name} />
                                <h3>{console.name}</h3>
                                <p>{console.brand}</p>
                                <Link to={`/consoles/${console._id}`} className={styles.viewDetailsBtn}>
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
} 