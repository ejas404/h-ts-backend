export let compilePath;
if (process.env.NODE_ENV === 'development') {
    compilePath = "../frontendAng/dist/frontend-ang/browser";
}
else {
    compilePath = "frontend/frontend-ang/browser";
}
