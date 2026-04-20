import { useState, useRef, useCallback } from "react";
import styles from "./ImageUploader.module.css";

const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_MB = 10;

export default function ImageUploader({ onFile, file, preview }) {
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const inputRef = useRef(null);

  const validate = useCallback((f) => {
    if (!ACCEPTED.includes(f.type)) {
      setFileError("Only JPEG, PNG, GIF, or WEBP images are supported.");
      return false;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setFileError(`File too large. Max size is ${MAX_MB}MB.`);
      return false;
    }
    setFileError("");
    return true;
  }, []);

  const handleFile = useCallback(
    (f) => { if (validate(f)) onFile(f); },
    [validate, onFile]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const onInputChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  };

  if (preview) {
    return (
      <div className={styles.previewWrap}>
        <img src={preview} alt="Uploaded preview" className={styles.preview} />
        <button className={styles.changeBtn} onClick={() => inputRef.current?.click()}>
          <span>↺</span> Change Image
        </button>
        <input ref={inputRef} type="file" accept={ACCEPTED.join(",")} onChange={onInputChange} hidden />
      </div>
    );
  }

  return (
    <div
      className={`${styles.dropzone} ${dragging ? styles.dragging : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      aria-label="Upload image"
    >
      <input ref={inputRef} type="file" accept={ACCEPTED.join(",")} onChange={onInputChange} hidden />

      <div className={styles.icon}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="40" height="40" rx="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4"/>
          <path d="M24 16v16M16 24l8-8 8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <p className={styles.label}>
        {dragging ? "Drop it here!" : "Drop an image or click to browse"}
      </p>
      <p className={styles.sub}>JPEG · PNG · GIF · WEBP &nbsp;·&nbsp; Max 10 MB</p>

      {fileError && <p className={styles.error}>{fileError}</p>}
    </div>
  );
}
