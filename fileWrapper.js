var fs = require('fs');
var config = require('./config');

var fileWrapper = {};

fileWrapper.GetMessages = (req, cb) => {

    
    var dataToSend = [];
    
    if (fs.existsSync(config.fileToSave)) {        
        fs.readFile(config.fileToSave, 'utf8', (err, data) => {
            if (err)
                cb(err, undefined);
            else {
                data=JSON.parse(data);
                //need to filter based on the user request here
                data=data.filter(msg=>{
                    return (msg.to==req.username || msg.from==req.username );
                }).slice(-1*config.lastNoOfMessages);
                cb(undefined, data);        
            }
        });
    } else {
        cb(undefined, dataToSend);
    }
}

fileWrapper.clearMessages = () => {
    fs.writeFile(config.fileToSave,JSON.stringify([]));
}

fileWrapper.SaveMessages = (req, cb) => {

    var dataToSave=[];
    
    var saveNow=(data,callBack)=>{
            fs.writeFile(config.fileToSave,JSON.stringify(data),callBack);
            cb(undefined,{errmsg:"",issuccess:true})
    }
    
    if (fs.existsSync(config.fileToSave)) {
        //read the contents and then save
         fs.readFile(config.fileToSave, 'utf8', (err, data) => {
            if (err)
                cb(err, undefined);
            else {
                dataToSave=JSON.parse(data);
                dataToSave.push(req);        
                saveNow(dataToSave,cb);        
            }
        });
    }
    else{
        dataToSave.push(req);

        saveNow(dataToSave,cb);
    }
      
    
}


module.exports = fileWrapper;