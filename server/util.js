import crypto from 'crypto'

module.exports = {
    MD5_SUFFIX: '叶上初阳干宿雨，水面清圆，一一风荷举。',

    // md5: function (pwd) {
    //     let md5 = crypto.createHash('md5');
    //     return md5.update(pwd).digest('hex')
    // },
    aesEncrypt: function (data) {
        const cipher = crypto.createCipher('aes192', 'a password')
        var crypted = cipher.update(data, 'utf8', 'hex')
        crypted += cipher.final('hex')
        return crypted
    },


    aesDecrypt: function (encrypted) {
        const decipher = crypto.createDecipher('aes192', 'a password')
        var decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    },
    
    responseClient(res, httpCode=500, code=3, message='服务端异常', data={}) {
        let responseData = {};
        responseData.code = code;
        responseData.message = message;
        responseData.data = data;
        res.status(httpCode).json(responseData)
    }
}
