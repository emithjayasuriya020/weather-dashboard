import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({ message: 'Access denied. No token provided!' });
    }

    try {
        const cleanToken = token.replace('Bearer ', '');
        const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);

        req.user = verified;

        next();
    } catch (error){
        res.status(400).json({ message: 'Invalid token!' });
    }
}

export default verifyToken;