export let compilePath;
if (process.env.NODE_ENV === 'development') {
    compilePath = "../frontendAng/dist/frontend-ang/browser";
}
else {
    console.log('compile path selected');
    compilePath = "frontend/frontend-ang/browser";
}
