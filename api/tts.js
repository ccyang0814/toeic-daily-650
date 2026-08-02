const fs = require('fs');
const path = require('path');
const { buildSegments } = require('../lib/segments.js');
const { synthesize } = require('../lib/tts.js');

function loadDay(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const p = path.join(process.cwd(), 'public', 'data', dateStr + '.json');
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

module.exports = async function (req, res) {
  try {
    const d = String(req.query.d || '');
    const k = String(req.query.k || '');
    const day = loadDay(d);
    if (!day) { res.status(404).json({ error: 'unknown date' }); return; }
    const segments = buildSegments(day, k);
    if (!segments) { res.status(404).json({ error: 'unknown key' }); return; }
    const buf = await synthesize(segments);
    if (req.query.probe === '1') { res.status(200).json({ ok: true, bytes: buf.length }); return; }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(buf);
  } catch (e) {
    console.error('TTS error:', e);
    res.status(502).json({ error: 'tts_failed', detail: String(e) });
  }
};
