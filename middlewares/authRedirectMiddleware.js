import { validate } from "../utility/validate.js";
import jwt  from 'jsonwebtoken';

// auth redirect
export const authRedirectMiddleware = async (req, res, next ) => {

    try {
            const token = req.cookies.authToken;
        
        if (token) {

        const tokenCheck =  await jwt.verify(token, process.env.JWT_SECRET);

        if (tokenCheck) {
            next();
        } 
            
        }else{
            delete req.session.user;
            res.clearCookie('authToken');
            validate('You are not authoraize', '/login', req, res)
        }
    } catch (error) {
        delete req.session.user;
        res.clearCookie('authToken');
        validate('Invalid token', '/login', req, res)
        
    }
  
}
