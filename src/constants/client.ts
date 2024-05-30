const getClientUrl = () => {
  const mode = process.env.NODE_ENV;

  const dev = process.env.CLIENT_HOST_DEV;
  const prod = process.env.CLIENT_HOST_PROD;

  if (mode === "development") {
    return dev;
  } else if (mode === "production") {
    return prod;
  } else {
    return dev;
  }
};

export const CLIENT_HOST = getClientUrl();
