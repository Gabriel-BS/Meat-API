export const environment = {
    server: {port: process.env.SERVER_PORT || 3000},
    db: {url: process.env.DB_URL || 'mongodb://localhost:27017', name: process.env.DB_NAME || 'meat-api'},
    auth: {username: process.env.DB_USER || 'root', password: process.env.DB_PASS || 'password'},
    security: {saltRounds: process.env.SALT_ROUNDS || 10}
}