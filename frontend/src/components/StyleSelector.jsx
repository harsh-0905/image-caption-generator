import styles from "./StyleSelector.module.css";

const STYLES = [
  { id: "basic",        label: "Basic",           emoji: "📝", desc: "Clear & factual" },
  { id: "funny",        label: "Funny",            emoji: "😂", desc: "Witty & humorous" },
  { id: "professional", label: "Professional",     emoji: "💼", desc: "Formal & polished" },
  { id: "instagram",    label: "Instagram",        emoji: "✨", desc: "Trendy + hashtags" },
];

export default function StyleSelector({ selected, onChange }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      if (selected.length === 1) return; // always keep at least one
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className={styles.wrap}>
      <p className={styles.heading}>Caption styles</p>
      <div className={styles.grid}>
        {STYLES.map((s) => {
          const active = selected.includes(s.id);
          return (
            <button
              key={s.id}
              className={`${styles.chip} ${active ? styles.active : ""}`}
              onClick={() => toggle(s.id)}
              aria-pressed={active}
            >
              <span className={styles.emoji}>{s.emoji}</span>
              <span className={styles.label}>{s.label}</span>
              <span className={styles.desc}>{s.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
