import asyncHandler from 'express-async-handler'
import crypto from 'crypto'
import axios from 'axios'
import { BASE_URL } from '../../utility/constants'

export const payment = asyncHandler(async (req: any, res) => {
    const { amount, enrollId } = req.query
    const userData = req.user

    const merchantTransactionId = enrollId;
    const data = {
        merchantId: process.env.PPAY_MERCHANT_ID,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: userData._id,
        name: userData.name,
        amount: amount * 100,
        redirectUrl: `${BASE_URL}/student/payment/status/${merchantTransactionId}`,
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

    const demo_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"

    const options = {
        method: 'post',
        url:demo_URL,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
        },
        data: {
            request: payloadMain
        }
    };
    
    const requestPayment : any = await axios.request(options)
    if(!requestPayment) throw new Error('failed to initiate payment')

    const url = requestPayment.data.data.instrumentResponse.redirectInfo.url
    res.json({paid : true,url})
})

export const paymentStatus = asyncHandler(async (req, res) => {
    const merchantTransactionId = res.req.body.transactionId
    const merchantId = res.req.body.merchantUserId

    console.log('from payment status')
    console.log(res.req.body)
    console.log(merchantTransactionId, merchantId)

    res.send('done')

})