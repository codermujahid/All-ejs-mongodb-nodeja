import User from '../models/User.js';
import { makeHash } from '../utility/hash.js';
import { validate } from '../utility/validate.js';
import bcrypt from 'bcryptjs'
import { createToken } from '../utility/jwt.js';
import { accountActivationMail } from '../utility/mail.js'; 
import jwt  from 'jsonwebtoken';


// show profile page
export const profilePage = (req, res) => {
    res.render('profile')

}
// show login page
export const loginPage = (req, res) => {
    res.render('login')

}

// show register page
export const registerPage = (req, res) => {
    res.render('register')

}
// register User
export const registerUser =  async (req, res) => {
    
    try {
        const { name, email, password } = req.body;

        // validation
        if (!name || !email || !password) {
            
            validate('All fields are required', '/register', req, res )
        }else{

            const emailCheck = await User.findOne().where('email').equals(email);

            if ( emailCheck) {
                validate('Email allready exists !', '/register', req, res )

            }else{
             
               
                const user = await User.create({ name, email, password : makeHash(password) });   
                   
                const token = createToken({ id : user._id }, (1000*60*60*24*3));
                const activation_link = `${process.env.APP_URL}:${process.env.PORT}/activate/${token}`;
                accountActivationMail(email, {
                    name : name,
                    link : activation_link
                })         
                validate('User register succesfull', '/login', req, res );

            }
              

        }
     
    } catch (error) {
        validate(error.message, '/register', req, res )
        
    }
    console.log(req.body);
}  
      
// login User
export const loginUser =  async (req, res) => {
    
    try {
        const {  email, password } = req.body;

        // validation
        if ( !email || !password) {
            
            validate('All fields are required', '/login', req, res )
        }else{
            const loginUser = await User.findOne().where('email').equals(email);
             
            if (!loginUser ) {
            validate('Email not exists', '/login', req, res )
                
            }else{

              if (!loginUser.isActivate) {
                validate('Please activate your account or resent activation link click', '/login', req, res );
                
              } else {
                    const userPass = bcrypt.compareSync(password, loginUser.password);
                    
                    if (!userPass) {
                        validate('Wrong Password', '/login', req, res );

                    }else{
                        const token = createToken({ id : loginUser._id }, (1000*60*60*24*365));
                        req.session.user = loginUser;
                        res.cookie('authToken', token);
                        validate('login Succesful', '/', req, res );

                    }
              }
            }

        }
      
    } catch (error) {
        validate(error.message, '/register', req, res )
        
    }
     
} 

export const logoutUser = (req, res) => {

   delete req.session.user;
   res.clearCookie('authToken');
 
   validate('logout Succesful', '/login', req, res );
   


}


// user Acount Activation
export const useracountActivation = async (req, res) => {
    try {
        const {token} = req.params;
        const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenVerify) {
         validate('Invalid activation link', '/login', req, res );
            
        } else {
             
            const activateUser = await User.findOne({ _id : tokenVerify.id })
            if (activateUser.isActivate ) {
                validate('Acount already activate', '/login', req, res );

            }else{
                console.log(tokenVerify);
                await User.findByIdAndUpdate(tokenVerify.id, {
                    isActivate : true
                })
                validate('Your account activation successful, login now', '/login', req, res );

            }

        }

    } catch (error) {
        validate(error.message, '/register', req, res )
        
    }
}

/**
 * Update profile photo
 */
export const profilePhotoPage = (req, res) => {

    res.render('photo')

}

/**
 * Update profile photo
 */
export const profilePassword = (req, res) => {

    res.render('password')

}

/**
 *  profile editPage
 */
export const editPage = (req, res) => {

    res.render('edit')

}
/**
 *  profile Photo Update
 */
export const profilePhotoChange = async (req, res) => {

    try {
        await User.findByIdAndUpdate(req.session.user._id, {
            photo : req.file.filename
        });
        req.session.user = req.file.filename;
        validate('Profile Photo Update', '/photo-update', req, res );

    } catch (error) {
        validate(error.message, '/login', req, res );
        
    }
}

/**
 *  profile Gallery Page  
 */
export const profileGalleryPage = async (req, res) => {

   res.render('gallery')
}

/**
 *  profile Gallery Update
 */
export const profileGalleryChange = async (req, res) => {

        try {


            for ( let i = 0; i < req.files.length; i++ ) {
                 await User.findByIdAndUpdate(req.session.user._id, {
                     $push : {
                         gallery : req.files[i].filename
                     }
                   
                });

                
            }

            validate("Gallery updated successfull", '/gallery-update', req, res );
            
        } catch (error) {
            
            console.log(error.message);

        }

}
 
 
