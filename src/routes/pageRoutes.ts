import { Router, Request, Response, NextFunction } from "express";
import path, { join } from 'path';

const router = Router();

router.get('/', (req : Request, res : Response) => {
    res.redirect('/home')
});

router.get('/register', (req : Request, res : Response) => {
    res.sendFile(path.join(process.cwd(), 'src/public/register.html'));
});

router.get('/login', (req : Request, res : Response) => {
    res.sendFile(path.join(process.cwd(), 'src/public/login.html'));
});

router.get('/home', (req: Request, res: Response) => {
    const user = req.session.user;

    console.log("LOG USER : ",user?.id)

    if (!user) return res.redirect('/login');

    res.render('home', { user });
});
export default router;