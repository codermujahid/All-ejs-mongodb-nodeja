import mongoose from 'mongoose';

// mongodb cinnection
 export const mongoDBConnection = async () => {
    try {  
        const connect = await mongoose.connect(process.env.MONGO_URI)

        console.log(`mongoDB Connected Succesful`.bgCyan.black);

    } catch (error) {
        console.log(`${error.message}`.bgBlack.white);
        
    }
}





 
 

