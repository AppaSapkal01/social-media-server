import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";




const app = express();

// Middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));


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




