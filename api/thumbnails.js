export default async function handler(req, res) {
  const { endpoint } = req.query;

  const routes = {
    "gameicons": "places/gameicons",
    "groups/icons": "groups/icons",
    "users/avatar-headshot": "users/avatar-headshot"
  };

  if (!routes[endpoint]) {
    return res.status(403).json({ error: "Invalid endpoint" });
  }

  const query = Object.entries(req.query)
    .filter(([k]) => k !== "endpoint")
    .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
    .join("&");

  const url = "https://thumbnails.roblox.com/v1/" + routes[endpoint] + "?" + query;

  try {
    const r = await fetch(url);
    if (!r.ok) return res.status(r.status).json({ error: "Upstream error" });
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: "Failed to fetch" });
  }
}
