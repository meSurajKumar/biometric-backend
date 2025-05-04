import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;

// Startup Middlewares
import db  from './src/startup/database.js'
import {middleware}  from './src/startup/middleware.js'
import routes  from './src/startup/routes.js'

db()
middleware(app)
routes(app)

app.listen(port , ()=>{console.log(`Listening To Port : ${port}`)})
