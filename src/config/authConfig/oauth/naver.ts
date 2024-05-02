import queryString from "query-string";

export const configNaver = {
  clientId: process.env.OAUTH_NAVER_CLIENT_ID!,
  clientSecret: process.env.OAUTH_NAVER_CLIENT_SECRET!,
  redirectUrl: process.env.OAUTH_NAVER_REDIRECT_URL!,
  authUrl: "https://nid.naver.com/oauth2.0/authorize",
  tokenUrl: "https://nid.naver.com/oauth2.0/token",
  profileUrl: "https://openapi.naver.com/v1/nid/me",
};

export const authParamsNaver = queryString.stringify({
  client_id: configNaver.clientId,
  redirect_uri: configNaver.redirectUrl,
  response_type: "code",
});

export const getTokenParamsNaver = (code: any, state: any) =>
  queryString.stringify({
    client_id: configNaver.clientId,
    client_secret: configNaver.clientSecret,
    code,
    state,
    grant_type: "authorization_code",
    redirect_uri: configNaver.redirectUrl,
  });
