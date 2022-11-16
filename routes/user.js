
import express from 'express';
import multer from 'multer';
import path, { resolve } from 'path';

import { loginPage, loginUser, profilePage, registerPage, registerUser, logoutUser, useracountActivation, profilePhotoPage, profilePassword, editPage, profilePhotoChange, profileGalleryPage, profileGalleryChange } from '../controllers/userControler.js';
import { authMiddleware } from '../middlewares/authMuddleware.js';
import { authRedirectMiddleware } from '../middlewares/authRedirectMiddleware.js';



// router
const router = express.Router();
const __dirname = resolve();


// multer configer
const storage = multer.diskStorage({
    destination : (req, file, cb) => {

        if (file.fieldname == 'profile') {
            
            cb(null, path.join(__dirname, '/public/media/users/') );

        }
        if (file.fieldname == 'gallery') {
            
            cb(null, path.join(__dirname, '/public/media/gallery/') );

        }

    },
    filename : (req, file, cb) => {
         cb(null, Date.now() + '_' + file.originalname );

    }
}); 

// create multer middleware
const profilePhotoUpdate = multer({
    storage
}).single('profile');

// create multer middleware
const galleryPhotoUpdate = multer({
    storage
}).array('gallery', 10);




//Routing
router.get('/', authRedirectMiddleware, profilePage);

// photo update
router.get('/photo-update', authRedirectMiddleware, profilePhotoPage);
router.post('/photo-update', profilePhotoUpdate, profilePhotoChange);


// Gallery update
router.get('/gallery-update', authRedirectMiddleware, profileGalleryPage);
router.post('/gallery-update', galleryPhotoUpdate, profileGalleryChange);

 
router.get('/password-chenge', authRedirectMiddleware, profilePassword);
router.get('/profile-chenge', authRedirectMiddleware, editPage);

 
router.get('/login', authMiddleware, loginPage);
router.get('/register',  authMiddleware, registerPage);


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/activate/:token', useracountActivation); 

// export default
export default router;

     