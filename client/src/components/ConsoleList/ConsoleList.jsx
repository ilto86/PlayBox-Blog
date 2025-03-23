// import { useState, useEffect } from 'react';
// import './ConsoleList.css';

// export default function ConsoleList() {
//     const [consoles, setConsoles] = useState([]);

//     useEffect(() => {
//         fetch('http://localhost:3030/jsonstore/consoles')
//             .then(res => res.json())
//             .then(data => {
//                 const consolesArray = Object.values(data);
//                 setConsoles(consolesArray);
//             });
//     }, []);

//     return (
//         <div className="console-list">
//             {consoles.map(console => (
//                 <article key={console._id} className="console-card">
//                     <img src={console.imageUrl} alt={console.consoleName} />
//                     <div className="console-info">
//                         <h2>{console.consoleName}</h2>
//                         <p className="console-details">
//                             <strong>Manufacturer:</strong> {console.manufacturer}
//                         </p>
//                         <p className="console-details">
//                             <strong>Storage:</strong> {console.storageCapacity}
//                         </p>
//                         <p className="console-details">
//                             <strong>Color:</strong> {console.color}
//                         </p>
//                         <p className="console-details">
//                             <strong>Release Date:</strong> {console.releaseDate}
//                         </p>
//                         <p className="console-price">${console.price}</p>
//                     </div>
//                 </article>
//             ))}
//         </div>
//     );
// } 


import { useEffect, useState } from 'react';
import * as consoleService from '../../services/consoleService';
import styles from './ConsoleList.module.css';
import { Link } from 'react-router-dom';

export default function ConsoleList() {
    const [consoles, setConsoles] = useState([]);

    useEffect(() => {
        consoleService.getAll()
            .then(result => setConsoles(result))
            .catch(err => console.log(err));
    }, []);

    return (
        <section className={styles.catalog}>
            <h1>All Gaming Consoles</h1>

            {consoles.map(console => (
                <div key={console._id} className={styles.allConsoles}>
                    <div className={styles.allConsolesInfo}>
                        <img src={console.imageUrl} alt={console.consoleName} />
                        <h6>{console.consoleName}</h6>
                        <h2>{console.manufacturer}</h2>
                        <Link 
                            to={`/consoles/${console._id}`} 
                            className={styles.detailsButton}
                        >
                            Details
                        </Link>
                    </div>
                </div>
            ))}

            {consoles.length === 0 && (
                <h3 className={styles.noArticles}>No consoles yet</h3>
            )}
        </section>
    );
}