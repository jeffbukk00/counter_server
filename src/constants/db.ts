const getDatabaseUrl = () => {
  const mode = process.env.NODE_ENV;

  const local = process.env.MONGO_CONNECTION_LOCAL;
  const cluster = process.env.MONGO_CONNECTION_CLUSTER;

  if (mode === "development") {
    return local;
  } else if (mode === "production") {
    return cluster;
  } else {
    return local;
  }
};

export const MONGO_CONNECTION_URL = getDatabaseUrl();
