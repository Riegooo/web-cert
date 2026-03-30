// Install bycript : npm install --save-dev @types/bcrypt
import { Request, Response, NextFunction } from "express"
import { sqlpool, getSQL } from "../db";
import { hash, compare } from 'bcrypt';
import { randomBytes } from "crypto";

const max_username: number = 20;
const min_password: number = 8
const min_username: number = 3

const salt_rounds = 12;

export function inputFieldsValidation (req : Request, res : Response, next : NextFunction) {
    try {
        const {firstname, lastname, username, password, email } = req.body || {};

        if (firstname === "" || lastname === "" || username === ""|| password === "" || email === "") {
            return res.status(400).json({message: "Please input the fields", success: false});
        }
        next();
    } catch (error) {
        console.log(error)
    }
}

export async function usernameExist (req : Request, res : Response, next : NextFunction) {
    try {
        const username = req.body.username;
        const checkUser = getSQL('check_username_exists.sql');
        const user = await sqlpool.query(checkUser, [username])

        const userFindExists = user.rows[0];

        console.log(userFindExists);

        return (userFindExists) ? res.status(400).json({ message: "Username is Already Exists.", success: false }) : next();

    } catch (error) {
        console.log(error);
    }
}

export function checklength (req : Request, res : Response, next : NextFunction) {
    try {
        const username : string = req.body.username;
        const password : string = req.body.password;

        const usernameNum : number = username.length;
        const passwordNum : number = password.length;

        if (usernameNum < min_username || usernameNum > max_username) {
            res.status(400).json({ message: "Username must have a length of 3 to 20 Characters.", suceess: false });
        } else if (passwordNum < min_password) {
            res.status(400).json({ message: "Password must have a length of 8 or more Characters.", success: false });   
        } else {
            next();
        }
    } catch (error) {
        console.log(error)
    }
}

export async function create_user_account (req : Request, res : Response, next : NextFunction) {
    try {
        const createUserSQL = getSQL('create_user.sql');
        const { firstname, lastname, username, password, email } = req.body;

        const hash_password = await hash(password, salt_rounds);
        console.log(hash_password);

        const checkUsername = await sqlpool.query(createUserSQL, [username, hash_password, firstname, lastname, email]);

        const user = checkUsername.rows[0];
        console.log(user);

        next();
    } catch (error) {
        next(error);
    }
}

export function userContextValidation (req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    
    if (!email) return res.status(400).json({ message: "Email is Required", success: false })

    const emailChar = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailChar.test(email)) return res.status(400).json({ message: "Invalid email format", success: false });

    next();
}

export async function login_user_account (req : Request, res : Response, next: NextFunction) {
    try {

        const getAllUserData = getSQL('select_all_user_data.sql');
        const all_user_data = await sqlpool.query(getAllUserData, [req.body.username]);

        if(all_user_data.rows.length === 0) return res.status(400).json({ message: "Incorrect Username or Password", success: false});

        const all_user_data_rows0 = all_user_data.rows[0];

        console.log(all_user_data_rows0)

        const getPasswordHash = getSQL('get_password_hash.sql');
        const userdata = await sqlpool.query(getPasswordHash, [req.body.username]);

        if (userdata.rows.length === 0) return res.status(400).json({ message: "Incorrect Username or Password", success: false });
        const { password: db_hash_password, user_id: userID } = userdata.rows[0];

        const user_got_data = userdata.rows[0]
        let is_matched = await compare(req.body.password, db_hash_password);
        console.log("password & hash_password is matched : ",is_matched);

        if (!is_matched) return res.status(200).json({ message: "Incorrect Username or Password", success: false });
        res.locals.user = {
            id: user_got_data.user_id,
            username: req.body.username,
            email: all_user_data_rows0.email,
            firstname: all_user_data_rows0.firstname,
            lastname: all_user_data_rows0.lastname
        }
        
        next();
    } catch (error) {
        next(error);
    }
} 

export async function logout_authentication(req: Request, res: Response, next: NextFunction) {
    console.log("USER IF EXISTS? : ",res.locals.user);
    if(!res.locals.user) return res.redirect('/login');
    next();
}