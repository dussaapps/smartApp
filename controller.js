var dbWrapper = require('./dbwrapper');
var fileWrapper = require('./fileWrapper');
var config = require('./config');
var dateFormat = require('dateformat');
var customEncryption = require('./crypto');
var fs = require('fs');


var controller = {};

controller.startBackend = (cb) => {

    if (config.storeToDb) {
        dbWrapper.connectToDb(cb);
    }
    else {
        cb(undefined);
    }
};

controller.loginUser = (params, cb) => {
    var userDetails = {};


    var usersData = require('./users');
    var fileSaveRequired = false;
    var userInfo = null;

    for (var i = 0; i < usersData.length; i++) {
        var user = usersData[i];
        if (user.username == params.username) {
            fileSaveRequired = true;
            if (user.passcode == params.passcode) {
                user.loginAttempts = 0;
                user.lastLogin = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                userInfo = user;
            }
            else {
                user.loginAttempts = user.loginAttempts + 1;
            }
            break;
        }
    }

    if (fileSaveRequired) {
        fs.writeFile(config.usersFile, JSON.stringify(usersData), (err, data) => {
            console.log(err, data);
        })
    }

    if (userInfo) {
        cb(undefined, userInfo);
    }
    else {
        cb({ msg: 'Invalid User' }, undefined);
    }


};


controller.clearAllData = () => {
    if (config.storeToDb)
        dbWrapper.clearMessages();
    else
        fileWrapper.clearMessages();
}

controller.pushMessages = (msg, cb) => {

    var encryptedMsg = customEncryption.encrypt(msg.message, msg.code, msg.from, msg.to);
    if (encryptedMsg == "") {
        cb(undefined, { errmsg: 'Invalid PassCode' })
        return;
    }
    var msgToPush = {
        from: msg.from,
        to: msg.to,
        msg: encryptedMsg,
        createdDate: dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss"),
        fromActiveStatus: 1,
        toActiveStatus: 1,
        read: 0
    }

    if (config.storeToDb)
        dbWrapper.pushmsg(msgToPush, cb);
    else
        fileWrapper.SaveMessages(msgToPush, cb);

};

controller.getMessages = (reqParams, cb) => {


    var callBack = function (err, msgs) {

        if (err) {
            cb(err, undefined);
        }
        else {
            for (var i = 0; i < msgs.length; i++) {
                var msg = msgs[i];
                //console.log('decrypting ',msg.msg, reqParams.code);
                msg.msg = customEncryption.decrypt(msg.msg, reqParams.code, msg.from, msg.to,reqParams.username);                
                msg.fromme= msg.from==reqParams.username?true:false;
            }
            cb(undefined, msgs);
        }
    }

    if (config.storeToDb)
        dbWrapper.getmsg(reqParams, callBack);
    else
        fileWrapper.GetMessages(reqParams, callBack);

};

module.exports = controller;