import { FileText, Headphones, Lock, ShieldCheck } from "lucide-react";
import styles from "./SocialProof.module.css"

export default function SocialProof () {
    const trustIndicators = [
        { icon: <ShieldCheck size={24} className={styles.trustIcon} />, text: "Trusted since 2008" },
        { icon: <FileText size={24} className={styles.trustIcon} />, text: "Multiple regulatory licenses" },
        { icon: <Headphones size={24} className={styles.trustIcon} />, text: "24/7 customer support" },
        { icon: <Lock size={24} className={styles.trustIcon} />, text: "PCI DSS certified" }
    ];

    return (
        <div className={styles.trustSection}>
            <div className={styles.maxWidthWrapper}>
                <div className={styles.trustGrid}>
                    {trustIndicators.map((item, index) => (
                        <div key={index} className={styles.trustItem}>
                            {item.icon}
                            <span className={styles.trustText}>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}