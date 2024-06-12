
const LOCAL_CLIENT_URL = 'http://localhost:4200'

export const corsOption =  {
    origin: process.env.NODE_ENV === 'production'? process.env.CLIENT_URL : LOCAL_CLIENT_URL,
    methods:'GET,PUT,POST,DELETE',
    credentials:true
}