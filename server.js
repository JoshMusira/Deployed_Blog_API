import express from 'express';
import bodyParser from 'body-parser';
import config from './db/config.js';
import userRoutes from './routes/userRoute.js';
import postRoutes from './routes/postRoute.js';
import commentRoutes from './routes/comment.Route.js';
import likeRoutes from './routes/likeRoute.js';
import jwt from 'jsonwebtoken';
import cors from 'cors'
import fs from 'fs';
import multer from 'multer';

const app = express();
//
app.use(bodyParser.json());
app.use(cors());
app.use("/images", express.static('images')); //using path lib to access images in folders

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//jwt middleware
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], config.jwt_secret, (err, decode) => {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});



// my-routes
userRoutes(app);
postRoutes(app)
commentRoutes(app)
likeRoutes(app)

app.get('/', (req, res) => {
    res.send("Hello Welcome my Blog API!");
});

app.listen(config.port || 5000, () => {
    console.log('Server is running ');
});