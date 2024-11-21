import { useState, useEffect } from 'react';
import './ConsoleList.css';

export default function ConsoleList() {
    const [consoles, setConsoles] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3030/jsonstore/consoles')
            .then(res => res.json())
            .then(data => {
                const consolesArray = Object.values(data);
                setConsoles(consolesArray);
            });
    }, []);

    return (
        <div className="console-list">
            {consoles.map(console => (
                <article key={console._id} className="console-card">
                    <img src={console.imageUrl} alt={console.consoleName} />
                    <div className="console-info">
                        <h2>{console.consoleName}</h2>
                        <p className="console-details">
                            <strong>Manufacturer:</strong> {console.manufacturer}
                        </p>
                        <p className="console-details">
                            <strong>Storage:</strong> {console.storageCapacity}
                        </p>
                        <p className="console-details">
                            <strong>Color:</strong> {console.color}
                        </p>
                        <p className="console-details">
                            <strong>Release Date:</strong> {console.releaseDate}
                        </p>
                        <p className="console-price">${console.price}</p>
                    </div>
                </article>
            ))}
        </div>
    );
} 