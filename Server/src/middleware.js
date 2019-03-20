import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const checkToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res.status(401).json({
        error: "Token must be provided"
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.tokenData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Authentication failed"
    });
  }
};

export default checkToken;
