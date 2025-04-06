// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useAuthContext } from '../../../context/authContext';
// import { useErrorHandling } from '../../../hooks/useErrorHandling';
// import * as consoleService from '../../../services/consoleService';
// import Modal from '../../common/Modal/Modal';
// import ErrorBox from '../../common/ErrorBox/ErrorBox';
// import Spinner from '../../common/Spinner/Spinner';
// import styles from './ConsoleDetails.module.css';
// import { DEFAULT_CONSOLE_IMAGE, getManufacturerClass } from '../../../utils/constants';

// export default function ConsoleDetails() {
//     const { consoleId } = useParams();
//     const { userId, isAuthenticated } = useAuthContext();
//     const navigate = useNavigate();
//     const [currentConsole, setCurrentConsole] = useState({});
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isDeleting, setIsDeleting] = useState(false);
    
//     // Използваме useErrorHandling вместо локален state за грешки
//     const { error, clearError, executeWithErrorHandling } = useErrorHandling();

//     useEffect(() => {
//         const fetchConsole = async () => {
//             setIsLoading(true);
            
//             await executeWithErrorHandling(async () => {
//                 const consoleData = await consoleService.getOne(consoleId);
//                 setCurrentConsole(consoleData);
//             }, {
//                 errorPrefix: 'Failed to fetch console details',
//                 onError: (err) => {
//                     // Ако има грешка при зареждането, пренасочваме към списъка с конзоли
//                     navigate('/consoles');
//                 }
//             });
            
//             setIsLoading(false);
//         };

//         fetchConsole();
//     }, [consoleId, navigate, executeWithErrorHandling]);

//     const isOwner = userId === currentConsole._ownerId;

//     const onDeleteClick = () => {
//         setShowDeleteModal(true);
//     };

//     const onDeleteConfirm = async () => {
//         setIsDeleting(true);
        
//         await executeWithErrorHandling(async () => {
//             await consoleService.remove(consoleId);
//             navigate('/consoles');
//         }, {
//             errorPrefix: 'Failed to delete console',
//             onError: () => {
//                 setIsDeleting(false);
//                 setShowDeleteModal(false);
//             }
//         });
//     };

//     const getColorHex = (colorName) => {
//         const colorMap = {
//             // **Бели и черни оттенъци**
//             'White': '#FFFFFF',  // Бяло
//             'Black': '#000000',  // Черно
//             'Grey': '#808080',  // Сиво
//             'Light Grey': '#8B8B8B',  // Светло сиво
//             'Dark Grey': '#303030',  // Тъмно сиво
//             'Pearl White': '#F8F8F8',  // Перлено бяло
//             'Cream White': '#F9F9F9',  // Кремаво бяло 
//             'Vintage Grey': '#9B9B9B',  // Винтидж сиво
//             'Classic Grey': '#808080',  // Класическо сиво
//             'Slate Grey': '#708090',  // Слатово сиво

//             // **Сини и техни нюанси**
//             'Blue': '#0000FF',  // Синьо
//             'Sky Blue': '#87CEEB',  // Небесно синьо
//             'Royal Blue': '#4169E1',  // Кралско синьо
//             'Dodger Blue': '#1E90FF',  // Синьо, подобно на цвета на небе в добър ден
//             'Dark Blue': '#00008B',  // Тъмно синьо
//             'Light Blue': '#ADD8E6',  // Светло синьо
//             'Steel Blue': '#4682B4',  // Стоманено синьо
//             'Indigo': '#4B0082',  // Индиго
//             'Turquoise Blue': '#00CED1',  // Тюркоазено синьо
//             'Slate Blue': '#6A5ACD',  // Слатово синьо

//             // **Червени и техни нюанси**
//             'Red': '#FF0000',  // Червено
//             'Pearl Ruby Red': '#CE2029',  // Перлен рубинено
//             'Famicom Red': '#E60012',  // Червено на Famicom
//             'Crimson': '#DC143C',  // Кримсон
//             'Dark Red': '#8B0000',  // Тъмно червено
//             'Light Red': '#FF7F7F',  // Светло червено
//             'Firebrick': '#B22222',  // Огнено червено
//             'Salmon': '#FA8072',  // Лососево
//             'Coral': '#FF7F50',  // Корал
//             'Pink': '#FFC0CB',  // Розово
//             'Fuchsia': '#FF00FF',  // Фуксия

//             // **Зелени и техни нюанси**
//             'Green': '#008000',  // Основно зелено
//             'Lime Green': '#32CD32',  // Лайм зелено
//             'Forest Green': '#228B22',  // Лесно зелено
//             'Olive': '#808000',  // Маслинено зелено
//             'Sea Green': '#2E8B57',  // Морско зелено
//             'Mint Green': '#98FF98',  // Ментово зелено
//             'Emerald Green': '#50C878',  // Изумрудено зелено
//             'Olive Drab': '#6B8E23',  // Маслинено кафяво

//             // **Жълти и техни нюанси**
//             'Yellow': '#FFE000',  // Жълто
//             'Dandelion': '#FFD02E',  // Глухарче (жълто)
//             'Amber': '#FFBF00',  // Амбър
//             'Goldenrod': '#DAA520',  // Златен корн
//             'Khaki': '#F0E68C',  // Хаки
//             'Wheat': '#F5DEB3',  // Пшеница

//             // **Пурпурни и виолетови нюанси**
//             'Purple': '#800080',  // Лилаво
//             'Violet': '#EE82EE',  // Виолетово
//             'Lavender': '#E6E6FA',  // Лавандула
//             'Lavender Blush': '#FFF0F5',  // Лавандулово румени
//             'Medium Purple': '#9370DB',  // Средно лилаво
//             'Plum': '#8E4585',  // Сливов цвят
//             'Orchid': '#DA70D6',  // Орхидея
//             'Purple Blue': '#6A5ACD',  // Лилаво синьо

//             // **Кафяви и техни нюанси**
//             'Brown': '#A52A2A',  // Кафяво
//             'Dark Brown': '#8B4513',  // Тъмно кафяво
//             'Saddle Brown': '#8B4513',  // Кафява седло
//             'Tan': '#D2B48C',  // Загоряла кожа (Тан)
//             'Beige': '#F5F5DC',  // Бежаво

//             // **Други цветове**
//             'Gold': '#FFD700',  // Златно
//             'Blond': '#FAF0BE',  // Блонд
//             'Cyan': '#00FFFF',  // Циан
//             'Aqua': '#00FFFF',  // Аква
//             'Charcoal': '#36454F',  // Въглищно сив
//             'Teal': '#008080',  // Тюркоаз
//             'Peach': '#FFDAB9',  // Праскова
//             'Seafoam': '#9FE2BF',  // Мидена зелена
//             'Turquoise': '#40E0D0',  // Туркуаз
//             'Mint': '#00FF00',  // Лайм
//         };

//         const normalizedColor = colorName.toLowerCase();
//         const colorEntry = Object.entries(colorMap).find(([key]) => 
//             key.toLowerCase() === normalizedColor
//         );
        
//         return colorEntry ? colorEntry[1] : '#FFFFFF';
//     };

//     const getColorDisplay = (consoleName, colorName) => {
//         // Специални случаи за двуцветни конзоли
//         const dualColorConsoles = {
//             'Nintendo Famicom': {
//                 colors: ['#CE2029', '#E8E8E8'],
//                 names: ['Pearl Ruby Red', 'Grey']
//             },
//             'Nintendo NES': {
//                 colors: ['#EAEAE9', '#989692'],
//                 names: ['Vintage Grey', 'Grey']
//             },
//             'PlayStation®5': {
//                 colors: ['#FFFFFF', '#000000'],
//                 names: ['White', 'Black']
//             },
//             'Sega Dreamcast': {
//                 colors: ['#F8F8F8', '#E8E8E8'],
//                 names: ['White', 'Light Grey']
//             }
//         };

//         // Функция за разделяне на цветовете
//         const splitColors = (colorStr) => {
//             if (colorStr.includes('/')) {
//                 return colorStr.split('/').map(c => c.trim());
//             }
//             if (colorStr.toLowerCase().includes(' and ')) {
//                 return colorStr.toLowerCase().split(' and ').map(c => 
//                     c.trim().split(' ').map(word => 
//                         word.charAt(0).toUpperCase() + word.slice(1)
//                     ).join(' ')
//                 );
//             }
//             return null;
//         };

//         // Проверяваме за два цвята в името
//         const colors = colorName && splitColors(colorName);
//         if (colors) {
//             return {
//                 element: (
//                     <span 
//                         className={`${styles.colorSample} ${styles.dualColor}`}
//                         style={{
//                             '--color-left': getColorHex(colors[0]),
//                             '--color-right': getColorHex(colors[1])
//                         }}
//                         title={`${colors[0]} / ${colors[1]}`}
//                     />
//                 ),
//                 label: `${colors[0]} / ${colors[1]}` // Стандартизираме показването с "/"
//             };
//         }

//         // Проверяваме дали конзолата е в списъка с предефинирани двуцветни конзоли
//         if (dualColorConsoles[consoleName]) {
//             const { colors, names } = dualColorConsoles[consoleName];
//             return {
//                 element: (
//                     <span 
//                         className={`${styles.colorSample} ${styles.dualColor}`}
//                         style={{
//                             '--color-left': colors[0],
//                             '--color-right': colors[1]
//                         }}
//                         title={`${names[0]} / ${names[1]}`}
//                     />
//                 ),
//                 label: `${names[0]} / ${names[1]}`
//             };
//         }

//         // За единични цветове връщаме стандартното кръгче
//         return {
//             element: (
//                 <span 
//                     className={styles.colorSample}
//                     style={{ backgroundColor: getColorHex(colorName) }}
//                     title={colorName}
//                 />
//             ),
//             label: colorName
//         };
//     };

//     if (isLoading) {
//         return <Spinner />;
//     }

//     return (
//         <>
//             <ErrorBox 
//                 error={error} 
//                 onClose={clearError} 
//             />
            
//             <div className={styles.consoleInfo}>
//                 <img 
//                     src={currentConsole.imageUrl || DEFAULT_CONSOLE_IMAGE} 
//                     alt={currentConsole.consoleName}
//                     onError={(e) => {
//                         e.target.src = DEFAULT_CONSOLE_IMAGE;
//                     }}
//                 />
//                 <h1>{currentConsole.consoleName}</h1>
                
//                 <div className={styles.details}>
//                     <p className={styles.manufacturer}>
//                         <span className={styles.label}>Manufacturer:</span>
//                         <span className={`${styles.manufacturerName} ${getManufacturerClass(currentConsole.manufacturer, styles)}`}>
//                             {currentConsole.manufacturer}
//                         </span>
//                     </p>
//                     <p>
//                         <span className={styles.label}>Storage:</span> {currentConsole.storageCapacity}
//                     </p>
//                     <p className={styles.colorInfo}>
//                         <span className={styles.label}>Color:</span>
//                         {(() => {
//                             const { element, label } = getColorDisplay(currentConsole.consoleName, currentConsole.color);
//                             return (
//                                 <>
//                                     {label}
//                                     {element}
//                                 </>
//                             );
//                         })()}
//                     </p>
//                     <p>
//                         <span className={styles.label}>Release Date:</span> {currentConsole.releaseDate}
//                     </p>
//                     <p className={styles.price}>
//                         <span className={styles.label}>Price:</span>
//                         <span>{Number(currentConsole.price).toFixed(2)}&nbsp;€</span>
//                     </p>
//                 </div>

//                 {isAuthenticated && isOwner && (
//                     <div className={styles.buttons}>
//                         <Link to={`/consoles/${consoleId}/edit`} className={styles.editBtn}>
//                             Edit
//                         </Link>
//                         <button onClick={onDeleteClick} className={styles.deleteBtn}>
//                             Delete
//                         </button>
//                     </div>
//                 )}
//             </div>

//             <Modal
//                 show={showDeleteModal}
//                 onClose={() => setShowDeleteModal(false)}
//                 onConfirm={onDeleteConfirm}
//                 title="Confirm Delete"
//                 isLoading={isDeleting}
//             >
//                 <p>
//                     Are you sure you want to delete{' '}
//                     <span className={styles.consoleName}>
//                         {currentConsole.consoleName}
//                     </span>
//                     ?
//                 </p>
//                 <p>⚠️ This action cannot be undone!</p>
//             </Modal>
//         </>
//     );
// } 







// src/components/consoles/ConsoleDetails/ConsoleDetails.jsx (Пример)

import { useState, useEffect } from 'react'; // Премахнахме useEffect оттук
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../../context/authContext';
import { useErrorHandling } from '../../../hooks/useErrorHandling'; // Оставяме го за DELETE операцията
import { useConsoleDetails } from '../../../hooks/useConsoleDetails'; // Импорт на новия hook
import * as consoleService from '../../../services/consoleService';
import Modal from '../../common/Modal/Modal';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import Spinner from '../../common/Spinner/Spinner';
import styles from './ConsoleDetails.module.css';
// Импорт на константи и НОВИТЕ utils функции
import { DEFAULT_CONSOLE_IMAGE } from '../../../utils/constants';
import { getColorDisplayInfo, getManufacturerClassKey, formatManufacturerForDisplay } from '../../../utils/consoleDisplayUtils';

export default function ConsoleDetails() {
    const { consoleId } = useParams();
    const { userId, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    // Използваме hook-а за данните на конзолата
    const { consoleData: currentConsole, isLoading: isLoadingConsole, error: fetchError, refetch: refetchConsole } = useConsoleDetails(consoleId);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Използваме useErrorHandling САМО за операцията по изтриване
    const { error: deleteError, clearError: clearDeleteError, executeWithErrorHandling: executeDelete } = useErrorHandling();

    // Пренасочваме, АКО има грешка при зареждането на ДАННИТЕ (от hook-а)
    useEffect(() => {
        if (fetchError) {
            // Може да покажем грешката за момент или директно да навигираме
            console.error("Error detected in component, navigating away:", fetchError);
            navigate('/consoles'); // Пренасочваме, ако конзолата не може да се зареди
        }
    }, [fetchError, navigate]);

    // Изчисляваме дали е собственик СЛЕД като имаме currentConsole
    const isOwner = currentConsole && userId === currentConsole._ownerId;

    // --- Event Handlers ---
    // Тези функции остават в компонента, защото управляват неговия локален state
    // (showDeleteModal, isDeleting) и използват навигация, context и executeDelete.
    // Това е ПРАВИЛНОТО им място. Компонентът отговаря за потребителските интеракции в този екран.

    const onDeleteClick = () => {
        // Изчистваме стари грешки при отваряне на модала
        clearDeleteError();
        setShowDeleteModal(true);
    };

    const onDeleteConfirm = async () => {
        setIsDeleting(true); // Показваме индикатор в модала

        await executeDelete(async () => {
            await consoleService.remove(consoleId);
            // Успешно изтриване - навигираме към списъка
            navigate('/consoles');
        }, {
            errorPrefix: 'Failed to delete console',
            // onError се извиква САМО ако executeDelete хване грешка
            onError: () => {
                // Спираме индикатора за изтриване и оставяме модала отворен,
                // за да се види грешката в ErrorBox
                setIsDeleting(false);
                // Не затваряме модала автоматично при грешка
                // setShowDeleteModal(false);
            }
        });

        // Ако executeDelete НЕ хване грешка, спираме индикатора тук
        // (В случай на успех, навигацията вече ще се е случила)
        // Този ред ще се изпълни само ако има грешка и onError *не* е дефиниран горе или не хвърля нова грешка.
        // За по-сигурно може да се управлява в onError.
         if(!deleteError) { // Ако няма грешка след изпълнението
            setIsDeleting(false);
            setShowDeleteModal(false); // Затваряме модала при УСПЕХ (макар че навигацията ще го скрие)
        }
    };
    // --- Край на Event Handlers ---


    // --- Изчисляване на Динамични Стойности за Рендиране ---
    // Извикваме помощните функции тук, преди return
    const colorInfo = currentConsole ? getColorDisplayInfo(currentConsole.consoleName, currentConsole.color) : null;
    // Вече подаваме само името, функцията връща КЛЮЧА
    const manufacturerClassKey = currentConsole ? getManufacturerClassKey(currentConsole.manufacturer) : '';
    // Комбинираме ключа със styles обекта ТУК
    const manufacturerClassName = manufacturerClassKey ? styles[manufacturerClassKey] : '';
    // НОВО: Форматираме името за показване
    const displayManufacturerName = currentConsole ? formatManufacturerForDisplay(currentConsole.manufacturer) : '';
    // --- Край на Изчисленията ---


    // Условие за зареждане (от hook-а)
    if (isLoadingConsole) {
        return <Spinner />;
    }
    // Ако има грешка при зареждане, useEffect по-горе ще навигира,
    // но за кратко може да не покажем нищо или специфично съобщение
    if (fetchError || !currentConsole) {
        // Може да покажем ErrorBox за fetchError тук, ако не навигираме веднага
        return <ErrorBox error={fetchError || 'Console data could not be loaded.'} onClose={() => navigate('/consoles')} />;
    }
    return (
        <>
            {/* ErrorBox за грешки при ИЗТРИВАНЕ */}
            <ErrorBox
                error={deleteError}
                onClose={clearDeleteError}
            />

            <div className={styles.consoleInfo}>
                <img
                    src={currentConsole.imageUrl || DEFAULT_CONSOLE_IMAGE}
                    alt={currentConsole.consoleName}
                    onError={(e) => {
                        e.target.src = DEFAULT_CONSOLE_IMAGE; // Fallback при грешка на снимката
                    }}
                />
                <h1>{currentConsole.consoleName}</h1>

                <div className={styles.details}>
                    <p className={styles.manufacturer}>
                        <span className={styles.label}>Manufacturer:</span>
                        {/* Прилагаме генерирания клас */}
                        <span className={`${styles.manufacturerName} ${manufacturerClassName}`}>
                            {/* {currentConsole.manufacturer} Показваме оригиналната стойност */}
                            {displayManufacturerName}
                        </span>
                    </p>
                    <p>
                        <span className={styles.label}>Storage:</span> {currentConsole.storageCapacity}
                    </p>
                    <p className={styles.colorInfo}>
                        <span className={styles.label}>Color:</span>
                        {/* Рендираме цвета на база colorInfo */}
                        {colorInfo && (
                            <>
                                {colorInfo.label}
                                {colorInfo.hexColor && (
                                    <span
                                        className={styles.colorSample}
                                        style={{ backgroundColor: colorInfo.hexColor }}
                                        title={colorInfo.label}
                                    />
                                )}
                                {colorInfo.hexColors && (
                                    <span
                                        className={`${styles.colorSample} ${styles.dualColor}`}
                                        style={{
                                            '--color-left': colorInfo.hexColors[0],
                                            '--color-right': colorInfo.hexColors[1]
                                        }}
                                        title={colorInfo.label}
                                    />
                                )}
                            </>
                        )}
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
                onClose={() => setShowDeleteModal(false)} // Позволяваме затваряне без потвърждение
                onConfirm={onDeleteConfirm}
                title="Confirm Delete"
                isLoading={isDeleting} // Показва индикатор по време на изтриване
            >
                <p>
                    Are you sure you want to delete{' '}
                    <span className={styles.consoleName}>
                        {currentConsole.consoleName}
                    </span>
                    ?
                </p>
                <p>⚠️ This action cannot be undone!</p>
                {/* Може да покажем deleteError и тук, ако искаме */}
                {deleteError && <p style={{color: 'red', marginTop: '10px'}}>Error: {deleteError}</p>}
            </Modal>
        </>
    );
}