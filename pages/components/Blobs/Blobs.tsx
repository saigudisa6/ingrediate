import styles from './Blobs.module.css'

export default function Bolbs({getMessage}: {getMessage: () => string}){

    return (
        <div className="flex justify-center items-center w-full h-full relative pt-60">
            <div className={styles.floatingBlob}></div>
            <div className={styles.floatingBlobSupport}>
                <p className="text-2xl font-serif text-center" style={{ color: 'black' }}>
                    {getMessage()}
                </p>
            </div>
            <div className={styles.blob1}></div>
            <div className={styles.blob2}></div>
            <div className={styles.blob3}></div>
            <div className={styles.blob4}></div>
            <div className={styles.blob5}></div>
            <div className={styles.blob6}></div>
        </div>
        
    )
}