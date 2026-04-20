let db = global.db || (global.db = {});

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { hwid, key } = req.body;

  if (!db[hwid]) return res.status(400).send("No key");
  if (db[hwid].key !== key) return res.status(403).send("Wrong");

  if (!db[hwid].activated) {
    db[hwid].activated = true;
    db[hwid].expire = Date.now() + (7 * 24 * 60 * 60 * 1000);
  }

  res.json({ status: "ok", expire: db[hwid].expire });
}
