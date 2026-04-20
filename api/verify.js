let db = global.db || (global.db = {});

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { hwid, key } = req.body;

  if (!db[hwid]) return res.status(400).send("No key");
  if (db[hwid].key !== key) return res.status(403).send("Invalid");
  if (!db[hwid].activated) return res.status(403).send("Not activated");
  if (Date.now() > db[hwid].expire) return res.status(403).send("Expired");

  res.send("OK");
}
