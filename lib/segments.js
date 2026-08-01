// 依題目資料組出 TTS 語音段落（供 api/tts.js 與 scripts/gen-audio.js 共用）
const VOICE_M = 'en-US-GuyNeural';
const VOICE_W = 'en-US-JennyNeural';
const VOICE_M2 = 'en-US-ChristopherNeural';
const VOICE_W2 = 'en-US-AriaNeural';

// key 格式: p2-0 ~ p2-7 | p3-0, p3-1 | p4-0, p4-1
function buildSegments(day, key) {
  const m = /^(p2|p3|p4)-(\d+)$/.exec(key);
  if (!m) return null;
  const part = m[1];
  const idx = parseInt(m[2], 10);

  if (part === 'p2') {
    const item = day.listening.part2[idx];
    if (!item) return null;
    const qVoice = idx % 2 === 0 ? VOICE_M : VOICE_W;
    const aVoice = idx % 2 === 0 ? VOICE_W2 : VOICE_M2;
    const segs = [{ voice: qVoice, text: item.audioText }];
    ['A', 'B', 'C'].forEach(function (letter, i) {
      segs.push({ voice: aVoice, text: letter + '. ' + item.optionAudioTexts[i] });
    });
    return segs;
  }

  if (part === 'p3') {
    const conv = day.listening.part3[idx];
    if (!conv) return null;
    return conv.script.map(function (line) {
      const isMan = line.startsWith('M:');
      return { voice: isMan ? VOICE_M : VOICE_W, text: line.replace(/^[MW]:\s*/, '') };
    });
  }

  if (part === 'p4') {
    const talk = day.listening.part4[idx];
    if (!talk) return null;
    return [{ voice: idx % 2 === 0 ? VOICE_M2 : VOICE_W, text: talk.script }];
  }
  return null;
}

function allKeys(day) {
  const keys = [];
  day.listening.part2.forEach(function (_, i) { keys.push('p2-' + i); });
  day.listening.part3.forEach(function (_, i) { keys.push('p3-' + i); });
  day.listening.part4.forEach(function (_, i) { keys.push('p4-' + i); });
  return keys;
}

module.exports = { buildSegments, allKeys };
