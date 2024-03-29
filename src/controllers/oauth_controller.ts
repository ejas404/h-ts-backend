//@ts-nocheck

import asyncHandler from "express-async-handler"
import slugify from "slugify";
import { fetch, setGlobalDispatcher, Agent } from 'undici';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import studentCollection from "../models/student_model.js";
import { generateToken } from "../utility/token.js";
setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }) )

export const googleAuthenticate = asyncHandler(async (req : any, res: any) : Promise<any> => {
    const { code } = req.query;

    const query = new URLSearchParams();
    query.append('code', code);
    query.append('client_id', process.env.GOOGLE_OAUTH_CLIENT_ID as string);
    query.append('client_secret', process.env.GOOGLE_OAUTH_CLIENT_SECRET as string);
    query.append('redirect_uri', `${process.env.CLIENT_URL as string}`)
    query.append('grant_type', 'authorization_code')
    
    let accessToken = null;
    let idToken = null;
    try {
        const res = await fetch(
            `https://oauth2.googleapis.com/token?${query.toString()}`,
            { method: "POST", headers: { "Accept": "application/json" }}
        );
        const data: any = await res.json();
        accessToken = data.access_token;
        idToken = data.id_token;
    } catch (err: any) {
        throw new Error(err.message);
    }

    if (!accessToken) throw new Error('invalid access token');
    if (!idToken) throw new Error('invalid id token');

    const googleUser = jwt.decode(idToken) as any;
    if (!googleUser.email_verified) throw new Error('user email is not verified');

    const name = slugify(googleUser.name).toLowerCase();
    const email = googleUser.email;

    const dummyPassword = crypto.randomBytes(8).toString('hex') + '_dummy';

    let user = await studentCollection.findOne({ email });
    if(!user){
        user = await studentCollection.create({ name, email, password : 'dummy' , isDommyPass : true});
    }
    

    if (user.isBlocked) {
        res.status(401)
        throw new Error('entry resticted connect support')
    }


    let token = generateToken(res, user._id,'Student');
    let userDetails = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        isBlocked: user.isBlocked
    }
    res.status(201).json({
        user: userDetails,
        token: token
    })
})



  