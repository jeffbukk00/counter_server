import queryString from "query-string";

export const configKakao = {
  clientId: process.env.OAUTH_KAKAO_CLIENT_ID!,
  clientSecret: process.env.OAUTH_KAKAO_CLIENT_SECRET!,
  redirectUrl: process.env.OAUTH_KAKAO_REDIRECT_URL!,
  authUrl: "https://kauth.kakao.com/oauth/authorize",
  tokenUrl: "https://kauth.kakao.com/oauth/token",
  profileUrl: "https://kapi.kakao.com/v2/user/me",
};

export const authParamsKakao = queryString.stringify({
  client_id: configKakao.clientId,
  redirect_uri: configKakao.redirectUrl,
  response_type: "code",
});

export const getTokenParamsKakao = (code: any) =>
  queryString.stringify({
    client_id: configKakao.clientId,
    client_secret: configKakao.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: configKakao.redirectUrl,
  });
