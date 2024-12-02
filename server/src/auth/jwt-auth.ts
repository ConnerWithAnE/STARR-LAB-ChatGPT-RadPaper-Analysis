import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
	console.log(req);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default authenticateJWT;
