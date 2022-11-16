import { validate } from "../utility/validate.js";

// auth redirect
export const authMiddleware = (req, res, next ) => {
    const token = req.cookies.authToken;
    
    if (token) {
        validate('your are alredy logged', '/', req, res)
    }else{
        next();
    }
}