// import { useState, useEffect, useRef } from 'react';
// import { useAuthContext } from '../../../context/authContext';
// import * as consoleService from '../../../services/consoleService';
// import * as profileService from '../../../services/profileService';
// import Spinner from '../../common/Spinner/Spinner';
// import ErrorBox from '../../common/ErrorBox/ErrorBox';
// import styles from './Profile.module.css';
// import { Link, useNavigate } from 'react-router-dom';
// import { Path } from '../../../utils/pathUtils';
// import sharedStyles from '../../../styles/shared/ConsoleCard.module.css';
// import { DEFAULT_AVATAR, DEFAULT_CONSOLE_IMAGE, getManufacturerClass } from '../../../utils/constants';
// import { useErrorHandling } from '../../../hooks/useErrorHandling';
// import Modal from '../../common/Modal/Modal';
// import * as authService from '../../../services/authService';

// // Добавяме проверка за валиден URL на снимката
// const getValidImageUrl = (url) => {
//     if (!url) { return DEFAULT_AVATAR;  }
    
//     // Проверяваме дали URL започва с http:// или https://
//     if (url.startsWith('http://') || url.startsWith('https://')) {
//         return url;
//     }
    
//     // Ако URL е относителен път, добавяме базовия URL
//     if (url.startsWith('/')) {
//         return `${window.location.origin}${url}`;
//     }
    
//     // Ако URL не е валиден, връщаме DEFAULT_AVATAR
//     return DEFAULT_AVATAR;
// };

// // Main Component
// export default function Profile() {
//     const { userId, email, username: authUsername, imageUrl: authImageUrl, updateUser, deleteAccountHandler, logout } = useAuthContext();
//     const [profileData, setProfileData] = useState({
//         userConsoles: [],
//         username: authUsername || '',
//         // Използваме authImageUrl само ако съществува, иначе DEFAULT_AVATAR
//         profileImage: authImageUrl || DEFAULT_AVATAR
//     });
//     const [isEditing, setIsEditing] = useState(false);
//     const [isEditingImage, setIsEditingImage] = useState(false);
//     const [imageUrl, setImageUrl] = useState('');
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSaving, setIsSaving] = useState(false);
//     const [userConsoles, setUserConsoles] = useState([]);
//     const { error, executeWithErrorHandling } = useErrorHandling();
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [isDeleting, setIsDeleting] = useState(false);
//     const navigate = useNavigate();
    
//     // Връщаме updateProcessRef за предотвратяване на race conditions
//     const updateProcessRef = useRef(false);

//     useEffect(() => {
//         if (!userId || updateProcessRef.current) {
//             return;
//         }

//         const loadProfileData = async () => {
//             updateProcessRef.current = true;
//             setIsLoading(true);
            
//             await executeWithErrorHandling(async () => {
//                 const [profile, consoles] = await Promise.all([
//                     profileService.getProfile(userId),
//                     consoleService.getUserConsoles(userId)
//                 ]);
                
//                 setProfileData(prev => ({
//                     ...prev,
//                     ...profile,
//                     profileImage: profile?.imageUrl || DEFAULT_AVATAR
//                 }));
//                 setUserConsoles(consoles || []);
//             }, {
//                 errorPrefix: 'Failed to load profile data'
//             });
            
//             setIsLoading(false);
//             updateProcessRef.current = false;
//         };

//         loadProfileData();
//     }, [userId, executeWithErrorHandling]);

//     const handleEdit = () => setIsEditing(true);

//     const handleSave = async () => {
//         if (!profileData.username || isSaving) {
//             return;
//         }
        
//         setIsSaving(true);
        
//         await executeWithErrorHandling(async () => {
//             await profileService.updateProfile(userId, {
//                 username: profileData.username,
//                 imageUrl: profileData.profileImage
//             });

//             await updateUser({ 
//                 username: profileData.username, 
//                 imageUrl: profileData.profileImage 
//             });
            
//             setIsEditing(false);
//         }, {
//             errorPrefix: 'Failed to update profile'
//         });
        
//         setIsSaving(false);
//     };

//     const handleImageEdit = () => setIsEditingImage(true);

//     const handleImageSave = async () => {
//         if (!imageUrl) {
//             return;
//         }
        
//         setIsSaving(true);
        
//         await executeWithErrorHandling(async () => {
//             await profileService.updateProfile(userId, {
//                 username: profileData.username,
//                 imageUrl: imageUrl
//             });

//             setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
//             await updateUser({ imageUrl });
//             setIsEditingImage(false);
//             setImageUrl('');
//         }, {
//             errorPrefix: 'Failed to update profile image'
//         });
        
//         setIsSaving(false);
//     };

//     const handleDeleteConfirm = async () => {
//         setIsDeleting(true);
        
//         try {
//             console.log('Starting account deletion from Profile component');
            
//             // First try using the context function if available
//             if (typeof deleteAccountHandler === 'function') {
//                 console.log('Using deleteAccountHandler from context');
//                 await deleteAccountHandler();
//             } else {
//                 // Fallback to direct service call
//                 console.log('Using authService.deleteAccount directly');
//                 await authService.deleteAccount();
//             }
            
//             console.log('Account deletion successful');
//             setShowDeleteModal(false);
            
//             // Make sure we're logged out
//             if (typeof logout === 'function') {
//                 logout();
//             }
            
//             // Navigate to home page
//             navigate('/');
//         } catch (error) {
//             console.error('Error in handleDeleteConfirm:', error);
//             setError(`Failed to delete account: ${error.message}`);
//         } finally {
//             setIsDeleting(false);
//         }
//     };

//     if (isLoading) {
//         return <Spinner />;
//     }
    
//     if (error) {
//         return <ErrorBox error={error} />;
//     }

//     return (
//         <div className={styles.profileContainer}>
//             <section className={styles.profile}>
//                 <div className={styles.userInfo}>
//                     <div className={styles.profileImageContainer}>
//                         <img 
//                             src={getValidImageUrl(profileData.profileImage)} 
//                             alt={profileData.username}
//                             className={styles.profileImage}
//                             onError={(e) => {
//                                 e.target.src = DEFAULT_AVATAR;
//                                 e.target.onerror = null; // Предотвратяваме безкраен цикъл
//                             }}
//                         />
//                         <button onClick={handleImageEdit} className={styles.editImageBtn}>
//                             <i className="fa-solid fa-camera"></i>
//                         </button>
//                     </div>

//                     {isEditingImage && (
//                         <div className={styles.editForm}>
//                             <input
//                                 type="text"
//                                 placeholder="Enter image URL..."
//                                 value={imageUrl}
//                                 onChange={(e) => setImageUrl(e.target.value)}
//                                 className={styles.editInput}
//                             />
//                             <div className={styles.editButtons}>
//                                 <button onClick={handleImageSave} className={styles.saveBtn}>Save</button>
//                                 <button onClick={() => setIsEditingImage(false)} className={styles.cancelBtn}>Cancel</button>
//                             </div>
//                         </div>
//                     )}

//                     {isEditing ? (
//                         <div className={styles.editForm}>
//                             <input
//                                 type="text"
//                                 value={profileData.username}
//                                 onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
//                                 className={styles.editInput}
//                                 placeholder="Enter username"
//                             />
//                             <div className={styles.editButtons}>
//                                 <button onClick={handleSave} className={styles.saveBtn}>
//                                     Save
//                                 </button>
//                                 <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     ) : (
//                         <>
//                             <h2 className={styles.username}>{profileData.username}</h2>
//                             <button 
//                                 onClick={handleEdit} 
//                                 className={styles.editUsernameBtn}
//                             >
//                                 Edit Username
//                             </button>
//                         </>
//                     )}
                    
//                     <p className={styles.email}>{email}</p>
//                     <p className={styles.consoleCount}>
//                         Total Consoles: {userConsoles.length}
//                     </p>

//                     <button 
//                         className={styles.deleteButton} 
//                         onClick={() => setShowDeleteModal(true)}
//                     >
//                         Delete Profile
//                     </button>
//                 </div>

//                 <div className={styles.userConsoles}>
//                     <h2>My Consoles</h2>
//                     {userConsoles.length === 0 ? (
//                         <div className={styles.noConsoles}>
//                             <p>You haven&apos;t added any consoles yet.</p>
//                             <Link to={Path.ConsoleCreate} className={styles.addButton}>
//                                 Add Your First Console
//                             </Link>
//                         </div>
//                     ) : (
//                         <div className={styles.consolesGrid}>
//                             {userConsoles.map(console => (
//                                 <div key={console._id} className={sharedStyles.consoleCard}>
//                                     <img 
//                                         src={console.imageUrl || DEFAULT_CONSOLE_IMAGE} 
//                                         alt={console.consoleName}
//                                         className={sharedStyles.consoleImage}
//                                         onError={(e) => {
//                                             e.target.src = DEFAULT_CONSOLE_IMAGE;
//                                         }}
//                                     />
//                                     <div className={sharedStyles.consoleInfo}>
//                                         <h3 className={sharedStyles.consoleName}>
//                                             {console.consoleName}
//                                         </h3>
//                                         <p className={`${styles.consoleCard} ${getManufacturerClass(console.manufacturer, styles)}`}>
//                                             {console.manufacturer}
//                                         </p>
//                                         <div className={sharedStyles.consoleDetails}>
//                                             <span className={sharedStyles.consolePrice}>
//                                                 {Number(console.price).toFixed(2)}&nbsp;€
//                                             </span>
//                                             <Link 
//                                                 to={`/consoles/${console._id}`} 
//                                                 className={sharedStyles.viewDetailsBtn}
//                                             >
//                                                 View Details
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </section>

//             <Modal
//                 show={showDeleteModal}
//                 onClose={() => setShowDeleteModal(false)}
//                 title="Confirm Delete"
//                 onConfirm={handleDeleteConfirm}
//                 isLoading={isDeleting}
//             >
//                 <p>
//                 Are you sure you want to delete{' '}
//                     <span>
//                         {profileData.username} Profile?
//                     </span>
//                 </p>
//                 <p>⚠️ This action cannot be undone!</p>
//             </Modal>
//         </div>
//     );
// }






import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../../../context/authContext';
import * as consoleService from '../../../services/consoleService';
import * as profileService from '../../../services/profileService';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import styles from './Profile.module.css'; // Component-specific styles
import sharedStyles from '../../../styles/shared/ConsoleCard.module.css'; // Shared card styles
import { Link, useNavigate } from 'react-router-dom';
import { Path } from '../../../utils/pathUtils';
import { DEFAULT_AVATAR, DEFAULT_CONSOLE_IMAGE } from '../../../utils/constants'; // Removed unused getManufacturerClass
import { useErrorHandling } from '../../../hooks/useErrorHandling';
import Modal from '../../common/Modal/Modal';
import * as authService from '../../../services/authService';
// Import necessary functions from consoleDisplayUtils
import { getManufacturerClassKey, formatManufacturerForDisplay } from '../../../utils/consoleDisplayUtils';

// Helper function to validate image URLs
const getValidImageUrl = (url) => {
    if (!url) { return DEFAULT_AVATAR; }
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // Assuming relative URLs are not expected here based on context
    // If they were, logic to prepend base URL would go here
    return DEFAULT_AVATAR; // Return default if not a valid absolute URL
};

// Main Profile Component
export default function Profile() {
    // Auth context values
    const { userId, email, username: authUsername, imageUrl: authImageUrl, updateUser, deleteAccountHandler, logout } = useAuthContext();

    // Component state
    const [profileData, setProfileData] = useState({
        userConsoles: [], // Keep track of consoles separately
        username: authUsername || '',
        profileImage: authImageUrl || DEFAULT_AVATAR
    });
    const [userConsoles, setUserConsoles] = useState([]); // Separate state for consoles list
    const [isEditingUsername, setIsEditingUsername] = useState(false); // Renamed for clarity
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState(''); // Renamed for clarity
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { error, setError: setComponentError, executeWithErrorHandling } = useErrorHandling(); // Use setError from hook
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    // Ref to prevent race conditions during data loading
    const dataLoadRef = useRef(false);

    // Effect to load profile data and user's consoles on mount or userId change
    useEffect(() => {
        if (!userId || dataLoadRef.current) {
            setIsLoading(false); // Ensure loading stops if no userId
            return;
        }

        const loadProfileData = async () => {
            dataLoadRef.current = true;
            setIsLoading(true);
            setComponentError(null); // Clear previous errors

            await executeWithErrorHandling(async () => {
                // Fetch profile details and user's consoles concurrently
                const [profile, consoles] = await Promise.all([
                    profileService.getProfile(userId),
                    consoleService.getUserConsoles(userId)
                ]);

                // Update profile data state
                setProfileData(prev => ({
                    ...prev,
                    username: profile?.username || authUsername || '', // Prioritize fetched, then context, then empty
                    profileImage: profile?.imageUrl || authImageUrl || DEFAULT_AVATAR // Prioritize fetched, then context, then default
                }));
                // Update user consoles state
                setUserConsoles(consoles || []);
            }, {
                errorPrefix: 'Failed to load profile data'
            });

            setIsLoading(false);
            dataLoadRef.current = false;
        };

        loadProfileData();
    }, [userId, authUsername, authImageUrl, executeWithErrorHandling, setComponentError]); // Added dependencies

    // Handlers for editing username
    const handleEditUsername = () => setIsEditingUsername(true);
    const handleCancelEditUsername = () => setIsEditingUsername(false);
    const handleSaveUsername = async () => {
        if (!profileData.username || isSaving) return;
        setIsSaving(true);
        setComponentError(null);

        await executeWithErrorHandling(async () => {
            await profileService.updateProfile(userId, { username: profileData.username });
            await updateUser({ username: profileData.username }); // Update context
            setIsEditingUsername(false);
        }, { errorPrefix: 'Failed to update username' });

        setIsSaving(false);
    };

    // Handlers for editing profile image
    const handleEditImage = () => setIsEditingImage(true);
    const handleCancelEditImage = () => {
        setIsEditingImage(false);
        setNewImageUrl(''); // Clear input on cancel
    };
    const handleSaveImage = async () => {
        if (!newImageUrl || isSaving) return; // Use newImageUrl state
        setIsSaving(true);
        setComponentError(null);

        await executeWithErrorHandling(async () => {
            await profileService.updateProfile(userId, { imageUrl: newImageUrl }); // Send newImageUrl
            setProfileData(prev => ({ ...prev, profileImage: newImageUrl })); // Update local state immediately
            await updateUser({ imageUrl: newImageUrl }); // Update context
            setIsEditingImage(false);
            setNewImageUrl(''); // Clear input on success
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
            // Use context handler if available, otherwise direct service call
            if (typeof deleteAccountHandler === 'function') {
                console.log('Using deleteAccountHandler from context');
                await deleteAccountHandler();
            } else {
                console.log('Using authService.deleteAccount directly');
                await authService.deleteAccount(); // Ensure this service function exists and works
            }

            console.log('Account deletion successful');
            closeDeleteModal();

            // Ensure logout happens via context if possible
            if (typeof logout === 'function') {
                logout();
            }
            navigate('/'); // Navigate home after deletion and logout
        } catch (err) {
            console.error('Error in handleDeleteConfirm:', err);
            setComponentError(`Failed to delete account: ${err.message}`);
            // Keep modal open on error? Or close? Decided to keep it open to show error.
            // closeDeleteModal();
        } finally {
            setIsDeleting(false);
        }
    };

    // Render loading spinner
    if (isLoading) {
        return <Spinner />;
    }

    // Render error box if an error occurred
    // Note: Errors from saving/deleting will also be shown here
    if (error) {
        return <ErrorBox error={error} />;
    }

    // Main profile render
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
                                e.target.onerror = null; // Prevent infinite loop if default avatar fails
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
                        // Username Edit Form
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
                        // Display Username and Edit Button
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
                    {userConsoles.length === 0 ? (
                        // Message when no consoles are added
                        <div className={styles.noConsoles}>
                            <p>You haven&apos;t added any consoles yet.</p>
                            <Link to={Path.ConsoleCreate} className={styles.addButton}>
                                Add Your First Console
                            </Link>
                        </div>
                    ) : (
                        // Grid of user's consoles
                        <div className={styles.consolesGrid}>
                            {/* --- НАЧАЛО НА MAP --- */}
                            {userConsoles.map(console => {
                                // --- Изчисления ВЪТРЕ в map ---
                                const manufacturerKey = getManufacturerClassKey(console.manufacturer);
                                const manufacturerClassName = sharedStyles[manufacturerKey] || ''; // Клас от sharedStyles
                                const displayManufacturerName = formatManufacturerForDisplay(console.manufacturer);
                                // --- Край на изчисленията ---

                                // --- Начало на return за картата ---
                                // Използваме кръгла скоба '(' след return
                                return (
                                    <div key={console._id} className={sharedStyles.consoleCard}>
                                        <img
                                            src={console.imageUrl || DEFAULT_CONSOLE_IMAGE}
                                            alt={console.consoleName}
                                            className={sharedStyles.consoleImage}
                                            onError={(e) => {
                                                e.target.src = DEFAULT_CONSOLE_IMAGE;
                                                e.target.onerror = null; // Prevent loop
                                            }}
                                        />
                                        <div className={sharedStyles.consoleInfo}>
                                            <h3 className={sharedStyles.consoleName}>
                                                {console.consoleName}
                                            </h3>
                                            {/* Коригиран className и използване на displayManufacturerName */}
                                            <p className={`${sharedStyles.consoleManufacturer} ${manufacturerClassName}`}>
                                                {displayManufacturerName}
                                            </p>
                                            <div className={sharedStyles.consoleDetails}>
                                                <span className={sharedStyles.consolePrice}>
                                                    {Number(console.price).toFixed(2)}&nbsp;€
                                                </span>
                                                {/* ЛИНК КЪМ ДЕТАЙЛИТЕ НА КОНЗОЛАТА, НЕ КЪМ РЕДАКЦИЯ */}
                                                <Link
                                                    to={`/consoles/${console._id}`} // Link to details page
                                                    className={sharedStyles.viewDetailsBtn}
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                // --- Край на JSX за картата, затваряме кръглата скоба ---
                                );
                            // --- Край на тялото на map функцията, затваряме къдравата скоба ---
                            })}
                            {/* --- КРАЙ НА MAP --- */}
                        </div>
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
                    <strong>{profileData.username}</strong>'s Profile?
                </p>
                <p>⚠️ This action cannot be undone!</p>
            </Modal>
        </div>
    );
}
