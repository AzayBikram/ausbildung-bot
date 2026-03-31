export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const was = searchParams.get('was');
  const wo = searchParams.get('wo');
  const page = searchParams.get('page') || 1;
  const size = searchParams.get('size') || 10;

  if (!was) {
    return new Response(JSON.stringify({ error: 'Missing search term' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  let url = `https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs?was=${encodeURIComponent(was)}&angebotsart=4&page=${page}&size=${size}`;
  if (wo) url += `&wo=${encodeURIComponent(wo)}`;

  try {
    const response = await fetch(url, {
      headers: { 'X-API-Key': 'jobboerse-jobsuche', 'Accept': 'application/json' },
    });
    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Proxy error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
