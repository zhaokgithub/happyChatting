/**
 *author zhaok.jy
 *date 2017/8/14
 *description the server of chatting room.
 */
var http = require('http'),
    express = require('express'),
    app = express(),
    users = [],
    server = http.createServer(app),
    io = require('socket.io').listen(server);

app.use('/', express.static(__dirname));
console.log(app);
server.listen(8080, '127.0.0.1');

//socket与客户端连接
io.on('connection', function (socket) {
    socket.on('userLogin', function (userNm, pw) {
        if (users.indexOf(userNm) > -1) {
            socket.emit('user_message', true, 0);
            console.log('用户名已存在！');
        } else {
            //将登陆的用户信息临时保存起来
            socket.userId = users.length;
            socket.userNm = userNm;
            users.push(userNm);
            socket.emit('user_message', false, users.length);
        }
    });
    //接收客户端的消息
    socket.on('postMsg', function (msg, userName) {
        //接收到的消息,发送除自己之外的人
        // socket.broadcast.emit('newMsg',  msg);
        if (msg !== '') {
            io.sockets.emit('newMsg', msg, userName);
        }
        // //接收到的消息,发送给自己
        // socket.emit('message', msg);
    });
    socket.on('disconnect', function () {
        //将断开连接的用户从users中删除
        users.splice(socket.userId, 1);
        //通知除自己以外的所有人
        //socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });
    socket.on('img',function(img,userName){
        io.sockets.emit('imgInfo', img, userName);
    });
});


console.log('127.0.0.1:8080服务已启动!');