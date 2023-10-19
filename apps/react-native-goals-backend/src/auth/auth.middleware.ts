import { NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { AuthService } from "./auth.service";

export class AuthMiddleWare implements NestMiddleware{
    constructor(private readonly authService : AuthService){}

    async use(req: Request, res: Response, next: NextFunction)(
        const token = req.headers.authorization?.split(' ')[1];

        if(token){
                        // TODO: to implement
            const user = await this.authService.verifyToken(token);
            if(user) {
                req['user'] = user; // Attach user object to the request context
            }
        }
        next();
    )



}