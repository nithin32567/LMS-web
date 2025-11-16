async function generateOTP(length = 6) {
    const characters = 'ABabcdefghijklC_@@@DEFGHIJKLMNOPQRSTUVWXYZa#######bcdefghijklmnopqrstuvwxyz012345678999999999999999999';
    let otp = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
    }

    console.log(otp, "otp");
    return otp;
}


export default generateOTP;