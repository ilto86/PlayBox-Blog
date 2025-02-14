import styles from './Home.module.css';

export default function Home() {
    return (
        <section className={styles.home}>
            <h1>Welcome to Gaming Console Collection</h1>
            <p>Discover the best gaming consoles in one place</p>
            
            <div className={styles.actions}>
                <a href="/consoles" className={styles.button}>Browse Consoles</a>
            </div>
        </section>
    );
} 