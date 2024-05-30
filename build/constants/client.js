"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_HOST = void 0;
const getClientUrl = () => {
    const mode = process.env.NODE_ENV;
    const dev = process.env.CLIENT_HOST_DEV;
    const prod = process.env.CLIENT_HOST_PROD;
    if (mode === "development") {
        return dev;
    }
    else if (mode === "production") {
        return prod;
    }
    else {
        return dev;
    }
};
exports.CLIENT_HOST = getClientUrl();
