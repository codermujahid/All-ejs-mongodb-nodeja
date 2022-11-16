 import express from 'express';
 import colors from 'colors';
 import dotenv from 'dotenv';
 import session from 'express-session';
import ejsLayouts from 'express-ejs-layouts';
import { mongoDBConnection } from './config/db.js'; 
import { localmiddlewares } from './middlewares/localMiddlewares.js';
import userRoute from './routes/user.js'
import cookieParser from 'cookie-parser'


 //environment variable
 dotenv.config();
 const PORT = process.env.PORT || 9000;

 // express init
 const app = express();
 

 // expreess middlewarss
 app.use(express.json());
 app.use(express.urlencoded({ extended : false }));
 app.use(cookieParser());


 // setup session

 
 app.use(session({
   secret : "I love MERN",
   saveUninitialized : true,
   resave : false
 }));
 app.use(localmiddlewares);


 // static folder 
 app.use(express.static('public'));

 // ejs tamplet setup
 app.set('view engine', 'ejs');
 app.set('layout', 'layouts/app');
 app.use(ejsLayouts);




 // routing
app.use('/', userRoute)




 // listen
 app.listen(PORT, () => {
   mongoDBConnection();
    console.log(`server is running on port ${PORT}`.bgMagenta.black);
 })
