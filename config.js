var config = {
	port: process.env.PORT || 5000,
	dburl: 'mongodb://test:test@ds141534.mlab.com:41534/smartchat',
    homepage:'home.html',
    storeToDb:false,
    fileToSave:'content.txt',
    usersFile:'users.json',
    lastNoOfMessages:10,
    sessionTimeOutInMinutes:1
};
module.exports = config;