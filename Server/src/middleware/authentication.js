import jwt from 'jsonwebtoken';
import { authResponse } from '../helper/serverResponse';
import 'dotenv/config';


const checkToken = (req, res, next) => {
  try {
    const token = req.headers['x-authorization'];
    if (!token) {
      return authResponse(res, 401, 'error', 'Token must be provided');
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return authResponse(res, 401, 'error', 'Unable to authenticate token');
    }
    req.tokenData = decoded;
    return next();
  } catch (err) {
    return authResponse(res, 401, 'error', 'Authentication failed');
  }
};
export default checkToken;
