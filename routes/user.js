const express=require('express')
//引入连接池模块
const pool=require('../pool.js')
//创建路由器对象
const router=express.Router();
//添加路由
//1.用户注册
router.post('/reg',function(req,res){
	//1.1获取post请求数据
	var obj=req.body;
	console.log(obj);
	//1.2验证数据是否为空
	if (!obj.uname)
	{  res.send({code:401,msg:'uname required'});
	   //阻止往后执行
	   return;
	}else
    if (!obj.upwd)
    {  res.send({code:402,msg:'upwd required'});
	   return;
	}else
	if(!obj.email)
	{  res.send({code:403,msg:'email required'});
	   return;
	}else
	if(!obj.phone)
	{  res.send({code:404,msg:'phone required'});
	   return;
	}
    //1.3执行SQL语句
    pool.query('INSERT INTO xz_user SET ?',[obj],function(err,result){
		if(err) throw err;
		console.log(result);
		//如果注册成功
		//{ code:200,msg:'register suc' }
        res.send({code:200,msg:'register suc'});
    })
	 res.send('注册成功')
});

//2.用户登录
router.post('/login',function(req,res){
	var obj=req.body;
	//console.log(obj);
	if (!obj.uname)
	{  res.send({code:401,msg:'uname required'});
	   return;
	}else
    if (!obj.upwd)
    {  res.send({code:402,msg:'upwd required'});
	   return;
	}
	//2.3执行SQL语句
	//查找用户和密码同时满足的数据
	pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?;',[obj.uname,obj.upwd],function(err,result){
		if (err) throw err;
		if (result.length>0)
		{  res.send({code:200,msg:'login suc'});
		}else{
		   res.send({code:301,msg:'login err'});  }
	});
});
	
//3.检索用户
router.get('/detail',function(req,res){
	//3.1获取数据
	var obj=req.query;
	//3.2验证是否为空
	if (!obj.uid)
	{ res.send({code:401,msg:'用户编号为空'})
	}
	
	pool.query('SELECT * FROM xz_user WHERE uid=?;',[obj.uid],function(err,result){
		if (err) throw err;
		//判断是否检索到用户，如果检索到，把该用户的对象响应到浏览器，否则响应检索不到
		if (!result.length>0)
		{ res.send({code:301,msg:'检索失败'});
		}else
		{ res.send(result[0])}
	    });	
});

//4.!!修改用户
router.get('/update',function(req,res){
	//4.1获取数据
	var obj=req.query;
	console.log(obj)
    //4.2验证数据是否为空
	//遍历对象，获取每个属性值
	var i=400;
	for ( var key in obj )
		//如果属性值为空，则提示属性名是必须的
	{ 
		i++;
	  if (!obj[key])
	  {  res.send({code:i,msg:key+'未填写'})
		 return;
	  }
	}
	res.send('修改用户')
    pool.query('UPDATE xz_user SET ? WHERE uid=?;',[obj,obj.uid],function(err,result){
		if(err) throw err;
		if (!result.affectedRows>0)
		{  res.send({code:301,msg:'修改失败'})
		}else{
		   res.send({code:200,msg:'修改成功'}) };
    })
});

//5.用户列表
router.get('/list',function(req,res){
	//5.1获取数据
	var obj=req.query;
	var pno=obj.pno;
	var size=obj.size;
	//如果页码为空，默认为1
	if (!pno) pno=1;
	//如果大小为空，默认为3
	if (!size) size=3;
	//5.3转为整型
	pno=parseInt(pno);
	size=parseInt(size);
	//5.4计算开始查询的值
	var start=(pno-1)*size;
	//执行SQL语句
	pool.query('SELECT * FROM xz_user LIMIT ?,?;',[start,size],function(err,result){
		if(err) throw err;
		res.send(result);
	})
})

//6.删除用户
router.get('/delete',function(req,res){
	var obj=req.query;
	if (!req.query)
	{  res.send({code:401,msg:'编号不能为空'})
	}
	pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if(err) throw err;
		console.log(result);
		if (!result>0)
		{ res.send({code:301,msg:'删除失败'})
		}else
		{ res.send('删除成功') }
	});
});

//导出路由器对象
module.exports=router;

