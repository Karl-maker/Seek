import jwt from 'jsonwebtoken';
import { ITokenManager } from '..';

// Interface to define the JWT configuration
export interface JWTConfig {
  expiration: string;
  issuer: string;
  privateKey: string; // Private Key for signing JWTs
  publicKey: string; // Public Key for verifying JWTs
}

// Class to create and verify JWTs
export default class JWTService<T> implements ITokenManager<T> {
  private config: JWTConfig;

  constructor(config: JWTConfig) {
    this.config = config;
  }

  // Create a JWT token
  createToken(payload: T): string {
    const { expiration, issuer, privateKey } = this.config;
    return jwt.sign(payload, privateKey, {
      expiresIn: expiration,
      issuer,
      algorithm: 'RS256', // Use the RS256 algorithm for private/public key pair
    });
  }

  // Verify and decode a JWT token
  verifyToken(token: string): T | null {
    try {
      const { publicKey } = this.config;
      return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    } catch (error) {
      // If token is invalid or expired, return null
      return null;
    }
  }
}