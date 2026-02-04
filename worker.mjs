export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response('ok', { status: 200 });
    }

    if (url.pathname === '/prices') {
      return new Response(JSON.stringify({ message: 'Worker mode: prices endpoint not implemented yet' }), {
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
