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
    //发送图片
    $('#sendImg').change(function(){
        console.log(this);
        if(this.files.length !== 0){
            var file =this.files[0];
         var reader=new FileReader();
            if(!reader){
                alert('您的浏览器不支持reader,请使用更高版本。');
            }else{
                reader.onload = function(e) {
                    //读取成功，显示到页面并发送到服务器
                    this.value = '';
                    socket.emit('img', e.target.result,userName);
                };
                reader.readAsDataURL(file);
            }

        }
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
    //接收图片
    socket.on('imgInfo',function(img,userName){
        displayImg(img,userName);
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
//转换图片正确展示
function displayImg(img, userName) {
    var date = new Date().toTimeString().substr(0, 8);
    var temHtml = "<p>" + "<span style='color:lightskyblue'>" + userName
        + "  " + date + "</span>" + "</p>"
        + '<a href="' + img + '" target="_blank"><img src="' + img + '"/></a>';
    $('#history_info').append(temHtml);
}


