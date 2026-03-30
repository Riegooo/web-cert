declare module 'connect-pg-simple' {
    import session from 'express-session';

    interface ConnectPgSimpleOptions {
        conString?: string;
        pool?: any;
        tableName?: string;
        schemaName?: string;
        pruneSessionInterval?: number;
        errorLog?: (message: string) => void;
    }

    function connectPgSimple(session: typeof session): any;

    export = connectPgSimple;
}