// 建置時預先產生所有聽力音檔到 audio/<日期>/<key>.mp3
// 失敗不會中斷建置（前端會退回 /api/tts 或瀏覽器語音）
const fs = require('fs');
const path = require('path');
const { buildSegments, allKeys } = require('../lib/segments.js');
const { synthesize } = require('../lib/tts.js');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'public', 'data');
const AUDIO = path.join(ROOT, 'public', 'audio');

async function main() {
  const index = JSON.parse(fs.readFileSync(path.join(DATA, 'index.json'), 'utf8'));
  let ok = 0, fail = 0, skip = 0;
  for (const dateStr of index.dates) {
    const day = JSON.parse(fs.readFileSync(path.join(DATA, dateStr + '.json'), 'utf8'));
    const dir = path.join(AUDIO, dateStr);
    fs.mkdirSync(dir, { recursive: true });
    for (const key of allKeys(day)) {
      const out = path.join(dir, key + '.mp3');
      if (fs.existsSync(out) && fs.statSync(out).size > 1000) { skip++; continue; }
      try {
        const buf = await synthesize(buildSegments(day, key));
        fs.writeFileSync(out, buf);
        ok++;
        await new Promise(function (r) { setTimeout(r, 300); });
      } catch (e) {
        fail++;
        console.error('gen fail', dateStr, key, e && e.message);
      }
    }
  }
  console.log('audio pre-gen done. ok=' + ok + ' skip=' + skip + ' fail=' + fail);
}

main().catch(function (e) {
  console.error('gen-audio fatal:', e && e.message);
  process.exit(0); // 不讓建置失敗
});
