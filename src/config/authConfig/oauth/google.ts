import queryString from "query-string";

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

export const configGoogle = {
  clientId: process.env.OAUTH_GOOGLE_CLIENT_ID!,
  clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET!,
  redirectUrl: getGoogleRedirectUri()!,
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo",
};

export const authParamsGoogle = queryString.stringify({
  client_id: configGoogle.clientId,
  redirect_uri: configGoogle.redirectUrl,
  response_type: "code",
  scope: "openid profile email",
  access_type: "offline",
  state: "standard_oauth",
  prompt: "consent",
});

export const getTokenParamsGoogle = (code: any) =>
  queryString.stringify({
    client_id: configGoogle.clientId,
    client_secret: configGoogle.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: configGoogle.redirectUrl,
  });
