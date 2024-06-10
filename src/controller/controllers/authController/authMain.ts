import { Request, Response } from "@/types/express";
import jwt from "jsonwebtoken";

import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { configJwtToken } from "@/config/authConfig/token";

export const checkLoggedIn = (req: Request, res: Response) => {
  try {
    const authorization = req.get("Authorization");

    if (!authorization) throw new HttpError(400, { loggedIn: false });

    const token = authorization.split(" ")[1];

    if (!token) throw new HttpError(400, { loggedIn: false });

    // const { userId } = jwt.verify(token, configJwtToken.tokenSecret) as any;
    // const newToken = jwt.sign({ userId }, configJwtToken.tokenSecret, {
    //   expiresIn: configJwtToken.tokenExpiration,
    // });

    jwt.verify(token, configJwtToken.tokenSecret) as any;
    return res.status(200).json({ loggedIn: true });
  } catch (err) {
    console.log(err);
    throw new HttpError(400, { loggedIn: false });
  }
};

export const logout = (req: Request, res: Response) => {
  // res
  //   .clearCookie("token", { httpOnly: false, secure: true, sameSite: "none" })
  //   .status(201)
  //   .json({ message: "Logged out" });

  res.status(201).json({ message: "Logged out" });
};

export default {
  checkLoggedIn: errorWrapper(checkLoggedIn),
  logout: errorWrapper(logout),
};
