const CONFIG_VERSION = 9;
const MATCH_START_SECONDS = -90;
const INITIAL_REMINDER_SECONDS = 5;
const STORAGE_KEY = "dota2-coach-state-v9";
const LEGACY_STORAGE_KEYS = [
  "dota2-coach-state-v8",
  "dota2-coach-state-v7",
  "dota2-coach-state-v6",
  "dota2-coach-state-v5",
  "dota2-coach-state-v4",
  "dota2-coach-state-v3",
  "dota2-coach-state-v2",
  "dota2-coach-state-v1",
];
const DB_NAME = "dota2-coach-db";
const DB_VERSION = 1;
const VOICE_STORE = "voices";

const BUNDLED_VOICES = [
  {
    id: "builtin-control-group",
    name: "按 Control + F1 编队",
    type: "audio/wav",
    url: "assets/按 control 加 f1 编队.wav",
    builtin: true,
  },
  {
    id: "builtin-mid-ward",
    name: "中路买假眼",
    type: "audio/wav",
    url: "assets/中路买假眼.wav",
    builtin: true,
  },
  {
    id: "builtin-rune-soon",
    name: "中路神符快要刷新",
    type: "audio/wav",
    url: "assets/中路神符快要刷新.wav",
    builtin: true,
  },
  {
    id: "builtin-rune-spawned",
    name: "中路神符已经刷新",
    type: "audio/wav",
    url: "assets/中路神符已经刷新.wav",
    builtin: true,
  },
  {
    id: "builtin-rune-six-soon",
    name: "中路六分钟神符马上刷新",
    type: "audio/wav",
    url: "assets/中路六分钟神符马上刷新。.wav",
    builtin: true,
  },
  {
    id: "builtin-pull-camp",
    name: "准备拉野",
    type: "audio/wav",
    url: "assets/准备拉野。.wav",
    builtin: true,
  },
  {
    id: "builtin-pull-and-rune",
    name: "准备拉野 + 六分钟神符",
    type: "audio/wav",
    url: "assets/准备拉野！中路六分钟神符马上刷新。.wav",
    builtin: true,
  },
  {
    id: "builtin-lotus",
    name: "莲花马上刷新",
    type: "audio/wav",
    url: "assets/莲花马上刷新.wav",
    builtin: true,
  },
  {
    id: "builtin-lotus-spawned",
    name: "莲花已经刷新",
    type: "audio/wav",
    url: "assets/莲花已经刷新.wav",
    builtin: true,
  },
  {
    id: "builtin-wisdom-soon",
    name: "经验符马上刷新",
    type: "audio/wav",
    url: "assets/经验符马上刷新，请注意！.wav",
    builtin: true,
  },
  {
    id: "builtin-wisdom-spawned",
    name: "经验符已经刷新",
    type: "audio/wav",
    url: "assets/经验符已经刷新.wav",
    builtin: true,
  },
  {
    id: "builtin-bounty-soon",
    name: "赏金符快刷新",
    type: "audio/wav",
    url: "assets/赏金符快刷新.wav",
    builtin: true,
  },
];

const DEFAULT_VOICE_BY_MESSAGE = new Map([
  ["按 Ctrl + F1 编队", "builtin-control-group"],
  ["中路神符快要刷新", "builtin-rune-soon"],
  ["中路神符已经刷新", "builtin-rune-spawned"],
  ["中路六分钟神符马上刷新", "builtin-rune-six-soon"],
  ["准备买中路眼", "builtin-mid-ward"],
  ["中路眼快到时间了", "builtin-rune-six-soon"],
  ["准备拉野", "builtin-pull-camp"],
  ["莲花马上刷新", "builtin-lotus"],
  ["莲花已经刷新", "builtin-lotus-spawned"],
  ["莲花和经验符马上刷新", "builtin-lotus"],
  ["经验符马上刷新", "builtin-wisdom-soon"],
  ["经验符已经刷新", "builtin-wisdom-spawned"],
  ["赏金符快刷新", "builtin-bounty-soon"],
]);

const REMINDER_PRESETS = {
  mid: {
    name: "中路",
    reminders: [
      reminderSpec(5, "按 Ctrl + F1 编队", "builtin-control-group"),
      reminderSpec(110, "中路神符快要刷新", "builtin-rune-soon"),
      reminderSpec(120, "中路神符已经刷新", "builtin-rune-spawned"),
      reminderSpec(230, "中路神符快要刷新", "builtin-rune-soon"),
      reminderSpec(240, "中路神符已经刷新", "builtin-rune-spawned"),
      reminderSpec(330, "准备买中路眼", "builtin-mid-ward"),
      reminderSpec(350, "中路六分钟神符马上刷新", "builtin-rune-six-soon"),
      reminderSpec(360, "中路神符已经刷新", "builtin-rune-spawned"),
      reminderSpec(470, "中路神符快要刷新", "builtin-rune-soon"),
      reminderSpec(480, "中路神符已经刷新", "builtin-rune-spawned"),
      reminderSpec(590, "中路神符快要刷新", "builtin-rune-soon"),
      reminderSpec(600, "中路神符已经刷新", "builtin-rune-spawned"),
      reminderSpec(720, "检查是否需要补眼"),
    ],
  },
  side: {
    name: "边路",
    reminders: [
      reminderSpec(5, "按 Ctrl + F1 编队", "builtin-control-group"),
      ...makePullCampReminders(35, 575),
      ...makeLotusReminders([170, 350, 530, 710, 890, 1070, 1430, 1610]),
      reminderSpec(410, "经验符马上刷新", "builtin-wisdom-soon"),
      reminderSpec(420, "经验符已经刷新", "builtin-wisdom-spawned"),
      reminderSpec(830, "经验符马上刷新", "builtin-wisdom-soon"),
      reminderSpec(840, "经验符已经刷新", "builtin-wisdom-spawned"),
      reminderSpec(1250, "莲花和经验符马上刷新", "builtin-lotus"),
      reminderSpec(1260, "经验符已经刷新", "builtin-wisdom-spawned"),
      reminderSpec(1670, "经验符马上刷新", "builtin-wisdom-soon"),
      reminderSpec(1680, "经验符已经刷新", "builtin-wisdom-spawned"),
    ],
  },
};

const DEFAULT_REMINDERS = REMINDER_PRESETS.mid.reminders;

const state = {
  reminders: [],
  voices: [],
  running: false,
  paused: false,
  alertsEnabled: true,
  elapsedBeforeRun: MATCH_START_SECONDS,
  startedAt: 0,
  firedIds: new Set(),
  editingId: null,
  audioContext: null,
  activeAudio: null,
  audioPrepared: false,
  voicePreloadPromise: null,
  voicePreloadElements: new Map(),
  syncTimeSign: -1,
  reminderTimeSign: 1,
  activePreset: "",
  reminderRenderKey: "",
  voiceRenderKey: "",
};

const elements = {
  clock: document.querySelector("#clock"),
  nextTime: document.querySelector("#nextTime"),
  nextMessage: document.querySelector("#nextMessage"),
  startButton: document.querySelector("#startButton"),
  pauseButton: document.querySelector("#pauseButton"),
  resetButton: document.querySelector("#resetButton"),
  enabledSwitch: document.querySelector("#enabledSwitch"),
  syncBeforeButton: document.querySelector("#syncBeforeButton"),
  syncAfterButton: document.querySelector("#syncAfterButton"),
  syncMinuteInput: document.querySelector("#syncMinuteInput"),
  syncSecondInput: document.querySelector("#syncSecondInput"),
  syncTimeButton: document.querySelector("#syncTimeButton"),
  syncStepButtons: document.querySelectorAll("[data-sync-step]"),
  reminderList: document.querySelector("#reminderList"),
  reminderForm: document.querySelector("#reminderForm"),
  timeInput: document.querySelector("#timeInput"),
  reminderBeforeButton: document.querySelector("#reminderBeforeButton"),
  reminderAfterButton: document.querySelector("#reminderAfterButton"),
  reminderMinuteInput: document.querySelector("#reminderMinuteInput"),
  reminderSecondInput: document.querySelector("#reminderSecondInput"),
  reminderQuickButtons: document.querySelectorAll("[data-reminder-time]"),
  reminderStepButtons: document.querySelectorAll("[data-reminder-step]"),
  messageInput: document.querySelector("#messageInput"),
  voiceSelect: document.querySelector("#voiceSelect"),
  reminderEnabledInput: document.querySelector("#reminderEnabledInput"),
  saveReminderButton: document.querySelector("#saveReminderButton"),
  resetDefaultsButton: document.querySelector("#resetDefaultsButton"),
  midPresetButton: document.querySelector("#midPresetButton"),
  sidePresetButton: document.querySelector("#sidePresetButton"),
  toast: document.querySelector("#toast"),
  toastMessage: document.querySelector("#toastMessage"),
  dismissToastButton: document.querySelector("#dismissToastButton"),
  audioPlayer: document.querySelector("#audioPlayer"),
  soundButton: document.querySelector("#soundButton"),
  progressFill: document.querySelector("#progressFill"),
  progressMarkers: document.querySelector("#progressMarkers"),
  importVoicesButton: document.querySelector("#importVoicesButton"),
  voiceFileInput: document.querySelector("#voiceFileInput"),
  voiceList: document.querySelector("#voiceList"),
  exportConfigButton: document.querySelector("#exportConfigButton"),
  importConfigButton: document.querySelector("#importConfigButton"),
  configFileInput: document.querySelector("#configFileInput"),
};

function makeId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function reminderSpec(seconds, message, voiceId = "") {
  return {
    seconds,
    message,
    enabled: true,
    voiceId,
  };
}

function makePullCampReminders(startSeconds, endSeconds) {
  const reminders = [];
  for (let seconds = startSeconds; seconds <= endSeconds; seconds += 60) {
    reminders.push(reminderSpec(seconds, "准备拉野", "builtin-pull-camp"));
  }
  return reminders;
}

function makeLotusReminders(secondsList) {
  return secondsList.map((seconds) => reminderSpec(seconds, "莲花马上刷新", "builtin-lotus"));
}

function cloneDefaultReminders() {
  return DEFAULT_REMINDERS.map((reminder) => ({
    ...reminder,
    id: makeId(),
  }));
}

function clonePresetReminders(presetName) {
  const preset = REMINDER_PRESETS[presetName] || REMINDER_PRESETS.mid;
  return preset.reminders.map((reminder) => ({
    ...reminder,
    id: makeId(),
  }));
}

function migrateLegacyReminders(reminders, options = {}) {
  if (!options.shouldMigrateLegacyDefaults) {
    return reminders;
  }

  if (isLegacySidePreset(reminders)) {
    return clonePresetReminders("side");
  }

  return reminders.map((reminder) => {
    if (isLegacyPullCampReminder(reminder)) {
      return {
        ...reminder,
        seconds: reminder.seconds - 18,
      };
    }

    return reminder;
  });
}

function isLegacyPullCampReminder(reminder) {
  return (
    reminder.message === "准备拉野" &&
    reminder.seconds >= 53 &&
    reminder.seconds <= 593 &&
    reminder.seconds % 60 === 53
  );
}

function isLegacySidePreset(reminders) {
  const legacySideReminders = [
    reminderSpec(5, "按 Ctrl + F1 编队"),
    ...makePullCampReminders(53, 593),
    ...makeLotusReminders([170, 350, 530, 710, 890, 1070, 1430, 1610]),
    reminderSpec(410, "经验符马上刷新"),
    reminderSpec(830, "经验符马上刷新"),
    reminderSpec(1250, "莲花和经验符马上刷新"),
    reminderSpec(1670, "经验符马上刷新"),
  ];

  return hasSameReminderSchedule(reminders, legacySideReminders);
}

function hasSameReminderSchedule(reminders, expectedReminders) {
  if (reminders.length !== expectedReminders.length) {
    return false;
  }

  const actual = reminders.map(reminderSignature).sort();
  const expected = expectedReminders.map(reminderSignature).sort();
  return actual.every((signature, index) => signature === expected[index]);
}

function reminderSignature(reminder) {
  return `${reminder.seconds}|${reminder.message}`;
}

function detectPresetName(reminders) {
  return Object.keys(REMINDER_PRESETS).find((presetName) =>
    hasSameReminderSchedule(reminders, REMINDER_PRESETS[presetName].reminders),
  ) || "";
}

function loadState() {
  const fallback = {
    reminders: cloneDefaultReminders(),
    alertsEnabled: true,
  };

  try {
    let shouldAutoAssignVoices = false;
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean) || "null";
      shouldAutoAssignVoices = true;
    }

    const saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.reminders)) {
      return fallback;
    }

    const reminders = migrateLegacyReminders(
      sanitizeReminders(saved.reminders, { shouldAutoAssignVoices }),
      { shouldMigrateLegacyDefaults: shouldAutoAssignVoices },
    );

    return {
      reminders: reminders.length ? reminders : fallback.reminders,
      alertsEnabled: saved.alertsEnabled !== false,
    };
  } catch {
    return fallback;
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: CONFIG_VERSION,
        reminders: state.reminders,
        alertsEnabled: state.alertsEnabled,
      }),
    );
  } catch {
    // Browser storage is a convenience; the timer still works without it.
  }
}

function sanitizeReminders(items, options = {}) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((reminder) => {
      const item = reminder && typeof reminder === "object" ? reminder : {};
      const message = String(item.message || "").trim();

      return {
        id: typeof item.id === "string" ? item.id : makeId(),
        seconds: Number(item.seconds),
        message,
        enabled: item.enabled !== false,
        voiceId: resolveVoiceId(item, message, options.shouldAutoAssignVoices),
      };
    })
    .filter((reminder) => Number.isFinite(reminder.seconds) && reminder.message);
}

function resolveVoiceId(reminder, message, shouldAutoAssignVoices) {
  if (shouldAutoAssignVoices && !reminder.voiceId) {
    return DEFAULT_VOICE_BY_MESSAGE.get(message) || "";
  }

  if (Object.hasOwn(reminder, "voiceId") && typeof reminder.voiceId === "string") {
    return reminder.voiceId;
  }

  return "";
}

function sanitizeVoices(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((voice) => ({
      id: typeof voice.id === "string" ? voice.id : makeId(),
      name: String(voice.name || "Untitled voice").trim(),
      type: String(voice.type || "audio/mpeg").trim(),
      size: Number(voice.size) || 0,
      dataUrl: String(voice.dataUrl || "").trim(),
      url: String(voice.url || "").trim(),
      builtin: Boolean(voice.builtin),
    }))
    .filter((voice) => voice.name && (voice.dataUrl.startsWith("data:audio/") || voice.url));
}

function sortedReminders() {
  return [...state.reminders].sort((a, b) => a.seconds - b.seconds || a.message.localeCompare(b.message));
}

function sortedVoices() {
  return [...state.voices].sort((a, b) => a.name.localeCompare(b.name));
}

function elapsedSeconds() {
  if (!state.running || state.paused) {
    return Math.floor(state.elapsedBeforeRun);
  }

  return Math.floor(state.elapsedBeforeRun + (performance.now() - state.startedAt) / 1000);
}

function formatTime(totalSeconds) {
  const wholeSeconds = Math.trunc(totalSeconds);
  const sign = wholeSeconds < 0 ? "-" : "";
  const absoluteSeconds = Math.abs(wholeSeconds);
  const hours = Math.floor(absoluteSeconds / 3600);
  const minutes = Math.floor((absoluteSeconds % 3600) / 60);
  const seconds = absoluteSeconds % 60;

  if (hours > 0) {
    return `${sign}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${sign}${pad(minutes)}:${pad(seconds)}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function parseTime(value) {
  const normalized = value.trim();
  const sign = normalized.startsWith("-") ? -1 : 1;
  const timeValue = normalized.replace(/^[+-]/, "");
  const parts = timeValue.split(":");
  if (parts.length !== 2 && parts.length !== 3) {
    throw new Error("时间格式用 01:30、-01:30 或 01:02:03");
  }

  const numbers = parts.map((part) => {
    if (!/^\d+$/.test(part)) {
      throw new Error("时间只能包含数字和冒号");
    }
    return Number(part);
  });

  const [hours, minutes, seconds] = numbers.length === 2 ? [0, numbers[0], numbers[1]] : numbers;

  if (minutes >= 60 || seconds >= 60) {
    throw new Error("分钟和秒数不能超过 59");
  }

  return sign * (hours * 3600 + minutes * 60 + seconds);
}

function pickerControls(kind) {
  if (kind === "sync") {
    return {
      beforeButton: elements.syncBeforeButton,
      afterButton: elements.syncAfterButton,
      minuteInput: elements.syncMinuteInput,
      secondInput: elements.syncSecondInput,
    };
  }

  return {
    beforeButton: elements.reminderBeforeButton,
    afterButton: elements.reminderAfterButton,
    minuteInput: elements.reminderMinuteInput,
    secondInput: elements.reminderSecondInput,
  };
}

function pickerSign(kind) {
  return kind === "sync" ? state.syncTimeSign : state.reminderTimeSign;
}

function setPickerSign(kind, sign) {
  if (kind === "sync") {
    state.syncTimeSign = sign < 0 ? -1 : 1;
  } else {
    state.reminderTimeSign = sign < 0 ? -1 : 1;
  }

  const controls = pickerControls(kind);
  const isBefore = pickerSign(kind) < 0;
  controls.beforeButton.classList.toggle("is-active", isBefore);
  controls.afterButton.classList.toggle("is-active", !isBefore);
  if (kind === "reminder") {
    updateReminderTimeInput();
  }
}

function normalizeNumberInput(input, min, max) {
  const value = Math.trunc(Number(input.value));
  const safeValue = Number.isFinite(value) ? value : min;
  const clampedValue = Math.min(max, Math.max(min, safeValue));
  input.value = String(clampedValue);
  return clampedValue;
}

function pickerSeconds(kind) {
  const controls = pickerControls(kind);
  const minutes = normalizeNumberInput(controls.minuteInput, 0, 180);
  const seconds = normalizeNumberInput(controls.secondInput, 0, 59);
  const totalSeconds = minutes * 60 + seconds;
  return pickerSign(kind) < 0 && totalSeconds !== 0 ? -totalSeconds : totalSeconds;
}

function setPickerSeconds(kind, totalSeconds) {
  const controls = pickerControls(kind);
  const wholeSeconds = Math.trunc(totalSeconds);
  const absoluteSeconds = Math.abs(wholeSeconds);
  setPickerSign(kind, wholeSeconds < 0 ? -1 : 1);
  controls.minuteInput.value = String(Math.floor(absoluteSeconds / 60));
  controls.secondInput.value = String(absoluteSeconds % 60);
  if (kind === "reminder") {
    updateReminderTimeInput();
  }
}

function adjustReminderTime(deltaSeconds) {
  setPickerSeconds("reminder", pickerSeconds("reminder") + deltaSeconds);
}

function adjustSyncTime(deltaSeconds) {
  syncToSeconds(pickerSeconds("sync") + deltaSeconds);
}

function updateReminderTimeInput() {
  elements.timeInput.value = formatTime(pickerSeconds("reminder"));
}

function syncToSeconds(seconds) {
  prepareAudio();
  state.running = true;
  state.paused = false;
  state.elapsedBeforeRun = Math.trunc(seconds);
  state.startedAt = performance.now();
  markPastRemindersFired(state.elapsedBeforeRun);
  hideToast();
  setPickerSeconds("sync", state.elapsedBeforeRun);
  prepareUpcomingAudio();
  render(true);
}

function isEditingSyncTime() {
  return [
    elements.syncBeforeButton,
    elements.syncAfterButton,
    elements.syncMinuteInput,
    elements.syncSecondInput,
  ].includes(document.activeElement);
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("当前浏览器不支持本地语音库"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(VOICE_STORE)) {
        db.createObjectStore(VOICE_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("打开语音库失败"));
  });
}

async function getAllVoices() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(VOICE_STORE, "readonly");
    const request = transaction.objectStore(VOICE_STORE).getAll();
    request.onsuccess = () => resolve(sanitizeVoices(request.result || []));
    request.onerror = () => reject(request.error || new Error("读取语音库失败"));
    transaction.oncomplete = () => db.close();
  });
}

async function saveVoice(voice) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(VOICE_STORE, "readwrite");
    transaction.objectStore(VOICE_STORE).put(voice);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error("保存语音失败"));
    };
  });
}

async function deleteVoiceRecord(id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(VOICE_STORE, "readwrite");
    transaction.objectStore(VOICE_STORE).delete(id);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error("删除语音失败"));
    };
  });
}

async function replaceVoiceLibrary(voices) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(VOICE_STORE, "readwrite");
    const store = transaction.objectStore(VOICE_STORE);
    store.clear();
    for (const voice of voices) {
      store.put(voice);
    }
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error("替换语音库失败"));
    };
  });
}

function startMatch() {
  prepareAudio();
  state.running = true;
  state.paused = false;
  state.elapsedBeforeRun = MATCH_START_SECONDS;
  state.startedAt = performance.now();
  state.firedIds.clear();
  prepareUpcomingAudio();
  render(true);
}

function syncMatchTime() {
  syncToSeconds(pickerSeconds("sync"));
}

function prepareUpcomingAudio() {
  const next = nextReminder();
  if (next?.voiceId) {
    prepareAudio({ priorityVoiceId: next.voiceId });
  }
}

function markPastRemindersFired(seconds) {
  state.firedIds = new Set(
    state.reminders
      .filter((reminder) => reminder.enabled && reminder.seconds <= seconds)
      .map((reminder) => reminder.id),
  );
}

function togglePause() {
  if (!state.running) {
    return;
  }

  if (state.paused) {
    state.paused = false;
    state.startedAt = performance.now();
  } else {
    state.elapsedBeforeRun = elapsedSeconds();
    state.paused = true;
  }

  render();
}

function resetMatch() {
  state.running = false;
  state.paused = false;
  state.elapsedBeforeRun = MATCH_START_SECONDS;
  state.startedAt = 0;
  state.firedIds.clear();
  hideToast();
  render(true);
}

function updateDueReminders() {
  if (!state.running || state.paused || !state.alertsEnabled) {
    return;
  }

  const elapsed = elapsedSeconds();
  for (const reminder of sortedReminders()) {
    if (!reminder.enabled || state.firedIds.has(reminder.id)) {
      continue;
    }

    if (reminder.seconds <= elapsed) {
      state.firedIds.add(reminder.id);
      alertReminder(reminder);
    }
  }
}

function nextReminder() {
  const elapsed = elapsedSeconds();
  return sortedReminders().find(
    (reminder) =>
      reminder.enabled && !state.firedIds.has(reminder.id) && reminder.seconds >= elapsed,
  );
}

function alertReminder(reminder) {
  elements.toastMessage.textContent = reminder.message;
  elements.toast.hidden = false;
  playReminderAudio(reminder.voiceId);

  if (
    "Notification" in window &&
    Notification.permission === "granted" &&
    document.visibilityState !== "visible"
  ) {
    try {
      new Notification("Dota2 Coach", {
        body: reminder.message,
        tag: `dota2-coach-${reminder.id}`,
      });
    } catch {
      // In-page alerts and sound remain active if system notifications fail.
    }
  }
}

function hideToast() {
  elements.toast.hidden = true;
}

function findVoice(voiceId) {
  if (!voiceId) {
    return null;
  }

  return state.voices.find((voice) => voice.id === voiceId) || null;
}

function voiceSource(voice) {
  return voice?.dataUrl || voice?.url || "";
}

function playReminderAudio(voiceId, options = {}) {
  const voice = findVoice(voiceId);
  if (!voice) {
    playTone();
    return;
  }

  playVoice(voice, options);
}

function playVoice(voice, options = {}) {
  const source = voiceSource(voice);
  if (!source) {
    playTone();
    return;
  }

  const audio = getVoiceAudioElement(voice);
  try {
    if (state.activeAudio && state.activeAudio !== audio) {
      state.activeAudio.pause();
    }

    audio.muted = false;
    audio.volume = 1;
    audio.pause();
    resetAudioPosition(audio);
    state.activeAudio = audio;

    const playPromise = audio.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        if (options.feedback) {
          showInlineMessage("浏览器拦截了声音，请再点一次试听或开始本局");
        }
        playTone();
      });
    }
  } catch {
    if (options.feedback) {
      showInlineMessage("语音播放失败，请检查手机是否静音");
    }
    playTone();
  }
}

function getVoiceAudioElement(voice) {
  const source = voiceSource(voice);
  if (state.voicePreloadElements.has(voice.id)) {
    return state.voicePreloadElements.get(voice.id);
  }

  const audio = voice.id === "builtin-control-group" && elements.audioPlayer
    ? elements.audioPlayer
    : new Audio();
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.src = source;
  state.voicePreloadElements.set(voice.id, audio);
  return audio;
}

function resetAudioPosition(audio) {
  try {
    audio.currentTime = 0;
  } catch {
    // Some browsers only allow seeking after metadata has loaded.
  }
}

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return null;
  }

  state.audioContext ||= new AudioContext();
  return state.audioContext;
}

async function resumeAudioContext() {
  const context = getAudioContext();
  if (!context) {
    return null;
  }

  if (context.state === "suspended") {
    await context.resume();
  }

  return context;
}

function playTone() {
  try {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(740, context.currentTime);
    oscillator.frequency.setValueAtTime(520, context.currentTime + 0.16);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.34);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.36);
  } catch {
    // Audio support is optional.
  }
}

function prepareAudio(options = {}) {
  const { announce = false, priorityVoiceId = "" } = options;
  state.audioPrepared = true;
  resumeAudioContext().catch(() => {});

  if (priorityVoiceId) {
    const priorityVoice = findVoice(priorityVoiceId);
    if (priorityVoice) {
      preloadVoice(priorityVoice, { unlock: true }).catch(() => {});
    }
  }

  if (!state.voicePreloadPromise) {
    state.voicePreloadPromise = preloadVoices(priorityVoiceId);
  }

  if (announce) {
    showInlineMessage("正在准备语音");
    state.voicePreloadPromise
      .then((count) => {
        showInlineMessage(count ? `语音已准备 ${count} 段` : "当前没有可准备的语音");
      })
      .catch(() => {
        showInlineMessage("语音准备失败，将使用默认提示音");
      });
  }

  return state.voicePreloadPromise;
}

async function preloadVoices(priorityVoiceId = "") {
  const voices = sortedVoices()
    .filter((voice) => voiceSource(voice))
    .sort((a, b) => Number(b.id === priorityVoiceId) - Number(a.id === priorityVoiceId));
  if (!voices.length) {
    return 0;
  }

  const results = await Promise.allSettled(voices.map((voice) => preloadVoice(voice, { unlock: true })));
  return results.filter((result) => result.status === "fulfilled" && result.value).length;
}

async function preloadVoice(voice, options = {}) {
  return preloadVoiceElement(voice, options);
}

function preloadVoiceElement(voice, options = {}) {
  const source = voiceSource(voice);
  if (!source) {
    return Promise.resolve(false);
  }

  const audio = getVoiceAudioElement(voice);
  if (options.unlock && audio.dataset.unlocked === "true") {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const finish = () => resolve(true);
    audio.addEventListener("canplaythrough", finish, { once: true });
    audio.addEventListener("loadeddata", finish, { once: true });
    audio.addEventListener("error", () => resolve(false), { once: true });
    audio.load();
    if (options.unlock) {
      unlockVoiceAudio(audio).then(resolve);
    }
    window.setTimeout(finish, 2500);
  });
}

async function unlockVoiceAudio(audio) {
  try {
    audio.muted = true;
    const playPromise = audio.play();
    if (playPromise?.then) {
      await playPromise;
    }
    audio.pause();
    resetAudioPosition(audio);
    audio.muted = false;
    audio.dataset.unlocked = "true";
    return true;
  } catch {
    audio.muted = false;
    return false;
  }
}

function resetVoicePreload() {
  state.voicePreloadPromise = null;
  state.voicePreloadElements.forEach((audio) => {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  });
  state.voicePreloadElements.clear();
  if (state.audioPrepared) {
    prepareAudio();
  }
}

async function enableBrowserNotifications() {
  prepareAudio({ announce: true });
  playTone();

  if (!("Notification" in window)) {
    showInlineMessage("当前浏览器不支持系统通知");
    return;
  }

  if (Notification.permission === "granted") {
    showInlineMessage("浏览器通知已开启");
    return;
  }

  if (Notification.permission === "denied") {
    showInlineMessage("浏览器通知已被浏览器拦截");
    return;
  }

  const permission = await Notification.requestPermission();
  showInlineMessage(permission === "granted" ? "浏览器通知已开启" : "浏览器通知未开启");
}

function cleanupServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") {
    return;
  }

  const cleanup = () => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      registration?.unregister();
    }).catch(() => {});

    if ("caches" in window) {
      caches.keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith("dota2-coach-"))
              .map((key) => caches.delete(key)),
          ),
        )
        .catch(() => {});
    }
  };

  if (document.readyState === "complete") {
    cleanup();
  } else {
    window.addEventListener("load", cleanup, { once: true });
  }
}

function showInlineMessage(message) {
  elements.toastMessage.textContent = message;
  elements.toast.hidden = false;
  window.setTimeout(hideToast, 2400);
}

function upsertReminder(event) {
  event.preventDefault();

  const seconds = pickerSeconds("reminder");

  const message = elements.messageInput.value.trim();
  if (!message) {
    showInlineMessage("提醒内容不能为空");
    elements.messageInput.focus();
    return;
  }

  const payload = {
    id: state.editingId || makeId(),
    seconds,
    message,
    enabled: elements.reminderEnabledInput.checked,
    voiceId: elements.voiceSelect.value,
  };

  if (state.editingId) {
    state.reminders = state.reminders.map((reminder) =>
      reminder.id === state.editingId ? payload : reminder,
    );
  } else {
    state.reminders = [...state.reminders, payload];
  }
  state.activePreset = detectPresetName(state.reminders);

  state.editingId = null;
  if (state.running && payload.seconds <= elapsedSeconds()) {
    state.firedIds.add(payload.id);
  } else {
    state.firedIds.delete(payload.id);
  }
  elements.reminderForm.reset();
  setPickerSeconds("reminder", seconds);
  elements.voiceSelect.value = payload.voiceId;
  elements.reminderEnabledInput.checked = true;
  elements.saveReminderButton.textContent = "新增";
  saveState();
  render(true);
}

function editReminder(id) {
  const reminder = state.reminders.find((item) => item.id === id);
  if (!reminder) {
    return;
  }

  state.editingId = reminder.id;
  setPickerSeconds("reminder", reminder.seconds);
  elements.messageInput.value = reminder.message;
  elements.voiceSelect.value = findVoice(reminder.voiceId) ? reminder.voiceId : "";
  elements.reminderEnabledInput.checked = reminder.enabled;
  elements.saveReminderButton.textContent = "更新";
  elements.messageInput.focus();
}

function removeReminder(id) {
  state.reminders = state.reminders.filter((reminder) => reminder.id !== id);
  state.activePreset = detectPresetName(state.reminders);
  state.firedIds.delete(id);
  if (state.editingId === id) {
    state.editingId = null;
    elements.reminderForm.reset();
    setPickerSeconds("reminder", INITIAL_REMINDER_SECONDS);
    elements.saveReminderButton.textContent = "新增";
  }
  saveState();
  render(true);
}

function toggleReminder(id) {
  state.reminders = state.reminders.map((reminder) =>
    reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder,
  );
  state.activePreset = detectPresetName(state.reminders);
  state.firedIds.delete(id);
  saveState();
  render(true);
}

function resetDefaults() {
  state.reminders = cloneDefaultReminders();
  state.activePreset = "mid";
  state.firedIds.clear();
  state.editingId = null;
  elements.reminderForm.reset();
  setPickerSeconds("reminder", INITIAL_REMINDER_SECONDS);
  elements.messageInput.value = "按 Ctrl + F1 编队";
  elements.voiceSelect.value = "";
  elements.reminderEnabledInput.checked = true;
  elements.saveReminderButton.textContent = "新增";
  saveState();
  render(true);
}

function applyPreset(presetName) {
  const elapsed = elapsedSeconds();
  state.reminders = clonePresetReminders(presetName);
  state.activePreset = presetName;
  state.firedIds.clear();
  if (state.running) {
    markPastRemindersFired(elapsed);
  }
  state.editingId = null;
  elements.reminderForm.reset();
  setPickerSeconds("reminder", INITIAL_REMINDER_SECONDS);
  elements.messageInput.value = "按 Ctrl + F1 编队";
  elements.voiceSelect.value = "";
  elements.reminderEnabledInput.checked = true;
  elements.saveReminderButton.textContent = "新增";
  saveState();
  showInlineMessage(`已切换到${REMINDER_PRESETS[presetName].name}预设`);
  render(true);
}

async function importVoiceFiles(files) {
  const audioFiles = [...files].filter(isAudioFile);
  if (!audioFiles.length) {
    showInlineMessage("请选择 mp3、wav、ogg、m4a 等音频文件");
    return;
  }

  try {
    const voices = [];
    for (const file of audioFiles) {
      const voice = {
        id: makeId(),
        name: file.name.replace(/\.[^.]+$/, ""),
        type: file.type || "audio/mpeg",
        size: file.size,
        dataUrl: await readFileAsDataUrl(file),
      };
      await saveVoice(voice);
      voices.push(voice);
    }

    state.voices = sortedVoicesByName([...state.voices, ...voices]);
    resetVoicePreload();
    showInlineMessage(`已导入 ${voices.length} 段语音`);
    render(true);
  } catch (error) {
    showInlineMessage(error.message || "导入语音失败");
  } finally {
    elements.voiceFileInput.value = "";
  }
}

function isAudioFile(file) {
  return (
    file.type.startsWith("audio/") ||
    /\.(aac|flac|m4a|mp3|ogg|wav|webm)$/i.test(file.name)
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("读取文件失败"));
    reader.readAsDataURL(file);
  });
}

function sortedVoicesByName(voices) {
  return [...voices].sort((a, b) => a.name.localeCompare(b.name));
}

async function deleteVoice(id) {
  if (BUNDLED_VOICES.some((voice) => voice.id === id)) {
    showInlineMessage("项目内置语音不能在网页里删除");
    return;
  }

  try {
    await deleteVoiceRecord(id);
    state.voices = state.voices.filter((voice) => voice.id !== id);
    resetVoicePreload();
    state.reminders = state.reminders.map((reminder) =>
      reminder.voiceId === id ? { ...reminder, voiceId: "" } : reminder,
    );
    if (elements.voiceSelect.value === id) {
      elements.voiceSelect.value = "";
    }
    saveState();
    render(true);
  } catch (error) {
    showInlineMessage(error.message || "删除语音失败");
  }
}

function exportConfig() {
  const payload = {
    version: CONFIG_VERSION,
    exportedAt: new Date().toISOString(),
    alertsEnabled: state.alertsEnabled,
    reminders: sortedReminders(),
    customVoices: sortedVoices().filter((voice) => voice.dataUrl),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dota2-coach-config-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importConfigFile(file) {
  try {
    const payload = JSON.parse(await file.text());
    const payloadVersion = Number(payload.version) || CONFIG_VERSION;
    const shouldMigrateLegacyDefaults = payloadVersion < CONFIG_VERSION;
    const reminders = migrateLegacyReminders(
      sanitizeReminders(payload.reminders, {
        shouldAutoAssignVoices: shouldMigrateLegacyDefaults,
      }),
      { shouldMigrateLegacyDefaults },
    );
    const voices = sanitizeVoices(payload.customVoices || payload.voices);

    if (!reminders.length) {
      throw new Error("配置文件里没有可用提醒");
    }

    const customVoices = voices.filter((voice) => voice.dataUrl);
    state.voices = sortedVoicesByName([...BUNDLED_VOICES, ...customVoices]);
    resetVoicePreload();
    const voiceIds = new Set(state.voices.map((voice) => voice.id));
    state.reminders = reminders.map((reminder) => ({
      ...reminder,
      voiceId: voiceIds.has(reminder.voiceId) ? reminder.voiceId : "",
    }));
    state.activePreset = detectPresetName(state.reminders);
    state.alertsEnabled = payload.alertsEnabled !== false;
    state.firedIds.clear();
    state.editingId = null;

    await replaceVoiceLibrary(customVoices);
    saveState();
    render(true);
    showInlineMessage("配置已导入");
  } catch (error) {
    showInlineMessage(error.message || "导入配置失败");
  } finally {
    elements.configFileInput.value = "";
  }
}

function renderVoiceSelect() {
  const previousValue = elements.voiceSelect.value;
  const options = [
    createOption("", "默认提示音"),
    ...sortedVoices().map((voice) => createOption(voice.id, voice.name)),
  ];

  elements.voiceSelect.replaceChildren(...options);
  elements.voiceSelect.value = findVoice(previousValue) ? previousValue : "";
}

function createOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function renderReminderList(force = false) {
  const key = JSON.stringify({
    reminders: sortedReminders(),
    voices: state.voices.map((voice) => [voice.id, voice.name]),
    fired: [...state.firedIds],
  });

  if (!force && key === state.reminderRenderKey) {
    return;
  }

  state.reminderRenderKey = key;
  elements.reminderList.replaceChildren(
    ...sortedReminders().map((reminder) => {
      const row = document.createElement("div");
      row.className = `reminder-row${state.firedIds.has(reminder.id) ? " is-fired" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = reminder.enabled;
      checkbox.addEventListener("change", () => toggleReminder(reminder.id));

      const time = document.createElement("span");
      time.className = "row-time";
      time.textContent = formatTime(reminder.seconds);

      const message = document.createElement("span");
      message.className = "row-message";
      message.textContent = reminder.message;

      const voice = document.createElement("span");
      voice.className = "row-voice";
      voice.textContent = findVoice(reminder.voiceId)?.name || "默认";

      const actions = document.createElement("div");
      actions.className = "row-actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "ghost-button";
      editButton.textContent = "改";
      editButton.title = "编辑";
      editButton.addEventListener("click", () => editReminder(reminder.id));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "ghost-button";
      deleteButton.textContent = "删";
      deleteButton.title = "删除";
      deleteButton.addEventListener("click", () => removeReminder(reminder.id));

      actions.append(editButton, deleteButton);
      row.append(checkbox, time, message, voice, actions);
      return row;
    }),
  );
}

function renderVoiceList(force = false) {
  const key = JSON.stringify(sortedVoices().map((voice) => [voice.id, voice.name, voice.size]));
  if (!force && key === state.voiceRenderKey) {
    return;
  }

  state.voiceRenderKey = key;

  if (!state.voices.length) {
    const empty = document.createElement("p");
    empty.className = "empty-note";
    empty.textContent = "还没有导入语音。导入后，每条提醒都可以选择对应语音。";
    elements.voiceList.replaceChildren(empty);
    return;
  }

  elements.voiceList.replaceChildren(
    ...sortedVoices().map((voice) => {
      const row = document.createElement("div");
      row.className = "voice-row";

      const name = document.createElement("span");
      name.className = "voice-name";
      name.textContent = voice.name;

      const size = document.createElement("span");
      size.className = "voice-size";
      size.textContent = voice.builtin ? "内置" : formatBytes(voice.size);

      const actions = document.createElement("div");
      actions.className = "row-actions";

      const playButton = document.createElement("button");
      playButton.type = "button";
      playButton.className = "ghost-button";
      playButton.textContent = "试听";
      playButton.addEventListener("click", () => playReminderAudio(voice.id, { feedback: true }));

      actions.append(playButton);

      if (!voice.builtin) {
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "ghost-button";
        deleteButton.textContent = "删除";
        deleteButton.addEventListener("click", () => deleteVoice(voice.id));
        actions.append(deleteButton);
      }

      row.append(name, size, actions);
      return row;
    }),
  );
}

function formatBytes(bytes) {
  if (!bytes) {
    return "";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function renderProgress() {
  const reminders = sortedReminders().filter((reminder) => reminder.enabled);
  const elapsed = elapsedSeconds();
  const timelineStart = Math.min(MATCH_START_SECONDS, elapsed, ...reminders.map((reminder) => reminder.seconds));
  const timelineEnd = Math.max(1, elapsed, ...reminders.map((reminder) => reminder.seconds));
  const timelineRange = Math.max(1, timelineEnd - timelineStart);
  const progress = Math.min(100, Math.max(0, ((elapsed - timelineStart) / timelineRange) * 100));

  elements.progressFill.style.width = `${progress}%`;
  elements.progressMarkers.replaceChildren(
    ...reminders.map((reminder) => {
      const marker = document.createElement("span");
      marker.className = "marker";
      const left = ((reminder.seconds - timelineStart) / timelineRange) * 100;
      marker.style.left = `${Math.min(100, Math.max(0, left))}%`;
      return marker;
    }),
  );
}

function renderPresetButtons() {
  elements.midPresetButton.classList.toggle("is-active", state.activePreset === "mid");
  elements.sidePresetButton.classList.toggle("is-active", state.activePreset === "side");
}

function render(forceList = false) {
  const elapsed = elapsedSeconds();
  const next = nextReminder();

  elements.clock.textContent = formatTime(elapsed);
  elements.nextTime.textContent = next ? formatTime(next.seconds) : "--:--";
  elements.nextMessage.textContent = next ? next.message : "无";
  elements.startButton.textContent = state.running ? "重新开始" : "开始本局";
  elements.pauseButton.textContent = state.paused ? "继续" : "暂停";
  elements.pauseButton.disabled = !state.running;
  elements.enabledSwitch.checked = state.alertsEnabled;
  if (!isEditingSyncTime()) {
    setPickerSeconds("sync", elapsed);
  }

  renderVoiceSelect();
  renderPresetButtons();
  renderProgress();
  renderReminderList(forceList);
  renderVoiceList(forceList);
}

function tick() {
  updateDueReminders();
  render();
}

function bindEvents() {
  elements.startButton.addEventListener("click", startMatch);
  elements.pauseButton.addEventListener("click", togglePause);
  elements.resetButton.addEventListener("click", resetMatch);
  elements.syncTimeButton.addEventListener("click", syncMatchTime);
  elements.syncBeforeButton.addEventListener("click", () => setPickerSign("sync", -1));
  elements.syncAfterButton.addEventListener("click", () => setPickerSign("sync", 1));
  elements.syncMinuteInput.addEventListener("change", () => pickerSeconds("sync"));
  elements.syncSecondInput.addEventListener("change", () => pickerSeconds("sync"));
  [elements.syncMinuteInput, elements.syncSecondInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        syncMatchTime();
      }
    });
  });
  elements.syncStepButtons.forEach((button) => {
    button.addEventListener("click", () => adjustSyncTime(Number(button.dataset.syncStep)));
  });
  elements.reminderBeforeButton.addEventListener("click", () => setPickerSign("reminder", -1));
  elements.reminderAfterButton.addEventListener("click", () => setPickerSign("reminder", 1));
  elements.reminderMinuteInput.addEventListener("input", updateReminderTimeInput);
  elements.reminderSecondInput.addEventListener("input", updateReminderTimeInput);
  elements.reminderMinuteInput.addEventListener("change", updateReminderTimeInput);
  elements.reminderSecondInput.addEventListener("change", updateReminderTimeInput);
  elements.reminderQuickButtons.forEach((button) => {
    button.addEventListener("click", () => setPickerSeconds("reminder", Number(button.dataset.reminderTime)));
  });
  elements.reminderStepButtons.forEach((button) => {
    button.addEventListener("click", () => adjustReminderTime(Number(button.dataset.reminderStep)));
  });
  elements.enabledSwitch.addEventListener("change", () => {
    state.alertsEnabled = elements.enabledSwitch.checked;
    saveState();
    render();
  });
  elements.reminderForm.addEventListener("submit", upsertReminder);
  elements.resetDefaultsButton.addEventListener("click", resetDefaults);
  elements.midPresetButton.addEventListener("click", () => applyPreset("mid"));
  elements.sidePresetButton.addEventListener("click", () => applyPreset("side"));
  elements.dismissToastButton.addEventListener("click", hideToast);
  elements.soundButton.addEventListener("click", enableBrowserNotifications);
  elements.importVoicesButton.addEventListener("click", () => elements.voiceFileInput.click());
  elements.voiceFileInput.addEventListener("change", () => importVoiceFiles(elements.voiceFileInput.files));
  elements.exportConfigButton.addEventListener("click", exportConfig);
  elements.importConfigButton.addEventListener("click", () => elements.configFileInput.click());
  elements.configFileInput.addEventListener("change", () => {
    const [file] = elements.configFileInput.files;
    if (file) {
      importConfigFile(file);
    }
  });
}

async function init() {
  const saved = loadState();
  state.reminders = saved.reminders;
  state.activePreset = detectPresetName(state.reminders);
  state.alertsEnabled = saved.alertsEnabled;
  saveState();

  try {
    state.voices = sortedVoicesByName([...BUNDLED_VOICES, ...(await getAllVoices())]);
  } catch {
    state.voices = sortedVoicesByName(BUNDLED_VOICES);
  }

  setPickerSeconds("sync", MATCH_START_SECONDS);
  setPickerSeconds("reminder", INITIAL_REMINDER_SECONDS);
  elements.messageInput.value = "按 Ctrl + F1 编队";

  bindEvents();
  render(true);
  cleanupServiceWorker();
  window.setInterval(tick, 250);
}

init();
