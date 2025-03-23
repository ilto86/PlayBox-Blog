// import { useState } from 'react';
// import './CreateConsole.css';

// export default function CreateConsole() {
//     const [formData, setFormData] = useState({
//         consoleName: '',
//         manufacturer: '',
//         storageCapacity: '',
//         color: '',
//         releaseDate: '',
//         price: '',
//         imageUrl: ''
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault();
        
//         fetch('http://localhost:3030/jsonstore/consoles', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         })
//             .then(res => res.json())
//             .then(data => {
//                 // Тук можете да добавите пренасочване към списъка
//                 console.log('Успешно добавена конзола:', data);
//             })
//             .catch(err => console.error('Грешка при добавяне:', err));
//     };

//     const handleChange = (e) => {
//         setFormData(state => ({
//             ...state,
//             [e.target.name]: e.target.value
//         }));
//     };

//     return (
//         <div className="create-console">
//             <h2>Добави нова конзола</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label htmlFor="consoleName">Име на конзолата:</label>
//                     <input
//                         type="text"
//                         id="consoleName"
//                         name="consoleName"
//                         value={formData.consoleName}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="manufacturer">Производител:</label>
//                     <input
//                         type="text"
//                         id="manufacturer"
//                         name="manufacturer"
//                         value={formData.manufacturer}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="storageCapacity">Капацитет:</label>
//                     <input
//                         type="text"
//                         id="storageCapacity"
//                         name="storageCapacity"
//                         value={formData.storageCapacity}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="color">Цвят:</label>
//                     <input
//                         type="text"
//                         id="color"
//                         name="color"
//                         value={formData.color}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="releaseDate">Дата на излизане:</label>
//                     <input
//                         type="text"
//                         id="releaseDate"
//                         name="releaseDate"
//                         value={formData.releaseDate}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="price">Цена:</label>
//                     <input
//                         type="number"
//                         id="price"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="imageUrl">URL на изображение:</label>
//                     <input
//                         type="url"
//                         id="imageUrl"
//                         name="imageUrl"
//                         value={formData.imageUrl}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Добави конзола</button>
//             </form>
//         </div>
//     );
// }




import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import * as consoleService from '../../services/consoleService';
import { useForm } from '../../hooks/useForm';
import styles from './CreateConsole.module.css';

export default function CreateConsole() {
    const navigate = useNavigate();
    const { userId } = useAuthContext();
    
    const { values, onChange, onSubmit } = useForm({
        consoleName: '',
        manufacturer: '',
        storageCapacity: '',
        color: '',
        releaseDate: '',
        price: '',
        imageUrl: ''
    }, async (formData) => {
        try {
            await consoleService.create({
                ...formData,
                _ownerId: userId
            });
            
            navigate('/consoles');
        } catch (err) {
            console.log('Create error:', err);
        }
    });

    return (
        <section className={styles.create}>
            <form id="create" onSubmit={onSubmit}>
                <div className={styles.container}>
                    <h1>Create Console</h1>
                    <label htmlFor="consoleName">Console name:</label>
                    <input 
                        type="text" 
                        id="consoleName" 
                        name="consoleName" 
                        value={values.consoleName}
                        onChange={onChange}
                        placeholder="Enter console name..." 
                    />

                    <label htmlFor="manufacturer">Manufacturer:</label>
                    <input 
                        type="text" 
                        id="manufacturer" 
                        name="manufacturer" 
                        value={values.manufacturer}
                        onChange={onChange}
                        placeholder="Enter manufacturer..." 
                    />

                    <label htmlFor="storageCapacity">Storage Capacity:</label>
                    <input 
                        type="text" 
                        id="storageCapacity" 
                        name="storageCapacity" 
                        value={values.storageCapacity}
                        onChange={onChange}
                        placeholder="Enter storage capacity..." 
                    />

                    <label htmlFor="color">Color:</label>
                    <input 
                        type="text" 
                        id="color" 
                        name="color" 
                        value={values.color}
                        onChange={onChange}
                        placeholder="Enter color..." 
                    />

                    <label htmlFor="releaseDate">Release Date:</label>
                    <input 
                        type="text" 
                        id="releaseDate" 
                        name="releaseDate" 
                        value={values.releaseDate}
                        onChange={onChange}
                        placeholder="Enter release date..." 
                    />

                    <label htmlFor="price">Price:</label>
                    <input 
                        type="number" 
                        id="price" 
                        name="price" 
                        value={values.price}
                        onChange={onChange}
                        placeholder="Enter price..." 
                    />

                    <label htmlFor="imageUrl">Image:</label>
                    <input 
                        type="text" 
                        id="imageUrl" 
                        name="imageUrl" 
                        value={values.imageUrl}
                        onChange={onChange}
                        placeholder="Upload a photo..." 
                    />

                    <input className={styles.btnSubmit} type="submit" value="Create Console" />
                </div>
            </form>
        </section>
    );
}