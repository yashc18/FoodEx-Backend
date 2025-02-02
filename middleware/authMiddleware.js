const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            success: false,
            msg: 'JWT_SECRET not configured'
        });
    }

    let token = req.header('Authorization');

    if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            msg: 'No token, authorization denied'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(401).json({
            success: false,
            msg: 'Token is not valid'
        });
    }
};

module.exports = auth;