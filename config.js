var moment = require('moment');

var config = {
	port: process.env.PORT || 5000,
	dburl: 'mongodb://test:test@ds141534.mlab.com:41534/smartchat',
    homepage:'home.html',
    storeToDb:true,
    fileToSave:'content.txt',
    usersFile:'users.json',
    lastNoOfMessages:10,
    sessionTimeOutInMinutes:1,
    dateformat:"DD-MMM-YY HH:mm A",
    utils:{
        getCurrentUtcTimeString:function(){
           return moment.utc().format(config.dateformat)
        },
        getLocalTimeFromUtcTimeString:function(utcTimeFormat){
            var dateformat=config.dateformat;
           return moment.utc(currentTimeInUtc, dateformat).local().format(dateformat);
        },

    }
};
module.exports = config;