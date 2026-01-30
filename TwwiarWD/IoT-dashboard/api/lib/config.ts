
export const config = {
    port: process.env.PORT || 3100,
    weatherApiKey: //here add weatherapi key
    supportedDevicesNum: 117,
    JwtSecret:"secret",
    databaseUrl: process.env.MONGODB_URI || //here add mongodb url
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT || '587',
    SMTP_SECURE: process.env.SMTP_SECURE || 'false',
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    SMTP_FROM: process.env.SMTP_FROM || ''
};