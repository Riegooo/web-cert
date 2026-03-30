import { Router, Request, Response, NextFunction } from "express";
import { 
    inputFieldsValidation, 
    usernameExist, 
    checklength, 
    create_user_account,
    login_user_account,
    logout_authentication,
    userContextValidation
    } from "../middleware/auth";
const router = Router();

import 'express-session';

declare module 'express-session' {
    interface SessionData {
        user?: {
            firstname: string;
            lastname: string;
            username: string;
            id: number,
            email: string,
        };
    }
}

router.post('/register', inputFieldsValidation, checklength, userContextValidation, usernameExist, create_user_account, (req : Request, res : Response, next : NextFunction) => {
    res.status(200).json({ message : "Register account Successfully!", success: true });
});

router.post('/login', inputFieldsValidation, checklength, login_user_account, (req : Request, res : Response) => {
    const userdata = res.locals.user;

    console.log("USER DATA VALUE : ",userdata);

    if (!userdata) return res.status(400).json({ message: "invalid login", success: false })

    req.session.regenerate(err => {
        if (err) {
            console.error("Session regeneration error:", err);
            return res.status(500).json({ message: "Session failed", success: false });
        }

        req.session.user = {
            id: userdata.id,
            firstname: userdata.firstname,
            lastname: userdata.lastname,
            username: userdata.username,
            email: userdata.email,
        };

        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: "Session save failed", success: false});
            }

            res.json({ message: "Login Successfully", success: true });
        });
    });
});

router.post('/logout', (req: Request, res: Response) => {
    req.session.destroy(err => {
        if (err) {
            console.error("LOGOUT ERRROR : ",err)
            return res.status(500).send('Logout failed');
        }
        res.clearCookie('connect.sid'); 
        res.redirect('/login');
    });
});
export default router;