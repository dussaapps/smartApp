// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';
//password = 'd6F3Efeq';

var cookiePassword='test123';
var CustomEncryption = {};

var userCodes = {
    sd: 'sd',
    sn: 'sn',
    tom:'tom',
    jerry:'jerry'
}




var encrypt=function (text,password) {
        var cipher = crypto.createCipher(algorithm, password)
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
}

var decrypt=function(text,password){
     var decipher = crypto.createDecipher(algorithm, password)
    // console.log(text);
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
}

CustomEncryption.encrypt = function (text, password, fromUser, toUser) {

    if (userCodes[fromUser] && userCodes[fromUser] == password) {
       return encrypt(text,userCodes[toUser])
    }
    else {
        var msgToLog = 'code validation failed for - ' + fromUser + " with passCode - " + password;
        //console.log(msgToLog);
        return "";
    }
}


CustomEncryption.decrypt = function (text, password, fromUser, toUser,validateCodeForUser) {

    if (userCodes[validateCodeForUser] && userCodes[validateCodeForUser] == password) {
      return decrypt(text,userCodes[toUser])
    }
    else {
        var msgToLog = 'code validation failed for - ' + fromUser + " with passCode - " + password;
        //console.log(msgToLog);
        return text;
    }
}

CustomEncryption.encryptData = function (text) {
       return encrypt(text,cookiePassword);
}

CustomEncryption.decryptData = function (text) {
       return decrypt(text,cookiePassword);
}

module.exports = CustomEncryption;