const express = require('express');
const cors =require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs=require('fs');
const imageSize = require('image-size');
const picturepath='C:/static/Image';
const pictureList=[];

const app = express(); 

//跨域
app.use(cors());

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));


app.use(cookieParser());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });

app.get('/picture', function (req, res) {
   const pictureList=fs.readdirSync(picturepath)
   const {pageSize=20,pageNum=0}=req.query
   
   const detailList=pictureList.slice(pageNum*pageSize,(Number(pageNum)+1)*pageSize)
                               .map(item=>{
                                const dimensions = imageSize(path.join(picturepath,item));
                                return {
                                  name:item,
                                  url:`http://127.0.0.1:4399/static/image/${item}`,
                                  height:dimensions.height,
                                  width:dimensions.width
                                }
                               })
   res.send({
    code:0,
    count:pictureList.length,
    pageSize:Number(pageSize),
    pageNum:Number(pageNum),
    list:detailList,
   });
 });
 app.delete('/picture/:id', function (req, res) {
  
   console.log(req.params.id);
   fs.unlink(path.resolve(picturepath,req.params.id), (err) => {
    if (err) {
      console.error(err);
      return res.send({code:-1,message:'删除失败'});
    }})
  
    res.send({code:0,message:'删除成功'});
  });

// 启动服务器 
app.listen(3001, () => {
  console.log('3001服务器已启动');
});
