export interface ITokenManager<T> {
    createToken(payload: any): string;
    verifyToken(token: string): T | null;
}
  