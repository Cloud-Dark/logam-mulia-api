export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response('ok', { status: 200 });
    }

    // Minimal placeholder for prices endpoint (expand later)
    if (url.pathname === '/prices') {
      return new Response(JSON.stringify({ message: 'Worker mode: prices endpoint not implemented yet' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Swagger/docs placeholder
    if (url.pathname === '/docs') {
      return new Response('Swagger UI is disabled in Worker build', { status: 200 });
    }

    return new Response('Not found', { status: 404 });
  }
};
