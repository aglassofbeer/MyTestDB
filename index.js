import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function main() {
  // テスト用ペイロード
  const payload = {
    time:        new Date().toISOString(),
    text:        'テスト問題文',
    pinyin:      'pīn yīn',
    translation: 'テストの日本語訳',
    audioUrl:    'https://example.com/audio.mp3'
  };
  const today = new Date().toISOString().slice(0,10);

  // 挿入
  let { data: insertData, error: insertErr } = await supabase
    .from('history')
    .insert({ date: today, payload })
    .select();
  if (insertErr) {
    console.error('Insert Error:', insertErr);
    process.exit(1);
  }
  console.log('Inserted:', insertData);

  // 日付一覧取得
  let { data: dates } = await supabase
    .from('history')
    .select('date', { count: 'exact' })
    .order('date', { ascending: false })
    .limit(5);
  console.log('Recent dates:', dates.map(r => r.date));

  // 特定日のレコード取得
  let { data: items, error: selectErr } = await supabase
    .from('history')
    .select('payload')
    .eq('date', today)
    .order('payload->>time', { ascending: true });
  if (selectErr) {
    console.error('Select Error:', selectErr);
    process.exit(1);
  }
  console.log('Records for', today, items.map(r => r.payload));
}

main();
