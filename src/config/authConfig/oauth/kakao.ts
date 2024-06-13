import queryString from "query-string";

// 클라이언트에서 oauth를 위한 권한 토큰 발급 후, 리다이렉트 될 페이지의 URL 반환.
const getKakaoRedirectUri = () => {
  const mode = process.env.NODE_ENV;

  const dev = process.env.OAUTH_KAKAO_REDIRECT_URL_DEV;
  const prod = process.env.OAUTH_KAKAO_REDIRECT_URL_PROD;

  if (mode === "development") {
    return dev;
  } else if (mode === "production") {
    return prod;
  } else {
    return dev;
  }
};

// oauth를 위한 기본 설정.
export const configKakao = {
  clientId: process.env.OAUTH_KAKAO_CLIENT_ID!,
  clientSecret: process.env.OAUTH_KAKAO_CLIENT_SECRET!,
  redirectUrl: getKakaoRedirectUri()!,
  authUrl: "https://kauth.kakao.com/oauth/authorize",
  tokenUrl: "https://kauth.kakao.com/oauth/token",
  profileUrl: "https://kapi.kakao.com/v2/user/me",
};

// 플랫폼 로그인 페이지를 요청하는 URL.
export const authParamsKakao = queryString.stringify({
  client_id: configKakao.clientId,
  redirect_uri: configKakao.redirectUrl,
  response_type: "code",
});

// 플랫폼에 엑세스 토큰 발급 요청을 할 때의 요청 파라미터 반환.
export const getTokenParamsKakao = (code: any) =>
  queryString.stringify({
    client_id: configKakao.clientId,
    client_secret: configKakao.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: configKakao.redirectUrl,
  });
