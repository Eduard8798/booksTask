export default () => ({
    port: Number(process.env.PORT ?? 3030),
    frontendUrl: process.env.FRONTEND_URL,

    database: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 5436),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        name: process.env.POSTGRES_DB,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,

    },
});