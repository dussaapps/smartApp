var fs = require('fs');
var mongo = require('mongodb').MongoClient;
var config = require('./config');
//var dburl = 'mongodb://sa:password123@ds123381.mlab.com:23381/testimdb';

var dbwrapper = {
    db: undefined
}

var msgCollectionName = 'messages';

dbwrapper.connectToDb = function (callbck) {
    if (config.storeToDb) {
        mongo.connect(config.dburl, function (err, db) {
            callbck(err, db);
            if (err) {
                console.log('error connecting to db');
                return;
            }
            dbwrapper.db = db;
        });
    }
    else {
        callbck(undefined);
    }
}

dbwrapper.pushmsg = function (msgToPush, cb) {

    var collection = dbwrapper.db.collection(msgCollectionName);
    collection.insert(msgToPush, function (err, o) {
        if (err) {
            console.warn(err.message);
            cb(err, undefined);
        }
        else {
            //console.log("chat message inserted into db: " + msg);
            cb(undefined, { errmsg: "", issuccess: true });
        }
    });



}

dbwrapper.getmsg = function (userInfo, cb) {

    var collection = dbwrapper.db.collection(msgCollectionName);
    var stream = collection.find().sort({ _id: -1 }).limit(10).toArray((err, msgs) => {
        if (err) {
            cb({ errmsg: err, issuccess: false }, undefined);
        }
        else {
            if (msgs && msgs.length > 0) {
                msgs.reverse();
            }
            cb(undefined, msgs);
        }
    });


}

module.exports = dbwrapper;