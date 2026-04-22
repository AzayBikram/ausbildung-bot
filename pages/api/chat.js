export const config = { runtime: 'edge' };

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Jobs proxy branch
  if (body.type === 'jobs') {
    const { was, wo, page = 1, size = 10 } = body;
    if (!was) return new Response(JSON.stringify({ error: 'Missing search term' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    let url = `https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs?was=${encodeURIComponent(was)}&angebotsart=4&page=${page}&size=${size}`;
    if (wo) url += `&wo=${encodeURIComponent(wo)}`;
    try {
      const r = await fetch(url, { headers: { 'X-API-Key': 'jobboerse-jobsuche', 'Accept': 'application/json' } });
      const data = await r.text();
      return new Response(data, { status: r.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } catch {
      return new Response(JSON.stringify({ error: 'Proxy error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  }

  const { messages, system, stream: useStream, max_tokens: maxTokens } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens || 800,
        stream: !!useStream,
        system,
        messages,
      }),
    });

    if (useStream) {
      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });
    }

    const data = await response.json();

    // Log if there's an error from Anthropic
    if (!response.ok) {
      console.error('Anthropic API error:', response.status, data);
    }

    return new Response(JSON.stringify(data), {
      status: response.ok ? 200 : response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Proxy error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', details: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
