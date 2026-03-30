// Install nodejs : npm init -y
// Install dependencies : npm install express pg dotenv and npm install -D typescript ts-node-dev @types/node @types/express
// Setup TypeScript : npx tsc --init

// Edit tsconfig.json 
/*
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true
*/

// install pug
/* npm install express express-session connect-pg-simple pg pug
npm install -D @types/express @types/express-session @types/pg */


// run the file or server : npx ts-node-dev src/app.ts

// import express
import express, { Request, Response } from 'express';
import path, {join} from 'path';
import userRoutes from './routes/userRoutes';
import pageRoutes from './routes/pageRoutes';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { sqlpool } from './db';

const PgSession = connectPgSimple(session as any);

const port : number = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

console.log(path.join(__dirname, 'views'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    store: new PgSession({
        pool: sqlpool,
        tableName: 'sessiontab',
        schemaName: 'practice-db',
        createTableIfMissing: true
    }),
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,  
        httpOnly: true,     
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}));

app.use('/', pageRoutes);
app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});