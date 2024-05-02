export const configJwtToken = {
  tokenSecret: process.env.TOKEN_SECRET_KEY!,
  tokenExpiration: 60 * 60 * 24 * 3,
};
