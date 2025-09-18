import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ msg: 'No token, authorization denied' });

    const parts = header.split(' ');
    if (parts.length !== 2) return res.status(401).json({ msg: 'Token error' });

    const token = parts[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
}