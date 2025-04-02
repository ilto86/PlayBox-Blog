import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../../context/authContext';
import * as consoleService from '../../../services/consoleService';
import Modal from '../../common/Modal/Modal';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import Spinner from '../../common/Spinner/Spinner';
import styles from './ConsoleDetails.module.css';

export default function ConsoleDetails() {
    const { consoleId } = useParams();
    const { userId, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
    const [currentConsole, setCurrentConsole] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConsole = async () => {
            try {
                setIsLoading(true);
                const consoleData = await consoleService.getOne(consoleId);
                setCurrentConsole(consoleData);
            } catch (error) {
                console.error('Error fetching console:', error);
                setError('Failed to fetch console details');
                navigate('/consoles');
            } finally {
                setIsLoading(false);
            }
        };

        fetchConsole();
    }, [consoleId, navigate]);

    const isOwner = userId === currentConsole._ownerId;

    const onDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const onDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            await consoleService.remove(consoleId);
            navigate('/consoles');
        } catch (err) {
            console.log('Delete error:', err);
            setError('Failed to delete console. Please try again later.');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const getManufacturerClass = (manufacturer) => {
        const manufacturerMap = {
            'Nintendo': 'nintendo',
            'Sony': 'sony',
            'Microsoft': 'microsoft',
            'Sega': 'sega'
        };
        return styles[manufacturerMap[manufacturer]] || '';
    };

    const getColorHex = (colorName) => {
        const colorMap = {
            'White': '#FFFFFF',
            'Black': '#000000',
            'Grey': '#808080',
            'Light Grey': '#8B8B8B',
            'Dark Grey': '#303030',
            'Pearl Ruby Red': '#CE2029',
            'Vintage Grey': '#9B9B9B',
            'Classic Grey': '#808080',
            'Pearl White': '#F8F8F8',
            'Yellow': '#FFE000',
            'Gold': '#FFD700',
            'Dandelion': '#FFD02E',
            // Добавяме още цветове според нуждите
        };
        
        const normalizedColor = colorName.toLowerCase();
        const colorEntry = Object.entries(colorMap).find(([key]) => 
            key.toLowerCase() === normalizedColor
        );
        
        return colorEntry ? colorEntry[1] : '#FFFFFF';
    };

    const getColorDisplay = (consoleName, colorName) => {
        // Специални случаи за двуцветни конзоли
        const dualColorConsoles = {
            'Nintendo Famicom': {
                colors: ['#CE2029', '#E8E8E8'],
                names: ['Pearl Ruby Red', 'Grey']
            },
            'Nintendo NES': {
                colors: ['#EAEAE9', '#989692'],
                names: ['Vintage Grey', 'Grey']
            },
            'PlayStation®5': {
                colors: ['#FFFFFF', '#000000'],
                names: ['White', 'Black']
            },
            'Sega Dreamcast': {
                colors: ['#F8F8F8', '#E8E8E8'],
                names: ['White', 'Light Grey']
            }
        };

        // Функция за разделяне на цветовете
        const splitColors = (colorStr) => {
            if (colorStr.includes('/')) {
                return colorStr.split('/').map(c => c.trim());
            }
            if (colorStr.toLowerCase().includes(' and ')) {
                return colorStr.toLowerCase().split(' and ').map(c => 
                    c.trim().split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')
                );
            }
            return null;
        };

        // Проверяваме за два цвята в името
        const colors = colorName && splitColors(colorName);
        if (colors) {
            return {
                element: (
                    <span 
                        className={`${styles.colorSample} ${styles.dualColor}`}
                        style={{
                            '--color-left': getColorHex(colors[0]),
                            '--color-right': getColorHex(colors[1])
                        }}
                        title={`${colors[0]} / ${colors[1]}`}
                    />
                ),
                label: `${colors[0]} / ${colors[1]}` // Стандартизираме показването с "/"
            };
        }

        // Проверяваме дали конзолата е в списъка с предефинирани двуцветни конзоли
        if (dualColorConsoles[consoleName]) {
            const { colors, names } = dualColorConsoles[consoleName];
            return {
                element: (
                    <span 
                        className={`${styles.colorSample} ${styles.dualColor}`}
                        style={{
                            '--color-left': colors[0],
                            '--color-right': colors[1]
                        }}
                        title={`${names[0]} / ${names[1]}`}
                    />
                ),
                label: `${names[0]} / ${names[1]}`
            };
        }

        // За единични цветове връщаме стандартното кръгче
        return {
            element: (
                <span 
                    className={styles.colorSample}
                    style={{ backgroundColor: getColorHex(colorName) }}
                    title={colorName}
                />
            ),
            label: colorName
        };
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            <ErrorBox 
                error={error} 
                onClose={() => setError(null)} 
            />
            
            <div className={styles.consoleInfo}>
                <img src={currentConsole.imageUrl} alt={currentConsole.consoleName} />
                <h1>{currentConsole.consoleName}</h1>
                
                <div className={styles.details}>
                    <p className={styles.manufacturer}>
                        <span className={styles.label}>Manufacturer:</span>
                        <span className={`${styles.manufacturerName} ${getManufacturerClass(currentConsole.manufacturer)}`}>
                            {currentConsole.manufacturer}
                        </span>
                    </p>
                    <p>
                        <span className={styles.label}>Storage:</span> {currentConsole.storageCapacity}
                    </p>
                    <p className={styles.colorInfo}>
                        <span className={styles.label}>Color:</span>
                        {(() => {
                            const { element, label } = getColorDisplay(currentConsole.consoleName, currentConsole.color);
                            return (
                                <>
                                    {label}
                                    {element}
                                </>
                            );
                        })()}
                    </p>
                    <p>
                        <span className={styles.label}>Release Date:</span> {currentConsole.releaseDate}
                    </p>
                    <p className={styles.price}>
                        <span className={styles.label}>Price:</span>
                        <span>{Number(currentConsole.price).toFixed(2)}&nbsp;€</span>
                    </p>
                </div>

                {isAuthenticated && isOwner && (
                    <div className={styles.buttons}>
                        <Link to={`/consoles/${consoleId}/edit`} className={styles.editBtn}>
                            Edit
                        </Link>
                        <button onClick={onDeleteClick} className={styles.deleteBtn}>
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={onDeleteConfirm}
                title="Confirm Delete"
                isLoading={isDeleting}
            >
                <p>
                    Are you sure you want to delete{' '}
                    <span className={styles.consoleName}>
                        {currentConsole.consoleName}
                    </span>
                    ?
                </p>
                <p>⚠️ This action cannot be undone!</p>
            </Modal>
        </>
    );
} 