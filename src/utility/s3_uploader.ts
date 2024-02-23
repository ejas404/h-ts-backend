import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";


 const s3config = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
    },
    region: process.env.AWS_REGION 
})

const uploadS3File = async (file : any)=>{

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: Date.now().toString() + '-' + file.originalname,
        Body: file.buffer
    };

    return new Upload({
        client : s3config,
        params : params
    }).done()
    .then(data => data)
    .catch(err =>{
        return {error : true, msg : err}
    })

}

//  const upload = multer({
//     storage: multerS3({
//         s3: s3config,
//         bucket: process.env.S3_BUCKET_NAME as string,
//         acl: 'public-read',
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString() + '-' + file.originalname);
//         },
//     }),
// });


export {uploadS3File}


