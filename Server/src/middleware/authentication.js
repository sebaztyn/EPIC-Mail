import jwt from 'jsonwebtoken';


const checkToken = (req, res, next) => {
  try {
    const token = req.headers['x-authorization'];
    if (!token) {
      return res.status(401).json({
        error: "Token must be provided"
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        error: "Unable to authenticate token"
      });
    }
    req.tokenData = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      error: "Authentication failed"
    });
  }
};
export default checkToken;
