var moment = require('moment');

// timestamp with UTC time
console.log(moment.utc().format('ddd MMM DD YYYY HH:mm:ss z'));

// or via the date object
console.log(moment.utc().toDate().toUTCString());

//var dateformat="YYYY-MM-DD HH:mm:ss";
var dateformat="DD-MMM-YY HH:mm A";
var currentTimeInUtc=moment.utc().format(dateformat);
console.log('currentTimeInUtc '+ currentTimeInUtc);
//yyyy-mm-dd HH:MM:ss
var currentlocalTime=moment.utc(currentTimeInUtc, dateformat).local().format(dateformat);
console.log("currentlocalTime "+ currentlocalTime);
console.log(moment.locales());