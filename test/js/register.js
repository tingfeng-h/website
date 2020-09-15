for(let i=1;i<=3;++i){
    $('div li').eq(i).css('left','10%').css('top',50*i+'px');
}

//验证用户名&密码合法性
var input=$('input'),test,test1;
input.eq(1).on('input',()=>{
    var reg=new RegExp('[A-Za-z0-9]{8,10}');
    if(!reg.test(input.eq(1).val())){
        input.eq(1).css('background-color','red');
        test=false;
    }
    else{
        input.eq(1).css('background-color','white');
        test=true;
    }
})
input.eq(2).on('input',()=>{
    var reg=new RegExp('[A-Za-z0-9]{8,15}');
    if(!reg.test(input.eq(2).val())){
        input.eq(2).css('background-color','red');
        test1=false;
    }
    else{
        input.eq(2).css('background-color','white');
        test1=true;
    }
})

//发送注册信息
$('#btn').on('click',()=>{
    ajax();
})


//点击回车提交注册信息
$(document).keydown((event)=>{
    if(event.which===13){
        ajax();
    }
})

function ajax(){
    if(!test||!test1){
        alert('请按正确格式输入');
        return;
    }
    var request=new XMLHttpRequest();
    request.onreadystatechange=()=>{
        if(request.readyState===4){
            var ret=JSON.parse(request.responseText);
            console.log(request.responseText);
            if(request.status===200){
                if(ret['code']===1){
                    alert('注册成功');
                    location.href="login.html";
                }
                else{
                    alert(ret['msg']);
                }
            }
        }
    }
    var input=$('input');
    var str='username='+$('input').eq(1).val()+'&'+'password='+md5(input.eq(1).val()+input.eq(2).val());
    //请求url  第二个参数添加请求url
    request.open('POST','server');
    request.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    request.send('type='+'1&'+str+'&email='+input.eq(0).val());
    console.log(input.eq(0).val());
}