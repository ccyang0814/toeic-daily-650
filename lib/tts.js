// 微軟 Edge 神經語音：把多段文字轉成一個 MP3 Buffer
let ttsMod = null;
function loadMod() {
  if (!ttsMod) ttsMod = require('msedge-tts');
  return ttsMod;
}

function streamToBuffer(stream) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    stream.on('data', function (c) { chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)); });
    stream.on('end', function () { resolve(Buffer.concat(chunks)); });
    stream.on('error', reject);
    stream.on('close', function () { resolve(Buffer.concat(chunks)); });
  });
}

async function synthesizeSegment(voice, text) {
  const mod = loadMod();
  const MsEdgeTTS = mod.MsEdgeTTS || mod.default || mod;
  const OUTPUT_FORMAT = mod.OUTPUT_FORMAT || (mod.default && mod.default.OUTPUT_FORMAT);
  const fmt = OUTPUT_FORMAT
    ? (OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3 || OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)
    : 'audio-24khz-96kbitrate-mono-mp3';
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, fmt);
  const res = await tts.toStream(text);
  const stream = (res && res.audioStream) ? res.audioStream : res;
  const buf = await streamToBuffer(stream);
  if (typeof tts.close === 'function') { try { tts.close(); } catch (e) {} }
  return buf;
}

async function synthesize(segments) {
  const parts = [];
  for (const seg of segments) {
    const buf = await synthesizeSegment(seg.voice, seg.text);
    if (buf && buf.length > 0) parts.push(buf);
  }
  if (parts.length === 0) throw new Error('TTS produced no audio');
  return Buffer.concat(parts);
}

module.exports = { synthesize };
