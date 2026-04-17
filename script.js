/* style.css – RADIO GLADOON : NEO-CYBER GREEN EDITION */
/* Полная переработка: глубина, детализация, необычные эффекты */

:root {
  --bg-void: #010402;
  --bg-deep: #051208;
  --glass-1: rgba(0, 25, 10, 0.35);
  --glass-2: rgba(0, 40, 15, 0.25);
  --glass-border: rgba(0, 255, 120, 0.28);
  --glass-highlight: rgba(0, 255, 180, 0.12);
  --neon-core: #0f0;
  --neon-glow: #00ffaa;
  --neon-dim: #00994d;
  --accent: #00e673;
  --text-bright: #e6ffee;
  --text-muted: #9fd8b2;
  --text-dim: #5e9e74;
  --shadow-neon: 0 0 28px rgba(0, 255, 130, 0.45), 0 0 60px rgba(0, 200, 80, 0.2);
  --shadow-deep: 0 25px 50px -8px #000000cc;
  --font-main: "Inter", system-ui, -apple-system, sans-serif;
}

* { box-sizing: border-box; margin: 0; }

html, body {
  height: 100%;
  background: var(--bg-void);
  overflow: hidden;
}

body {
  font-family: var(--font-main);
  color: var(--text-bright);
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(0, 100, 30, 0.25) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 70%, rgba(0, 200, 80, 0.18) 0%, transparent 45%),
    linear-gradient(145deg, #020803 0%, #0b1a0b 100%);
  position: relative;
}

/* ----- CANVAS (зеленый фильтр + дополнительный блеск) ----- */
#fogCanvas {
  filter: hue-rotate(125deg) saturate(2) brightness(0.9) contrast(1.1);
  mix-blend-mode: screen;
  opacity: 0.95;
  pointer-events: none;
}

/* ----- СЛОИ АТМОСФЕРЫ (улучшенные) ----- */
.noise,
.vignette,
.scanlines,
.start-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

/* Шум с движением и зеленоватым оттенком */
.noise {
  background: 
    repeating-radial-gradient(circle at 20% 30%, rgba(0, 255, 70, 0.04) 0px, transparent 2px),
    repeating-linear-gradient(45deg, rgba(0, 20, 0, 0.15) 0px, transparent 1px, transparent 4px),
    url('data:image/svg+xml;utf8,<svg width="4" height="4" viewBox="0 0 4 4" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1" height="1" fill="rgba(0,255,0,0.03)"/><rect x="2" y="2" width="1" height="1" fill="rgba(0,255,0,0.02)"/></svg>');
  mix-blend-mode: overlay;
  animation: noiseDrift 20s infinite alternate;
  opacity: 0.65;
  z-index: 2;
}

/* Виньетка с зеленым отливом */
.vignette {
  background: radial-gradient(circle at 50% 40%, transparent 25%, rgba(0, 30, 10, 0.45) 65%, #010a02 95%);
  z-index: 3;
  mix-blend-mode: multiply;
}

/* Сканлайны с глитч-разрывами (псевдоэлемент для нерегулярности) */
.scanlines {
  background: repeating-linear-gradient(180deg, 
    rgba(0, 255, 0, 0.025) 0px, 
    transparent 2px, 
    transparent 5px,
    rgba(0, 0, 0, 0.1) 6px);
  z-index: 4;
  opacity: 0.6;
}
.scanlines::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(0,255,0,0.02) 20%, transparent 40%, rgba(0,255,0,0.04) 60%, transparent 80%);
  animation: scanGlitch 7s infinite steps(3);
  pointer-events: none;
}

/* ----- СТАРТОВЫЙ ОВЕРЛЕЙ (сложное стекло, неон, градиенты) ----- */
.start-overlay {
  z-index: 30;
  display: grid;
  place-items: center;
  backdrop-filter: blur(24px) brightness(0.55) saturate(1.8);
  -webkit-backdrop-filter: blur(24px) brightness(0.55) saturate(1.8);
  background: radial-gradient(circle at 30% 30%, rgba(0, 60, 20, 0.3), rgba(0, 10, 0, 0.7));
  transition: opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1), visibility 0.5s;
  pointer-events: auto;
}

.start-overlay.hidden {
  opacity: 0;
  visibility: hidden;
}

.start-card {
  width: min(94vw, 560px);
  padding: 40px 36px;
  border-radius: 64px;
  background: rgba(0, 20, 5, 0.45);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1.5px solid rgba(0, 255, 120, 0.3);
  box-shadow: 
    0 30px 70px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(0, 255, 100, 0.1) inset,
    0 0 50px rgba(0, 255, 130, 0.2);
  text-align: center;
  position: relative;
  overflow: hidden;
}
/* Блик по краю */
.start-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, #0f08, #0f02, transparent 60%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.start-kicker {
  font-size: 0.85rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--neon-core);
  text-shadow: 0 0 15px var(--neon-glow), 0 0 30px #00aa55;
  margin-bottom: 20px;
  animation: flicker 4s infinite;
}

.start-card h2 {
  font-size: clamp(2.4rem, 8vw, 4rem);
  font-weight: 800;
  margin: 0 0 24px;
  background: linear-gradient(135deg, #f0fff0, #b0ffc0, #70ffa0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
  filter: drop-shadow(0 0 25px #00aa55);
}

.start-text {
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 36px;
  font-weight: 400;
  text-shadow: 0 0 6px #003311;
}

.start-button {
  background: rgba(0, 30, 5, 0.7);
  border: 2px solid var(--neon-core);
  border-radius: 60px;
  padding: 16px 36px;
  min-width: 260px;
  font-family: inherit;
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--neon-core);
  backdrop-filter: blur(15px);
  box-shadow: 0 0 30px rgba(0, 255, 100, 0.5), 0 8px 16px #00000066, inset 0 0 10px #0f04;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-shadow: 0 0 12px currentColor;
  position: relative;
  overflow: hidden;
}
.start-button::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, #0f08 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}
.start-button:hover::after { opacity: 0.15; }
.start-button:hover {
  background: #003311;
  color: #e0ffe0;
  border-color: #aaffaa;
  box-shadow: 0 0 60px var(--neon-glow), 0 0 100px #00aa55, 0 6px 12px black;
  transform: scale(1.03) translateY(-2px);
}
.start-button:active { transform: scale(0.98); }
.start-button.is-loading {
  opacity: 0.8;
  filter: grayscale(0.3);
  pointer-events: none;
}

/* ----- ОСНОВНОЙ КОНТЕЙНЕР ----- */
.app {
  position: relative;
  z-index: 10;
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 28px 36px;
  gap: 22px;
  pointer-events: auto;
}

/* ----- СТЕКЛЯННЫЕ ПАНЕЛИ С УЛУЧШЕННЫМИ ЭФФЕКТАМИ ----- */
.radio-shell,
.track-card,
.footer-panel {
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  background: var(--glass-1);
  border: 1.5px solid var(--glass-border);
  border-radius: 48px;
  box-shadow: var(--shadow-deep), 0 0 0 1px rgba(0, 255, 150, 0.1) inset, var(--shadow-neon);
  transition: box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}
/* Дополнительный внутренний блик */
.radio-shell::after,
.track-card::after,
.footer-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 20% 30%, rgba(0, 255, 150, 0.05), transparent 70%);
  pointer-events: none;
}

.radio-shell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 32px;
  background: linear-gradient(145deg, rgba(0, 30, 10, 0.55), rgba(0, 10, 5, 0.7));
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand-mark {
  width: 70px;
  height: 70px;
  border-radius: 24px;
  background: radial-gradient(circle at 30% 30%, #c0ffc0, #009944 80%, #002211);
  box-shadow: 0 0 40px #00dd66, inset 0 0 15px #aaffaa, 0 6px 12px #00000080;
  border: 1px solid #7dffb0;
  transform: rotate(3deg);
  transition: transform 0.2s;
}
.brand-mark:hover { transform: rotate(0deg) scale(1.02); }

.eyebrow {
  color: var(--neon-dim);
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  margin-bottom: 8px;
  text-shadow: 0 0 10px #00994d;
  font-weight: 500;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  background: linear-gradient(135deg, #eeffee, #b0ffc0, #80ffaa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 30px #00cc66, 0 0 15px #00aa44;
  filter: drop-shadow(0 2px 4px black);
}

.status-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 22px;
  border-radius: 60px;
  background: rgba(0, 30, 5, 0.6);
  border: 1px solid rgba(0, 255, 120, 0.35);
  backdrop-filter: blur(8px);
  color: var(--text-bright);
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: inset 0 2px 6px #00000066, 0 4px 10px #0000004d;
  text-shadow: 0 0 5px #003311;
  letter-spacing: 0.02em;
}

.dot.live {
  width: 12px;
  height: 12px;
  background: #0f0;
  box-shadow: 0 0 25px #0f0, 0 0 8px #0f0, inset 0 0 4px white;
  border-radius: 50%;
  animation: pulseLive 1.2s infinite alternate;
  border: 1px solid #aaffaa;
}

/* ----- ЦЕНТРАЛЬНАЯ ОБЛАСТЬ С ЯДРОМ (эпично) ----- */
.centerpiece {
  position: relative;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.halo {
  position: absolute;
  border-radius: 50%;
  filter: blur(45px);
  opacity: 0.5;
  mix-blend-mode: screen;
  pointer-events: none;
  z-index: 1;
}

.halo-a {
  width: min(70vw, 700px);
  height: min(70vw, 700px);
  background: radial-gradient(circle, #00ffaa 0%, #00aa4420 30%, transparent 70%);
  animation: floatA 8s ease-in-out infinite alternate;
}
.halo-b {
  width: min(50vw, 500px);
  height: min(50vw, 500px);
  background: radial-gradient(circle, #88ffbb 0%, #22aa5530 25%, transparent 70%);
  animation: floatB 11s ease-in-out infinite alternate;
}

.core {
  position: relative;
  width: min(26vw, 280px);
  height: min(26vw, 280px);
  display: grid;
  place-items: center;
  filter: drop-shadow(0 0 60px #00ff80) drop-shadow(0 0 20px #0f0);
  z-index: 10;
  transition: transform 0.05s;
}

.core-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(0, 255, 150, 0.7);
  background: radial-gradient(circle at 30% 30%, rgba(0, 255, 100, 0.25), transparent 70%);
  box-shadow: 0 0 80px #00cc66, inset 0 0 20px #0f0;
  animation: rotateSlow 20s linear infinite;
}

.core-inner {
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #eaffea, #00aa55 60%, #003311);
  box-shadow: inset 0 0 50px #aaffaa, 0 0 100px #00dd77, 0 0 20px #0f0 inset;
  border: 1px solid #aaffcc;
  animation: pulseCore 3s infinite alternate;
}
/* дополнительная деталь - "энергетическое кольцо" */
.core::after {
  content: "";
  position: absolute;
  inset: -8%;
  border-radius: 50%;
  border: 1px dashed rgba(0, 255, 120, 0.35);
  animation: spin 12s linear infinite;
  pointer-events: none;
}

/* ----- КАРТОЧКА ТРЕКА (максимальное стекло) ----- */
.track-card {
  margin-top: min(26vw, 280px);
  padding: 24px 34px 30px;
  width: min(92vw, 860px);
  text-align: center;
  z-index: 10;
  background: linear-gradient(145deg, rgba(0, 30, 10, 0.6), rgba(0, 15, 5, 0.8));
  border-radius: 56px;
  backdrop-filter: blur(28px);
}
/* глитч-рамка */
.track-card::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(45deg, #0f02, transparent 40%, #0f03 80%);
  opacity: 0.4;
  z-index: -1;
  filter: blur(6px);
}

.track-label {
  font-size: 0.8rem;
  letter-spacing: 0.4em;
  color: var(--neon-dim);
  text-transform: uppercase;
  margin-bottom: 16px;
  text-shadow: 0 0 12px #00994d;
  font-weight: 600;
}

.track-title {
  font-size: clamp(1.8rem, 6vw, 3.2rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 8px 0 16px;
  background: linear-gradient(135deg, #fafffa, #d0ffdd, #a0ffb0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 25px #00aa55);
  letter-spacing: -0.01em;
}

.track-subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
  font-weight: 400;
  text-shadow: 0 0 8px #001a00;
  letter-spacing: 0.03em;
}

/* ----- НИЖНЯЯ ПАНЕЛЬ (индикаторы с неоном) ----- */
.footer-panel {
  display: grid;
  grid-template-columns: 240px minmax(260px, 380px) 1fr;
  gap: 28px;
  align-items: center;
  padding: 20px 32px;
  background: linear-gradient(145deg, rgba(0, 25, 8, 0.5), rgba(0, 12, 4, 0.75));
  border-radius: 48px;
}

.meter-label,
.volume-label {
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.75rem;
  margin-bottom: 10px;
  text-shadow: 0 0 8px #005522;
  font-weight: 600;
}

.meter {
  height: 16px;
  border-radius: 30px;
  background: #041208;
  border: 1px solid #1a5a2a;
  box-shadow: inset 0 4px 10px #000000, 0 0 12px #0f02;
  overflow: hidden;
}

.meter span {
  display: block;
  height: 100%;
  width: 6%;
  border-radius: 30px;
  background: linear-gradient(90deg, #00dd66, #aaffaa, #00cc44);
  box-shadow: 0 0 30px #0f0, 0 0 10px #0f0 inset, 0 0 5px white inset;
  transform-origin: left;
  transition: transform 0.08s linear;
  border-right: 2px solid #aaffaa;
}

.volume-wrap {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: 
    "label value"
    "slider slider";
  gap: 8px 14px;
  align-items: center;
}

.volume-value {
  grid-area: value;
  color: var(--neon-core);
  font-weight: 800;
  text-shadow: 0 0 15px #0f0, 0 0 5px #0f0;
  font-size: 1.1rem;
}

#volumeSlider {
  grid-area: slider;
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  height: 12px;
  border-radius: 30px;
  background: linear-gradient(90deg, #004411, #00aa44);
  border: 1px solid #33cc66;
  box-shadow: inset 0 2px 8px #000, 0 0 15px #0f04;
}

#volumeSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e0ffe0;
  border: 2px solid #0f0;
  box-shadow: 0 0 35px #0f0, 0 0 12px #0f0 inset, 0 2px 8px black;
  cursor: pointer;
  transition: 0.15s;
}
#volumeSlider::-webkit-slider-thumb:hover { transform: scale(1.15); background: white; }
#volumeSlider::-moz-range-thumb {
  width: 26px; height: 26px; border-radius: 50%; background: #e0ffe0; border: 2px solid #0f0; box-shadow: 0 0 35px #0f0; cursor: pointer;
}

.hint {
  color: var(--text-dim);
  font-size: 0.95rem;
  line-height: 1.5;
  border-left: 3px solid var(--neon-dim);
  padding-left: 22px;
  text-shadow: 0 0 6px #002211;
  font-weight: 400;
}

/* ----- СОСТОЯНИЕ PLAYING (доп. свечение) ----- */
body.is-playing .radio-shell,
body.is-playing .footer-panel,
body.is-playing .track-card {
  box-shadow: var(--shadow-deep), 0 0 60px rgba(0, 255, 100, 0.3), inset 0 0 20px #0f02;
  border-color: #0f08;
}

/* ----- АНИМАЦИИ (продвинутые) ----- */
@keyframes pulseLive {
  0% { opacity: 0.8; transform: scale(0.9); box-shadow: 0 0 10px #0f0; }
  100% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 30px #0f0, 0 0 60px #00aa55; }
}

@keyframes floatA {
  0% { transform: translate3d(0,0,0) scale(1); opacity: 0.45; }
  50% { transform: translate3d(3%, -3%, 0) scale(1.1); opacity: 0.7; }
  100% { transform: translate3d(0,0,0) scale(1); opacity: 0.45; }
}
@keyframes floatB {
  0% { transform: translate3d(0,0,0) scale(1); opacity: 0.4; }
  50% { transform: translate3d(-3%, 4%, 0) scale(0.92); opacity: 0.65; }
  100% { transform: translate3d(0,0,0) scale(1); opacity: 0.4; }
}

@keyframes noiseDrift {
  0% { transform: translate(0,0); }
  25% { transform: translate(0.8%, -0.5%); }
  50% { transform: translate(-0.4%, 0.9%); }
  75% { transform: translate(0.6%, 0.2%); }
  100% { transform: translate(0,0); }
}

@keyframes scanGlitch {
  0%,100% { opacity: 0.3; transform: translateX(0); }
  20% { opacity: 0.7; transform: translateX(-2%); }
  40% { opacity: 0.1; transform: translateX(1%); }
  60% { opacity: 0.5; transform: translateX(-1%); }
}

@keyframes rotateSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes pulseCore {
  0% { box-shadow: inset 0 0 30px #aaffaa, 0 0 60px #00dd77; }
  100% { box-shadow: inset 0 0 60px #ccffcc, 0 0 120px #00ff88, 0 0 30px #0f0; }
}
@keyframes flicker {
  0%,18%,22%,25%,53%,57%,100% { opacity: 1; text-shadow: 0 0 15px var(--neon-glow); }
  20%,24%,55% { opacity: 0.6; text-shadow: 0 0 5px var(--neon-glow); }
}

/* ----- АДАПТИВ ----- */
@media (max-width: 1024px) {
  .footer-panel { grid-template-columns: 1fr 1.5fr; }
  .hint { grid-column: span 2; border-left: none; padding-left: 0; }
}
@media (max-width: 860px) {
  .app { padding: 16px; }
  .radio-shell, .footer-panel, .track-card { border-radius: 32px; }
  .radio-shell { flex-direction: column; align-items: flex-start; gap: 20px; }
  .status-row { justify-content: flex-start; }
  .track-card { margin-top: min(48vw, 260px); }
  .core { width: min(40vw, 220px); height: min(40vw, 220px); }
  .footer-panel { grid-template-columns: 1fr; gap: 20px; }
}
