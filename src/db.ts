// install pg/postgres : npm install -D @types/pg

import { Pool } from 'pg';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

export const sqlpool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME
});

export const getSQL = (fileName: string) => {
    const filePath = path.join(__dirname, 'db', fileName);
    return fs.readFileSync(filePath, 'utf-8');
};