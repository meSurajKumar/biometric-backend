import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL

const database= ()=>{
    mongoose.connect(databaseUrl).then(()=>{
        console.log('Connected To Database')
    }).catch((err)=>{
        console.log(`Failed to connected : ${err}`)
    })
};

export default database