export function authenticate(req, res, next) {
    if (!req.session.userId) {
        return res.status(403).json({ error: 'User not authenticated' });
    }
    next();
}