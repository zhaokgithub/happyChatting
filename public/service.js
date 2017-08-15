/**
 *author zhaok.jy
 *date 2017/8/14
 *description the server of chatting room.
 */
var http = require('http'),
    express = require('express'),
    app = express(),
    users = [],
//创建服务
    server = http.createServer(app);
app.use('/', express.static(__dirname));
server.listen(8080, '10.167.222.48');

//socket与客户端连接
var io = require('socket.io').listen(server);
io.on('connection', function (socket) {
    socket.on('userLogin', function (userNm,pw) {
        if (users.indexOf(userNm) > -1) {
            socket.emit('user_message',true);
            console.log('用户名已存在！');
        }else {
            users.push(userNm);
            socket.emit('user_message',false);
        }
    });
    //接收客户端的消息
    socket.on('postMsg', function (msg,userName) {
        //接收到的消息,发送除自己之外的人
       // socket.broadcast.emit('newMsg',  msg);
        //接收到的消息,发送除所有人
        if(msg!==''){
            //socket.broadcast.emit('newMsg',  msg);
            io.sockets.emit('newMsg',  msg,userName);
        }
        // //接收到的消息,发送给自己
        // socket.emit('message', msg);
    });
    socket.on('disconnect', function() {
        //将断开连接的用户从users中删除
        //users.splice(socket.userIndex, 1);
        //通知除自己以外的所有人
        //socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        console.log(users);
    });
});


console.log('10.167.222.48:8080服务已启动!');