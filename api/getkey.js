let db = global.db || (global.db = {});

function generateKey(len = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let r = "";
  for (let i = 0; i < len; i++) {
    r += chars[Math.floor(Math.random() * chars.length)];
  }
  return r;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { hwid } = req.body;
  if (!hwid) return res.status(400).send("No HWID");

  if (db[hwid]) {
    return res.json(db[hwid]);
  }

  const key = generateKey();

  db[hwid] = {
    key,
    activated: false,
    expire: null
  };

  // 🔥 webhook
  await fetch(process.env.WEBHOOK, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      content: `🔑 New Key\nHWID: ${hwid}\nKey: ${key}`
    })
  });

  res.json(db[hwid]);
}
