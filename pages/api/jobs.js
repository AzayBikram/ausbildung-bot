export default async function handler(req, res) {
  const { was, wo, page = 1, size = 10 } = req.query;
  if (!was) return res.status(400).json({ error: 'Missing search term' });

  let url = `https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs?was=${encodeURIComponent(was)}&angebotsart=4&page=${page}&size=${size}`;
  if (wo) url += `&wo=${encodeURIComponent(wo)}`;

  try {
    const response = await fetch(url, {
      headers: { 'X-API-Key': 'jobboerse-jobsuche', 'Accept': 'application/json' },
    });
    if (!response.ok) return res.status(response.status).json({ error: 'Upstream error' });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error' });
  }
}
