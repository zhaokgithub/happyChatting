/**
 *author zhaok.jy
 *date 2017/8/15
 */
$(document).ready(function () {
    happyChat();
});

function happyChat() {
    var userName = '',pw='';
    var socket = io.connect();//与服务器进行连接
    //登录验证
    $('#login_btn').click(function () {
        userName = $('#userName').val();
        pw = $('#userPassword').val();
        if (userName !== '') {
            socket.emit('userLogin', userName, pw);
        } else {
            alert("输入用户名");
        }
        socket.on('user_message', function (isExistName,num) {
            if(isExistName){
                alert("用户名已存在！");
            }else {
                $('#user_login').css('display', 'none');
                displayOnlineNum(num);
                $('#container').css('display', 'block');
            }
        });
    });
    //发送信息
    $('#sendInfo').click(function () {
        var info = $('#chat_info').val();
        socket.emit('postMsg', info, userName);
        $('#chat_info').val("");
    });

    //接收服务端消息
    socket.on('newMsg', function (msg, userName) {
        displayNewMsg(msg, userName);
    });
}
//展现接收到的信息
function displayNewMsg(msg, userName) {
    var time = new Date();
    var temHtml = "<p>" + "<span style='color:lightskyblue'>" + userName
        + "  " + time.toTimeString().substr(0, 8) + "</span>"
        + "<br>" + msg + "</p>";
    $('#history_info').append(temHtml);
}
//展现当前连接数
function displayOnlineNum(num) {
    var temHtml="<p>"+"当前在线人数:"+num+"</p>";
    $('#chat_header .online_number').append(temHtml);

}

