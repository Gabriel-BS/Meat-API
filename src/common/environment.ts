export const environment = {
  server: { port: process.env.SERVER_PORT || 3000 },
  db: {
    url: process.env.DB_URL || "mongodb://localhost:27017",
    name: process.env.DB_NAME || "meat-api"
  },
  auth: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password"
  },
  security: {
    saltRounds: process.env.SALT_ROUNDS || 10,
    apiSecret: process.env.API_SECRET || "prochnost",
    enableHTTPS: process.env.ENABLE_HTTPS || false,
    certificate: process.env.CERTI_FILE || "./src/security/keys/cert.pem",
    key: process.env.CERTI_KEY_FILE ||  "./src/security/keys/key.pem",
  }
};
