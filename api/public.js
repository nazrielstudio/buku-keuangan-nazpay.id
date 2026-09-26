import { load, json } from '../lib/server.js';

export default async function handler() {
  const d = await load();
  return json({
    ...d,
    transactions: (d.transactions || []).map(({ proof, ...x }) => x)
  });
}
