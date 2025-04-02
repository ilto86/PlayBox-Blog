<div className={styles.formGroup}>
    <label htmlFor="color">Color:</label>
    <input
        type="text"
        id="color"
        name="color"
        value={formData.color}
        onChange={handleChange}
        placeholder="e.g. Black / White or Black and White"
    />
    <small className={styles.hint}>
        For dual-colored consoles, use "Color1 and Color2" or "Color1 / Color2"
    </small>
</div> 