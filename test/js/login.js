for(let i=1;i<=2;++i){
    $('ul li').eq(i).css('left',i*50+'px');
}
for(let i=1;i<=2;++i){
    $('div li').eq(i).css('left','10%').css('top',50*i+'px');
}

var input=$('input');

$('#btn').on('click',()=>{
    ajax();
});

//点击回车提交登录信息
$(document).keydown((event)=>{
    if(event.which===13){
        ajax();
    }
})

function ajax(){
    if(input.eq(0).val()===''||input.eq(1).val()===''){
        alert('账号密码不可为空');
        return;
    }
    var request=new XMLHttpRequest();
    request.onreadystatechange=()=>{
        if(request.readyState===4){
            if(request.status===200){
                var ret=JSON.parse(request.responseText);
                console.log(ret);
                if(ret['code']===1){
                    location.href="index.html"; 
                }
                else{
                    alert(ret['msg']);
                }
            }
        }
    }
    console.log($('input').eq(0).val()+'  '+$('input').eq(0).val()+$('input').eq(1).val())
    var str='username='+$('input').eq(0).val()+'&'+'password='+md5($('input').eq(0).val()+$('input').eq(1).val());
    request.open('POST','login');
    request.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    request.send(str);
}