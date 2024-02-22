var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import mongoose from 'mongoose';
import axios from 'axios';
import { checkEnId, updateEnroll } from '../../utility/enroll_check_helper.js';
import orderCollection from '../../models/order_model.js';
import cartCollection from '../../models/user_cart_model.js';
import enrollCollection from '../../models/course_enroll_model.js';
export const payment = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('payment called');
    const { amount, enrollId } = req.query;
    const userData = req.user;
    const merchantTransactionId = enrollId;
    const data = {
        merchantId: process.env.PPAY_MERCHANT_ID,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: userData._id,
        name: userData.name,
        amount: amount * 100,
        redirectUrl: `${process.env.BASE_URL}?mtid=${merchantTransactionId}`,
        redirectMode: 'POST',
        mobileNumber: '8129984474',
        paymentInstrument: {
            type: 'PAY_PAGE'
        }
    };
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString('base64');
    const keyIndex = 1;
    const string = payloadMain + '/pg/v1/pay' + process.env.PPAY_SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;
    const demo_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
    const options = {
        method: 'post',
        url: demo_URL,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
        },
        data: {
            request: payloadMain
        }
    };
    const requestPayment = yield axios.request(options);
    if (!requestPayment)
        throw new Error('failed to initiate payment');
    const url = requestPayment.data.data.instrumentResponse.redirectInfo.url;
    res.json({ paid: true, url });
}));
export const paymentStatus = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = new mongoose.Types.ObjectId(req.user._id);
    const enid = req.params.id;
    const isEnid = yield checkEnId(enid);
    if (!isEnid)
        throw new Error('invalid enid');
    const update = yield updateEnroll(enid);
    if (!update)
        throw new Error('some error occured');
    const updateOrder = yield orderCollection.findOne({ enid });
    if (!updateOrder)
        throw new Error('some error occured');
    if (updateOrder.orderFrom === 'cart') {
        const userCart = yield cartCollection.findOne({ user: user_id });
        if (!userCart)
            throw new Error('cart not found');
        userCart.course = [];
        yield userCart.save();
    }
    if (updateOrder.orderFrom === 'single') {
        const enroll = yield enrollCollection.findOne({ enid });
        if (!enroll)
            throw new Error('enroll not found');
        const course_id = enroll.course;
        const userCart = yield cartCollection.findOne({ user: user_id });
        if (userCart) {
            userCart.course = userCart.course.filter((each) => !each.equals(course_id));
            yield userCart.save();
        }
    }
    updateOrder.isPaid = true;
    yield updateOrder.save();
    res.json({ success: update });
}));
// export const paymentStatus = asyncHandler(async (req : any, res) => {
//     console.log('from payment status')
//     const enid = req.params.id
//     const isEnid = await checkEnId(enid)
//     if(!isEnid) throw new Error('invalid enid')
//     const merchantTransactionId = enid
//     const merchantId = req.user._id
//     const keyIndex = 1;
//     const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.PPAY_SALT_KEY;
//     const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//     const checksum = sha256 + "###" + keyIndex;
//     const options = {
//         method: 'GET',
//         url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
//         headers: {
//             accept: 'application/json',
//             'Content-Type': 'application/json',
//             'X-VERIFY': checksum,
//             'X-MERCHANT-ID': `${merchantId}`
//         }
//     };
//     const check = await  axios.request(options)
//     if(check.data.success === true){
//         res.json({success : true})
//     }else{
//         console.log(check.data)
//         res.json({success : false})
//     }
// })
