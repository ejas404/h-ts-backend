//@ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { fetch, setGlobalDispatcher, Agent } from 'undici';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import studentCollection from "../models/student_model.js";
import { generateToken } from "../utility/token.js";
setGlobalDispatcher(new Agent({ connect: { timeout: 60000 } }));
export const googleAuthenticate = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    const query = new URLSearchParams();
    query.append('code', code);
    query.append('client_id', process.env.GOOGLE_OAUTH_CLIENT_ID);
    query.append('client_secret', process.env.GOOGLE_OAUTH_CLIENT_SECRET);
    query.append('redirect_uri', `${process.env.BASE_URL}/oauth`);
    query.append('grant_type', 'authorization_code');
    let accessToken = null;
    let idToken = null;
    try {
        const res = yield fetch(`https://oauth2.googleapis.com/token?${query.toString()}`, { method: "POST", headers: { "Accept": "application/json" } });
        const data = yield res.json();
        accessToken = data.access_token;
        idToken = data.id_token;
    }
    catch (err) {
        throw new Error(err.message);
    }
    if (!accessToken)
        return null;
    if (!idToken)
        return null;
    const googleUser = jwt.decode(idToken);
    const name = slugify(googleUser).toLowerCase();
    const email = googleUser.email;
    if (!googleUser.email_verified) {
        return null;
    }
    const dummyPassword = crypto.randomBytes(8).toString('hex') + '_dummy';
    let user = yield studentCollection.findOne({ email });
    if (!user) {
        user = yield studentCollection.create({ name, email, password: 'dummy', isDommyPass: true });
    }
    if (user.isBlocked) {
        res.status(401);
        throw new Error('entry resticted connect support');
    }
    let token = generateToken(res, user._id, 'Student');
    let userDetails = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        isBlocked: user.isBlocked
    };
    res.status(201).json({
        user: userDetails,
        token: token
    });
}));
