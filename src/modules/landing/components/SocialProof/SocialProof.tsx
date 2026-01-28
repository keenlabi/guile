import styles from "./SocialProof.module.css"

export default function SocialProof () {
    const stats = [
        { value: "$24B+", label: "Quarterly Volume" },
        { value: "100K+", label: "Verified Users" },
        { value: "<50ms", label: "Execution Time" },
        { value: "24/7", label: "Support" }
    ];

    return (
        <div className={styles.statsSection}>
            <div className={styles.maxWidthWrapper}>
                <div className={styles.statsGrid}>
                    {stats.map((item, index) => (
                        <div key={index} className={styles.statItem}>
                            <span className={styles.statValue}>{item.value}</span>
                            <span className={styles.statLabel}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}