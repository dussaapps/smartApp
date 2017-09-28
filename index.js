var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var customEncryption=require('./crypto');

var dateFormat = require('dateformat');
var fs = require('fs');
var config=require('./config');


var controller = require('./controller');
app.use(cookieParser());
app.set('port', (process.env.PORT || 3000))
app.use(express.static(__dirname + '/public'))


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json 
app.use(bodyParser.json())

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/' + 'home.html');
})

app.post('/login', function (request, response) {
     var reqInput = request.body;
     var cb=(err,userInfo)=>{
         var result={
             errmsg:'',
             isSuccess:false
         }
            if(err){
                result.isSuccess=false;
                if(err.msg){
                    result.errmsg=err.msg;
                }
            }
        if(userInfo){
            result.isSuccess=true;
            var encryptedUserName=customEncryption.encryptData(userInfo.username);
            var expiryDate=new Date();
            expiryDate.setMinutes(expiryDate.getMinutes()+config.sessionTimeOutInMinutes);
            response.cookie('user', encryptedUserName,{expire : expiryDate,httpOnly: true});
        }
        else{
            result.isSuccess=false;
            
        }
        
        response.json(result);
     }
     var params={
         username:reqInput.username,
         passcode:reqInput.passcode
     }
     controller.loginUser(params,cb)
})

app.get('/home', function (request, response) {
    response.sendFile(__dirname + '/public/' + 'home.html');
})

app.get('/getmsgs', function (request, response) {
    // var data = {
    //     msgs: [
    //         {
    //             'msg': 'Hi',
    //             'time': dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
    //         },
    //         {
    //             'msg': 'Hello',
    //             'time': dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
    //         }
    //     ]
    // }
    // response.send(data);

     var requestUser=request.cookies['user'];
    if(requestUser && requestUser.length>0){//getting username from cookie
        request.query.username=customEncryption.decryptData(requestUser);
    }
    else{
        response.send({sessionExpired:true});
        return;
    }

        var callBack = (err, data) => {
            
        if (err) {
            response.status(500).send({ error: err });
            return;
        }
        if(data && data.length==0){
            data.push({
                msg:'No Messages',
                fromme:false,
                time:config.utils.getCurrentUtcTimeString()// dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
            });
        }
        var dataToSend={
            msgs:data
        }
        response.send(dataToSend);
    }
    var reqParams=request.query;
    controller.getMessages(reqParams, callBack);
})

app.get('/clearAll', function (request, response) {

    controller.clearAllData();
    response.send({cleared:true});
})

app.post('/msgs', function (request, response) {
    //console.log(request.body);

    var requestUser=request.cookies['user'];
    if(requestUser && requestUser.length>0){//getting username from cookie
        request.body.username=customEncryption.decryptData(requestUser);
    }
    else{
        response.send({sessionExpired:true});
        return;
    }

    var reqInput = request.body;
    var msgToPush = {
        from: reqInput.username,
        to: reqInput.username=='tom'?'jerry':'tom',
        message: reqInput.msg,
        code:reqInput.code
    }
    var callBack = (err, data) => {
        if (err) {
            response.status(500).send({ error: err });
            return;
        }
        response.send(data);
    }
    controller.pushMessages(msgToPush, callBack);

})


controller.startBackend((err, db) => {

    if (err) {
        console.log("Node app failed to start as db is down");
        console.log(err);
        return;
    }
    app.listen(app.get('port'), function () {
        //console.log("Node app is running at localhost:" + app.get('port'))
    })

});

