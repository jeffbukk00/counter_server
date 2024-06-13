import queryString from "query-string";

// 클라이언트에서 oauth를 위한 권한 토큰 발급 후, 리다이렉트 될 페이지의 URL 반환.
const getGoogleRedirectUri = () => {
  const mode = process.env.NODE_ENV;

  const dev = process.env.OAUTH_GOOGLE_REDIRECT_URL_DEV;
  const prod = process.env.OAUTH_GOOGLE_REDIRECT_URL_PROD;

  if (mode === "development") {
    return dev;
  } else if (mode === "production") {
    return prod;
  } else {
    return dev;
  }
};

// oauth를 위한 기본 설정.
export const configGoogle = {
  clientId: process.env.OAUTH_GOOGLE_CLIENT_ID!,
  clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET!,
  redirectUrl: getGoogleRedirectUri()!,
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo",
};

// 플랫폼 로그인 페이지를 요청하는 URL.
export const authParamsGoogle = queryString.stringify({
  client_id: configGoogle.clientId,
  redirect_uri: configGoogle.redirectUrl,
  response_type: "code",
  scope: "openid profile email",
  access_type: "offline",
  state: "standard_oauth",
  prompt: "consent",
});

// 플랫폼에 엑세스 토큰 발급 요청을 할 때의 요청 파라미터 반환.
export const getTokenParamsGoogle = (code: any) =>
  queryString.stringify({
    client_id: configGoogle.clientId,
    client_secret: configGoogle.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: configGoogle.redirectUrl,
  });
