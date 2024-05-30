"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_CONNECTION_URL = void 0;
const getDatabaseUrl = () => {
    const mode = process.env.NODE_ENV;
    const local = process.env.MONGO_CONNECTION_LOCAL;
    const cluster = process.env.MONGO_CONNECTION_CLUSTER;
    if (mode === "development") {
        return local;
    }
    else if (mode === "production") {
        return cluster;
    }
    else {
        return local;
    }
};
exports.MONGO_CONNECTION_URL = getDatabaseUrl();
