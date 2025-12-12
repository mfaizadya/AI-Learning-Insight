const rateLimit = require('express-rate-limit');

// login
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // max req's
    message: {
        status: 'error',
        message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 1 menit.'
    },
    standardHeaders: true, // Return rate limit info into headers `RateLimit-*`
    legacyHeaders: false, // Disable header `X-RateLimit-*`
});

// register
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 jam
    max: 3, 
    message: {
        status: 'error',
        message: 'Terlalu banyak permintaan registrasi dari IP ini. Silakan coba lagi nanti.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter, registerLimiter };