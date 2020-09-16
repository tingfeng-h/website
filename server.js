'use strict';
const mysql=require('./nodejs/node_modules/mysql');
const koa=require('./nodejs/node_modules/koa');
const router=require('./nodejs/node_modules/koa-router')();
const bodyParser=require('./nodejs/node_modules/koa-bodyparser');
const fs=require('fs');

const ser=new koa();
var pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'test',
    port:'3306'
});


ser.use(async (ctx,next)=>{
    console.log(ctx.request.url);
    await next();
})

router.get('/',async (ctx,next)=>{
    ctx.response.type='text/html';
    ctx.response.body=fs.readFileSync('./test/index.html');
})
router.get('/index.html',async (ctx,next)=>{
    ctx.response.type='text/html';
    ctx.response.body=fs.readFileSync('./test/index.html');
})
router.get('/photo.png',async (ctx,next)=>{
    ctx.response.body=fs.readFileSync('./test/photo.png');
})
router.get('/css/interface.css',async (ctx,next)=>{
    ctx.response.type='text/css';
    ctx.response.body=fs.readFileSync('./test/css/interface.css');
})
router.get('/js/interface.js',async (ctx,next)=>{
    ctx.response.body=fs.readFileSync('./test/js/interface.js');
})
//备案图标
router.get('/b.png',async (ctx,next)=>{
    ctx.response.body=fs.readFileSync('./test/b.png');
})
//注册页面
router.get('/register.html',async (ctx,next)=>{
    ctx.response.type='text/html';
    ctx.response.body=fs.readFileSync('./test/register.html');
})
router.get('/css/register.css',async (ctx,next)=>{
    ctx.response.type='text/css'
    ctx.response.body=fs.readFileSync('./test/css/register.css');
})
router.get('/js/register.js',async (ctx,next)=>{
    ctx.response.body=fs.readFileSync('./test/js/register.js');
})
router.get('/login.html',async (ctx,next)=>{
    ctx.response.type='text/html';
    ctx.response.body=fs.readFileSync('./test/login.html');
})
router.get('/css/login.css',async (ctx,next)=>{
    ctx.response.type='text/css';
    ctx.response.body=fs.readFileSync('./test/css/login.css');
})
router.get('/js/login.js',async (ctx,next)=>{
    ctx.response.body=fs.readFileSync('./test/js/login.js');
})
//返回视频页面
router.get('/video.html',async (ctx,next)=>{
    ctx.response.type='text/html';
    ctx.response.body=fs.readFileSync('./test/video.html');
})
router.get('/css/video.css',async (ctx,next)=>{
    ctx.response.type='text/css';
    ctx.response.body=fs.readFileSync('./test/css/video.css');
})
router.get('/js/video.js',async (ctx,next)=>{
    ctx.response.body=fs.readFileSync('./test/js/video.js');
})
//返回视频数据  code为1表示暂无视频
router.get('/video',async (ctx,next)=>{
    ctx.response.body=JSON.stringify({'code':2,'video':'/video/test.mp4'});
})
router.get('/video/test.mp4',async (ctx,next)=>{
    ctx.response.set({
        "Content-Type":"video/mp4",
        "access-control-allow-credentials": true,
        "access-control-allow-headers": "Range",
        "access-control-allow-methods": 'GET, OPTIONS',
        "access-control-expose-headers": "Content-Length, Content-Range, x-service-module"
    })
    ctx.response.body=fs.readFileSync('./test/video/test.mp4');
})
//返回弹幕信息
router.post('/getbarrage',async (ctx,next)=>{
    let data=await query('select time,data from barrage');
    console.log(data);
    ctx.response.body=data
})
//保存弹幕数据
router.post('/barrage',async (ctx,next)=>{
    console.log(JSON.parse(JSON.stringify(ctx.request.body))['barrage'].split(':'));
    var data=JSON.parse(JSON.stringify(ctx.request.body))['barrage'].split(':');
    pool.getConnection((err,con)=>{
        if(err){
            throw err;
        }
        con.query('insert ignore into barrage(video,time,data) values(?,?,?)',[getCookie(ctx,'video'),data[0],data[1]],(err,result)=>{
            if(err){
                throw err;
            }
        });
        con.release();
    })
    if(getCookie(ctx,'token')){
        pool.getConnection((err,con)=>{
            if(err){
                throw err;
            }
            con.query('update userdata set allexp=allexp+1 where nick=?',[getCookie(ctx,'token')],(err,result)=>{
                if(err){
                    throw err;
                }
            })
            con.release();
        })  
    }
    ctx.response.body={'code':1}
})
//返回用户信息
router.get('/test',async (ctx,next)=>{
    let data=await query('select * from userdata where nick=?',[getCookie(ctx,'token')]);
    let temp={'code':1,'nick':data[0]['nick'],'lv':data[0]['lv'],'allexp':data[0]['allexp'],'coin':data[0]['coin'],'follow':data[0]['follow'],'fan':data[0]['fan']}
    ctx.response.body=JSON.stringify(temp);
})

ser.use(bodyParser());   //解析请求体

//注册
router.post('/server',async (ctx,next)=>{
    let data=await query('select user from user where user=?',[ctx.request.body.username]);
    console.log(data);
    if(data.length===0){
        pool.getConnection((err,con)=>{
            if(err){
                throw err;
            }
            con.query('insert into user(user,password) values(?,?)',[ctx.request.body.username,ctx.request.body.password],(err,result)=>{
                if(err){
                    console.log(err.message);
                    throw err;
                }
            })
            con.query('insert into userdata(nick,lv,allexp,coin,follow,fan) values(?,?,?,?,?,?)',[ctx.request.body.username,1,0,0,0,0,0],(err,result)=>{
                if(err){
                    throw err;
                }
            })
            con.release();
        })
        ctx.response.body=JSON.stringify({'code':1});
    }else{
        ctx.response.body=JSON.stringify({'code':2,'msg':'账号已存在'});
    }
})

//登录
router.post('/login',async (ctx,next)=>{
    let data=await query('select user,password from user where user=? and password=?',[ctx.request.body.username,ctx.request.body.password]);
    if(data.length!==0){
        ctx.response.set('Set-Cookie','token='+ctx.request.body.username+';path=/');
        ctx.response.body=JSON.stringify({'code':1});
    }      
    else
        ctx.response.body=JSON.stringify({'code':2,'msg':'账号或密码错误'});  
})

//登出
router.get('/account/logout',async (ctx,next)=>{
    var oDate=new Date();
    oDate.setDate(oDate.getDate()-7);
    let cook='token='+ctx.request.headers['cookie'].substring(6)+';expires='+oDate.toGMTString()+';path=/';
    ctx.response.set('Set-Cookie',cook);
    ctx.response.body=JSON.stringify({'code':1});
})

ser.use(router.routes());
ser.listen(80);
console.log('Listen...');
//同步操作mysql
function query( sql, values ) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection((err,con)=>{
            if(err){
                reject(err);
            }
            con.query(sql,values,(err,result)=>{
                if(err){
                    reject(err);
                }
                resolve(result);
            })
            con.release();
        })   
    })
}

//获取cookie
function getCookie(ctx,key) {
    var name = key + "=";
    var ca = ctx.request.headers['cookie'].split('; ');
    for(var i=0; i<ca.length; i++) 
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}