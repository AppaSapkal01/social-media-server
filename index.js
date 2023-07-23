import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import AuthRoute from './Routes/AuthRoute.js';

// Routes

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

dotenv.config()

mongoose
    .connect(
        process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() =>
        app.listen(process.env.PORT, () =>
            console.log("Listening")
        )
    )
    .catch((error) => console.log(error))


    // usage of routes

    app.use('/auth', AuthRoute)



