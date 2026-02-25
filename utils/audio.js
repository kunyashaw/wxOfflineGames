let soundEnabled = true;
let musicEnabled = true;
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = wx.createInnerAudioContext();
  }
  return audioCtx;
}

const sounds = {
  click: 'click',
  success: 'success',
  fail: 'fail',
  pop: 'pop',
  explode: 'explode'
};

function playSound(name) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    ctx.src = `/assets/audio/${sounds[name] || name}.mp3`;
    ctx.stop();
    ctx.play();
  } catch (e) {
    console.log('Audio play error:', e);
  }
}

function toggleSound(enabled) {
  soundEnabled = enabled;
}

function toggleMusic(enabled) {
  musicEnabled = enabled;
}

function stopSound() {
  if (audioCtx) {
    audioCtx.stop();
  }
}

module.exports = {
  playSound,
  toggleSound,
  toggleMusic,
  stopSound,
  get soundEnabled() { return soundEnabled; },
  get musicEnabled() { return musicEnabled; }
};
