/* eslint dot-notation: 0 */
import jwt from 'jsonwebtoken';
import { authResponse } from '../helper/serverResponse';
import 'dotenv/config';


const checkToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return authResponse(res, 403, 'error', 'Token must be provided');
    }
    const bearer = header.split(' ');
    const token = bearer[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return authResponse(res, 403, 'error', 'Unable to authenticate token');
    }
    req.tokenData = decoded;
    return next();
  } catch (err) {
    return authResponse(res, 403, 'error', 'Authentication failed');
  }
};
export default checkToken;
