import dotenv from 'dotenv';
import express from 'express';
import jwt from 'express-jwt';
import * as fs from 'fs';
import jwks from 'jwks-rsa';
import multer from 'multer';
import path from 'path';
import { findAllByUserId } from './db/db';
import parse from './parser/parser';

dotenv.config();

const app = express()
const port = 3000
const uploadDirectory = 'uploads/';
const upload = multer({dest: uploadDirectory});

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWT_JWKS_URI || ''
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: process.env.AUTH0_ISSUER,
    algorithms: ['RS256']
});

const cleanUploads = () => {
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(uploadDirectory, file), err => {
                if (err) throw err;
            });
        }
    });
};

app.use(jwtCheck);

app.get('/', (req, res) => {
    const userId = (req as any).user?.sub;
    res.json({userId});
    res.end();
});

app.get('/consumption', (req, res) => {
    const userId = (req as any).user?.sub;
    res.json(findAllByUserId(userId));
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).end('Unable to find file');
        return;
    }
    const userId = (req as any).user?.sub;
    if (!userId) {
        res.status(400).end('User id not found');
    }
    parse(req.file.path, userId);
    res.json({result: 'ok'});
    cleanUploads();
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});


