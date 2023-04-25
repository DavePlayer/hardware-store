import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const validateJWTadmin = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers["authorization"];
    if (!auth) return res.status(403).json({ status: "no token included inside http header" });
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET enviromental variable is undefined");
        return res.status(500).json({ status: "internal server errror" });
    }
    try {
        const token = jwt.verify(auth, process.env.JWT_SECRET);
        if ((token as any).isAdmin != true) return res.status(403).json({ status: "not an admin" });
        req.body.token = token;
        next();
    } catch (err) {
        return res.status(403).json("invalid token");
    }
};
