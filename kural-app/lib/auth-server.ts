// Server-only. Decodes a Cognito JWT to extract the `sub` claim (stable user ID).
// TODO: add JWKS signature verification before production use.
export function getUserIdFromBearer(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const payloadB64 = authHeader.slice(7).split('.')[1];
    if (!payloadB64) return null;
    const json = Buffer.from(
      payloadB64.replace(/-/g, '+').replace(/_/g, '/'),
      'base64',
    ).toString('utf-8');
    const payload = JSON.parse(json) as Record<string, unknown>;
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}
