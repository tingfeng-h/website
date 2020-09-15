for(let i=1;i<=2;++i){
    $('ul li').eq(i).css('left',i*50+'px');
}

//请求视频信息
var video=[];
$.ajax('video',{
    method:'GET',
    dataType:'json',
}).done((data)=>{
    let temp=JSON.parse(JSON.stringify(data));
    if(temp['code']===1){
        return;
    }
    for(let d in temp){
        video.push(temp[d]);
    }
    console.log(video.length)
    $('nav a').text(video[1].substring(7));
    for(let i=1;i<video.length-1;++i){
        $('nav').append($('nav a').eq(0).clone(true).css('left',i*10+'%')).text(video[i+1].substring(7))
    }
    
    for(var i=0;i<video.length;++i){
        $('nav a').eq(i).on('click',((i)=>{
            return function(){
                document.cookie="video="+video[i+1]+";path=/;";
                console.log('点击')
            }
        })(i))
    }
})
console.log(getCookie('token'))
//请求用户数据
if(getCookie('token')){
    $.ajax('test',{
        method:'GET',
        dataType:'json'
    }).done((data)=>{
        var userdata=JSON.parse(JSON.stringify(data));
        console.log(data)
        if(userdata['code']===1){
            var tag=document.getElementById('user');
            tag.innerText='个人中心';
            tag.href="#";
            var li=$('li').eq(3);
            li.addClass('select');
            var select1=$('li.select>ul');
            console.log(select1);
            select1.append(`<li style="left:0;width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">用户名:`+userdata['nick']+`</li>
            <li style="left:0;top:30px;width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">等级:`+userdata['lv']+`</li>
            <li style="left:0;top:60px;width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">总经验:`+userdata['allexp']+`</li>
            <li style="left:0;top:90px;width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">硬币数:`+userdata['coin']+`</li>
            <li style="left:0;top:120px;width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">关注数:`+userdata['follow']+`</li>
            <li style="left:0;top:150px;width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">粉丝数:`+userdata['fan']+`</li>
            <li style="top:180px;left:0;"><button style="width:150px;" id="btn">注销</button></li>`);
            var btn=$('#btn');
            btn.on('click',()=>{
                $.ajax('/account/logout',{
                    method:'GET',
                    data:getCookie('token')
                }).done((data)=>{
                    tag.innerText="登录";
                    tag.href="login.html";
                    select1.remove();
                    li.removeClass('select');
                    console.log('点击')
                });
            })
        }
        else{
            return;
        }
    }).fail((xhr,status)=>{
        document.write('失败:'+xhr.status);
    }).always(()=>{
        
    })
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
