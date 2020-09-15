var arr=new Map();
var msg='';
var input=$('input');
var vid=document.getElementById('video');
var div=$('div#test');

//获取视频
vid.src=getCookie('video');

//获取弹幕数据
$.ajax('getbarrage',{
    method:'POST',
    dataType:'json',
}).done((data)=>{
    console.log(data)
    arr=toMap(data);
    console.log(arr);
}).fail((xhr,status)=>{
    console.log('错误:'+status)
})

//发送弹幕
input.eq(1).on('click',()=>{
    let pos=Math.random()%5*50;
    let time=Math.floor(vid.currentTime/2.5*10),speed='animation: 5s test linear;';
    if(input.eq(0).val().length>10){
        div.append('<span style="top:'+pos+'px;'+speed+'">'+input.eq(0).val()+'</span>');
        arr.set(time,'<span style="top:'+pos+'px;'+speed+'">'+input.eq(0).val()+'</span>')
    }else{
        div.append('<span style="top:'+pos+'px">'+input.eq(0).val()+'</span>');
        arr.set(time,'<span style="top:'+pos+'px">'+input.eq(0).val()+'</span>')
    }
    console.log(temp)
    $.ajax('barrage',{
        method:'POST',
        dataType:'json',
        data:{barrage:time+':'+input.eq(0).val()}
    })
    msg=arr.get(time);
    setTimeout(()=>{
        msg='';
    },1000);
    input.eq(0).val('');
})

//回车发送弹幕
$(document).keydown((event)=>{
    if(event.which===13){
        let time=Math.floor(vid.currentTime/2.5*10);
        let pos=Math.random()%5*50,speed='animation: 5s test linear;';
        if(input.eq(0).val().length>10){
            div.append('<span style="top:'+pos+'px;'+speed+'">'+input.eq(0).val()+'</span>');
            arr.set(time,'<span style="top:'+pos+'px;'+speed+'">'+input.eq(0).val()+'</span>')
        }else{
            div.append('<span style="top:'+pos+'px">'+input.eq(0).val()+'</span>');
            arr.set(time,'<span style="top:'+pos+'px">'+input.eq(0).val()+'</span>')
        }
        msg=arr.get(time);
        let temp=JSON.stringify(time,input.eq(0).val());
        $.ajax('barrage',{
            method:'POST',
            dataType:'json',
            data:{barrage:time+':'+input.eq(0).val()}
        })
        input.eq(0).val('');
        setTimeout(()=>{
            msg='';
        },1000);
    }
})
vid.ontimeupdate=function(){
    let time=Math.floor(vid.currentTime/2.5*10);
    if(arr.has(time)&&msg!=arr.get(time)){
        div.append(arr.get(time));
        msg=arr.get(time);
        console.log(arr.get(time))
        console.log(msg)
    }
}
var timer;
vid.onplay=function(){
    console.log('开始播放')
    msg='';
}
vid.onpause=function(){
    console.log('暂停播放')
}

//转换成Map
function toMap(json){
    var temp=JSON.parse(JSON.stringify(json));
    console.log(temp)
    var m=new Map(),speed='animation: 5s test linear;';
    for(let index in temp){
        let pos=Math.random()%5*50;
        if(temp[index]['data'].length>10){
            m.set(parseInt(temp[index]['time']),'<span style="top:'+pos+'px;'+speed+'">'+temp[index]['data']+'</span>');
        }else{
            m.set(parseInt(temp[index]['time']),'<span style="top:'+pos+'px;">'+temp[index]['data']+'</span>')
        }
    }
    return m;
}

//获取cookie
function getCookie(key) {
    var name = key + "=";
    var ca = document.cookie.split('; ');
    for(var i=0; i<ca.length; i++) 
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}