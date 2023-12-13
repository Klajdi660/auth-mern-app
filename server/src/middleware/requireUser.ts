import { Request, Response, NextFunction } from "express";

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = res.locals.user;
        
        if (!user) {
          return { error: true, message: "Invalid token or session has expired" };
        }
    
        next();
    } catch (error) {
        return error;
    }
};
