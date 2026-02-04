export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response('ok', { status: 200 });
    }

    // Proxy dynamic prices paths to the existing Vercel app
    if (url.pathname.startsWith('/prices/')) {
      // Preserve path and query string
      const upstream = `https://logam-mulia-api.vercel.app${url.pathname}${url.search}`;
      try {
        const res = await fetch(upstream, { method: request.method });
        const headers = new Headers(res.headers);
        // Ensure JSON content-type for responses that are JSON
        if (!headers.has('content-type')) headers.set('content-type', 'application/json');
        const body = await res.arrayBuffer();
        return new Response(body, { status: res.status, headers });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'upstream fetch failed', detail: String(err) }), { status: 502, headers: { 'Content-Type': 'application/json' } });
      }
    }

    if (url.pathname === '/prices') {
      return new Response(JSON.stringify({ message: 'Worker mode: use /prices/<site> to proxy to the API' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/docs') {
      return new Response('Swagger UI is disabled in Worker build', { status: 200 });
    }

    return new Response('Not found', { status: 404 });
  }
};
