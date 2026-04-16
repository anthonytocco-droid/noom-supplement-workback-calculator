export const config = { matcher: ['/((?!_vercel).*)'] };

export default function middleware(request) {
  const authHeader = request.headers.get('authorization');

  const user = process.env.BASIC_AUTH_USER || 'admin';
  const pass = process.env.BASIC_AUTH_PASSWORD;

  if (!pass) return;

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const colonIndex = decoded.indexOf(':');
      const u = decoded.slice(0, colonIndex);
      const p = decoded.slice(colonIndex + 1);
      if (u === user && p === pass) return;
    }
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
  });
}
