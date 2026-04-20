import { useState } from "react";
import styles from "./CaptionCard.module.css";

const META = {
  basic:        { label: "Basic",        emoji: "📝", color: "#8888aa" },
  funny:        { label: "Funny",        emoji: "😂", color: "#f5c842" },
  professional: { label: "Professional", emoji: "💼", color: "#4affa3" },
  instagram:    { label: "Instagram",    emoji: "✨", color: "#a394ff" },
};

export default function CaptionCard({ type, text }) {
  const [copied, setCopied] = useState(false);
  const meta = META[type] || META.basic;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  return (
    <div className={styles.card} style={{ "--card-accent": meta.color }}>
      <div className={styles.header}>
        <span className={styles.badge}>
          <span>{meta.emoji}</span>
          <span>{meta.label}</span>
        </span>
        <button className={`${styles.copyBtn} ${copied ? styles.copied : ""}`} onClick={copy}>
          {copied ? (
            <>
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Copied!
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M11 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" stroke="currentColor" strokeWidth="1.5"/></svg>
              Copy
            </>
          )}
        </button>
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
