import { Request, Response } from "@/types/express";
import jwt from "jsonwebtoken";

import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { configJwtToken } from "@/config/authConfig/token";

export const checkLoggedIn = (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new HttpError(400, { loggedIn: false });
    const { userId } = jwt.verify(token, configJwtToken.tokenSecret) as any;
    const newToken = jwt.sign({ userId }, configJwtToken.tokenSecret, {
      expiresIn: configJwtToken.tokenExpiration,
    });

    res.cookie("token", newToken, {
      maxAge: configJwtToken.tokenExpiration * 1000,
      httpOnly: true,
    });
    res.status(200).json({ loggedIn: true });
  } catch (err) {
    throw new HttpError(400, { loggedIn: false });
  }
};

export const logout = (_: Request, res: Response) => {
  res.clearCookie("token").status(201).json({ message: "Logged out" });
};

export default {
  checkLoggedIn: errorWrapper(checkLoggedIn),
  logout: errorWrapper(logout),
};
