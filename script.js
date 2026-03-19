(() => {
  const audio = document.getElementById("radioPlayer");
  const trackTitle = document.getElementById("trackTitle");
  const trackSubtitle = document.getElementById("trackSubtitle");
  const modePill = document.getElementById("modePill");
  const autoplayPill = document.getElementById("autoplayPill");
  const hintText = document.getElementById("hintText");
  const meterBar = document.getElementById("meterBar");
  const corePulse = document.getElementById("corePulse");
  const canvas = document.getElementById("fogCanvas");
  const startOverlay = document.getElementById("startOverlay");
  const startButton = document.getElementById("startButton");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeValue = document.getElementById("volumeValue");
  const ctx = canvas.getContext("2d", { alpha: true });

  const SUPPORTED_EXTENSIONS = [
    ".mp3", ".ogg", ".wav", ".m4a", ".aac", ".mp4", ".webm", ".flac", ".opus"
  ];

  const state = {
    cycleIndex: 0,
    // Очереди для каждой категории
    queues: { music: [], interruptions: [] }, 
    manifests: { music: [], interruptions: [] },
    started: false,
    loading: false,
    audioReady: false,
    analyserReady: false,
    currentGroup: "music",
    currentTrackPath: "",
    audioLevel: 0,
    smoothedLevel: 0,
    bassPulse: 0,
    hasBooted: false,
  };

  // Фишер-Йетс для честного перемешивания
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getNextFromQueue(group) {
    // Если очередь пуста, копируем манифест и перемешиваем
    if (state.queues[group].length === 0) {
      state.queues[group] = shuffleArray([...state.manifests[group]]);
      
      // Защита от того, чтобы первый трек новой очереди 
      // не совпал с последним треком предыдущей
      if (state.queues[group][0] === state.currentTrackPath && state.queues[group].length > 1) {
        state.queues[group].push(state.queues[group].shift());
      }
    }
    // Забираем первый элемент из очереди
    return state.queues[group].shift();
  }

  async function loadAllManifests() {
    const [music, interruptions] = await Promise.all([
      loadManifest("music/manifest.json"),
      loadManifest("interruptions/manifest.json")
    ]);

    if (!music.length || !interruptions.length) {
      throw new Error("Манифесты пусты или содержат неподдерживаемые файлы.");
    }

    state.manifests.music = music;
    state.manifests.interruptions = interruptions;
    
    // Инициализируем очереди сразу после загрузки
    state.queues.music = shuffleArray([...music]);
    state.queues.interruptions = shuffleArray([...interruptions]);
    
    state.audioReady = true;
  }

  async function playNext() {
    if (!state.audioReady) return;

    const group = state.cycleIndex % 2 === 0 ? "music" : "interruptions";
    state.cycleIndex += 1;

    const path = getNextFromQueue(group);
    updateUiForTrack(group, path);

    audio.src = path;
    audio.preload = "auto";

    await ensureAudioContext();
    await audio.play();
    state.started = true;
    autoplayPill.textContent = "запуск: эфир активен";
    document.body.classList.add("is-playing");
  }

  let audioContext = null;
  let analyser = null;
  let sourceNode = null;
  let freqData = null;
  let timeData = null;
  let animationFrame = 0;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function isSupportedByExtension(path) {
    const lower = path.toLowerCase();
    return SUPPORTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
  }

  function shuffleAvoidRepeat(list, last) {
    if (!list.length) return null;
    if (list.length === 1) return list[0];

    let candidate = null;
    let guard = 0;
    while (!candidate || candidate === last) {
      candidate = list[Math.floor(Math.random() * list.length)];
      guard += 1;
      if (guard > 20) break;
    }
    return candidate;
  }

  async function loadManifest(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Не удалось загрузить ${url}`);
    }
    const json = await response.json();
    const files = Array.isArray(json.files) ? json.files : [];
    return files.filter((file) => typeof file === "string" && isSupportedByExtension(file));
  }

  async function loadAllManifests() {
    const [music, interruptions] = await Promise.all([
      loadManifest("music/manifest.json"),
      loadManifest("interruptions/manifest.json")
    ]);

    if (!music.length) throw new Error("В music/manifest.json нет подходящих аудиофайлов.");
    if (!interruptions.length) throw new Error("В interruptions/manifest.json нет подходящих аудиофайлов.");

    state.manifests.music = music;
    state.manifests.interruptions = interruptions;
    state.audioReady = true;
  }

  function nextGroup() {
    const group = state.cycleIndex % 2 === 0 ? "music" : "interruptions";
    state.cycleIndex += 1;
    return group;
  }

  function chooseNextTrack(group) {
    const list = state.manifests[group];
    const last = state.lastPlayed[group];
    const track = shuffleAvoidRepeat(list, last);
    if (!track) {
      throw new Error(`Нет трека для группы ${group}`);
    }
    state.lastPlayed[group] = track;
    return track;
  }

  async function ensureAudioContext() {
    if (!audioContext) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioContext = new Ctx();
    }

    if (!sourceNode && audioContext) {
      sourceNode = audioContext.createMediaElementSource(audio);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.82;
      sourceNode.connect(analyser);
      analyser.connect(audioContext.destination);
      freqData = new Uint8Array(analyser.frequencyBinCount);
      timeData = new Uint8Array(analyser.frequencyBinCount);
      state.analyserReady = true;
    }

    if (audioContext && audioContext.state === "suspended") {
      await audioContext.resume();
    }
  }

  function updateVolumeUi() {
    const value = Number(volumeSlider.value || 0);
    audio.volume = Math.max(0, Math.min(1, value / 100));
    volumeValue.textContent = `${value}%`;
    volumeSlider.style.background = `linear-gradient(90deg,
      rgba(130,76,255,0.9) 0%,
      rgba(44,114,255,0.92) ${value}%,
      rgba(255,255,255,0.10) ${value}%,
      rgba(255,255,255,0.10) 100%)`;
  }

  function updateUiForTrack(group, path) {
    const modeLabel = group === "music" ? "РАДИО" : "РАДИО";
    trackTitle.textContent = group === "music"
      ? "Музыкальный эфир радиостанции RADIO GLADOON"
      : "Музыкальный эфир радиостанции RADIO GLADOON";
    trackSubtitle.textContent = group === "music"
      ? "случайная волна из музыкального потока"
      : "короткий сигнал между музыкальными сегментами";
    modePill.textContent = `режим: ${modeLabel}`;
    state.currentGroup = group;
    state.currentTrackPath = path;
  }

  async function playNext() {
    if (!state.audioReady) return;

    const group = nextGroup();
    const path = chooseNextTrack(group);
    updateUiForTrack(group, path);

    audio.src = path;
    audio.preload = "auto";

    await ensureAudioContext();
    await audio.play();
    state.started = true;
    autoplayPill.textContent = "запуск: эфир активен";
    hintText.textContent = "Наш радиоведущий работает круглосуточно, поэтому в часы эфира шоколадница остается без охранника».";
    document.body.classList.add("is-playing");
  }

  function computeAudioLevel() {
    if (!state.analyserReady || !analyser || audio.paused) {
      state.audioLevel *= 0.94;
      state.smoothedLevel += (state.audioLevel - state.smoothedLevel) * 0.08;
      state.bassPulse *= 0.9;
      return;
    }

    analyser.getByteFrequencyData(freqData);

    let sum = 0;
    for (let i = 0; i < freqData.length; i++) {
      sum += freqData[i];
    }

    let bass = 0;
    const bassBins = Math.max(6, Math.floor(freqData.length * 0.05));
    for (let i = 0; i < bassBins; i++) {
      bass += freqData[i];
    }

    const avg = sum / (freqData.length * 255);
    const bassAvg = bass / (bassBins * 255);

    state.audioLevel = avg;
    state.smoothedLevel += (avg - state.smoothedLevel) * 0.12;
    state.bassPulse += (bassAvg - state.bassPulse) * 0.16;
  }

  function renderFog(time) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const t = time * 0.00035;
    const level = Math.max(0, Math.min(1, state.smoothedLevel * 2.6));
    const bass = Math.max(0, Math.min(1, state.bassPulse * 2.8));

    const centerX = w * 0.5;
    const centerY = h * 0.54;
    const pull = 1 - Math.min(0.44, level * 0.34 + bass * 0.18);

    const bg = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(w, h) * 0.8);
    bg.addColorStop(0, `rgba(18, 20, 44, ${0.16 + level * 0.1})`);
    bg.addColorStop(0.45, `rgba(15, 10, 36, ${0.10 + bass * 0.06})`);
    bg.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const blobCount = 8;
    for (let i = 0; i < blobCount; i++) {
      const ratio = i / blobCount;
      const angle = t * (0.8 + ratio * 0.7) + ratio * Math.PI * 2.5;
      const orbitX = Math.cos(angle) * (w * (0.16 + ratio * 0.07)) * pull;
      const orbitY = Math.sin(angle * 1.2) * (h * (0.1 + ratio * 0.05)) * pull;
      const x = centerX + orbitX;
      const y = centerY + orbitY;
      const radius = Math.min(w, h) * (0.12 + ratio * 0.08) * (1 + level * 0.25);

      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      const violetAlpha = 0.09 + level * 0.08 + (i % 2 ? bass * 0.04 : 0);
      const blueAlpha = 0.06 + level * 0.06 + (i % 2 ? 0 : bass * 0.05);
      grad.addColorStop(0, `rgba(146, 85, 255, ${violetAlpha})`);
      grad.addColorStop(0.48, `rgba(40, 110, 255, ${blueAlpha})`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const vortexRadius = Math.min(w, h) * (0.13 + level * 0.05 + bass * 0.03);
    const vortex = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, vortexRadius * 1.8);
    vortex.addColorStop(0, `rgba(180, 210, 255, ${0.04 + level * 0.04})`);
    vortex.addColorStop(0.35, `rgba(120, 80, 255, ${0.12 + bass * 0.1})`);
    vortex.addColorStop(0.85, "rgba(12, 10, 24, 0.08)");
    vortex.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = vortex;
    ctx.beginPath();
    ctx.arc(centerX, centerY, vortexRadius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";

    const scale = 1 + level * 0.24 + bass * 0.14;
    corePulse.style.transform = `scale(${scale})`;
    corePulse.style.opacity = `${0.88 + level * 0.12}`;
    meterBar.style.transform = `scaleX(${Math.max(0.06, Math.min(1, level + bass * 0.22))})`;
  }

  function animate(time) {
    computeAudioLevel();
    renderFog(time);
    animationFrame = requestAnimationFrame(animate);
  }

  function showFatalError(message) {
    trackTitle.textContent = "Ошибка эфира";
    trackSubtitle.textContent = message;
    modePill.textContent = "режим: OFFLINE";
    autoplayPill.textContent = "запуск: недоступен";
    hintText.textContent = "Проверь manifest.json и наличие аудиофайлов в папках music и interruptions.";
    if (startButton) {
      startButton.disabled = false;
      startButton.classList.remove("is-loading");
      startButton.textContent = "повторить запуск";
    }
    if (startOverlay) {
      startOverlay.classList.remove("hidden");
    }
    state.loading = false;
  }

  async function bootRadio() {
    if (state.loading || state.started) return;
    state.loading = true;

    startButton.disabled = true;
    startButton.classList.add("is-loading");
    startButton.textContent = "загрузка эфира...";
    autoplayPill.textContent = "запуск: загрузка файлов";
    hintText.textContent = "Поднимаем радиовышку, стягиваем туман, будим эфир.";

    try {
      updateVolumeUi();
      if (!state.hasBooted) {
        await loadAllManifests();
        state.hasBooted = true;
      }
      await playNext();
      startOverlay.classList.add("hidden");
    } catch (error) {
      showFatalError(error?.message || "Не удалось запустить эфир.");
    } finally {
      state.loading = false;
      if (!state.started) {
        startButton.disabled = false;
        startButton.classList.remove("is-loading");
      }
    }
  }

  audio.addEventListener("ended", () => {
    playNext().catch((error) => showFatalError(error?.message || "Не удалось продолжить эфир."));
  });

  audio.addEventListener("error", () => {
    playNext().catch((error) => showFatalError(error?.message || "Не удалось продолжить эфир."));
  });

  audio.addEventListener("play", () => {
    document.body.classList.add("is-playing");
  });

  audio.addEventListener("pause", () => {
    if (audio.ended) return;
    document.body.classList.remove("is-playing");
  });

  volumeSlider.addEventListener("input", updateVolumeUi);
  startButton.addEventListener("click", bootRadio);

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  updateVolumeUi();
  animationFrame = requestAnimationFrame(animate);
})();
