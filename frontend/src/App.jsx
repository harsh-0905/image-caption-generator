import { useState, useCallback } from "react";
import ImageUploader from "./components/ImageUploader";
import StyleSelector from "./components/StyleSelector";
import CaptionCard from "./components/CaptionCard";
import { useCaptions } from "./hooks/useCaptions";
import styles from "./App.module.css";

const STYLE_KEYS = ["basic", "funny", "professional", "instagram"];

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedStyles, setSelectedStyles] = useState(["basic", "funny", "professional", "instagram"]);
  const { captions, loading, error, generate, reset } = useCaptions();

  const handleFile = useCallback((f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    reset();
  }, [reset]);

  const handleGenerate = () => {
    if (file) generate(file, selectedStyles);
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    reset();
  };

  const resultKeys = captions
    ? STYLE_KEYS.filter((k) => captions[k])
    : [];

  return (
    <div className={styles.root}>
      {/* Background orbs */}
      <div className={styles.orb1} aria-hidden />
      <div className={styles.orb2} aria-hidden />

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>⬡</span>
          <span className={styles.logoText}>CaptionAI</span>
        </div>
        <p className={styles.tagline}>Drop an image. Get captions that slap.</p>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          {/* Upload area */}
          <section className={styles.section}>
            <ImageUploader onFile={handleFile} file={file} preview={preview} />
          </section>

          {/* Style selector */}
          {file && (
            <section className={styles.section}>
              <StyleSelector selected={selectedStyles} onChange={setSelectedStyles} />
            </section>
          )}

          {/* Actions */}
          {file && (
            <section className={styles.actions}>
              <button
                className={styles.generateBtn}
                onClick={handleGenerate}
                disabled={loading || selectedStyles.length === 0}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    Generating…
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Generate Captions
                  </>
                )}
              </button>
              <button className={styles.resetBtn} onClick={handleReset}>
                Start over
              </button>
            </section>
          )}

          {/* Error */}
          {error && (
            <div className={styles.errorBox} role="alert">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <section className={styles.results}>
              {selectedStyles.map((s) => (
                <div key={s} className={styles.skeleton} />
              ))}
            </section>
          )}

          {/* Results */}
          {!loading && captions && resultKeys.length > 0 && (
            <section className={styles.results}>
              <p className={styles.resultsHeading}>
                <span className={styles.dot} /> Your captions are ready
              </p>
              <div className={styles.grid}>
                {resultKeys.map((key, i) => (
                  <div key={key} style={{ animationDelay: `${i * 80}ms` }}>
                    <CaptionCard type={key} text={captions[key]} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        Powered by OpenAI Vision · Built with FastAPI + React
      </footer>
    </div>
  );
}
