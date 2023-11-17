import { Request } from 'express';

export function getAccessTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return null; 
  }

  // Check if the header starts with "Bearer " (case-insensitive)
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.substring(7).trim(); // Remove "Bearer " prefix
    return token;
  }

  return null;
}