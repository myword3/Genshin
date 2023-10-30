const express = require('express');
const cors =require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs=require('fs');
const tar = require('tar');

const app = express(); 

const basepath="C:/html"
//跨域
app.use(cors());

app.use(cookieParser());

app.post('/deploy/:name', function (req, res) {

   const list=fs.readdirSync(basepath)
   const {name}=req.params

   if (list.includes(name)) {
    fs.rmdir(path.join(basepath,name),(err) => {
      if (err) {
        console.error('文件夹重命名失败：', err);
      } else {
        console.log('文件夹重命名成功！');
      }})
   }
    req.pipe(
        tar.extract({
        cwd: basepath })// 指定解压后的文件存放目录
          ).on('finish', () => {
            fs.rename(path.join(basepath,'dist'),path.join(basepath,name),(err) => {
              if (err) {
                console.error('文件夹重命名失败：', err);
              } else {
                console.log('文件夹重命名成功！');
              }})
            res.status(200).send({
              code:0,
              message:'部署成功'
            })
          })
          .on('error', (err) => {
            console.error('解压缩失败:', err);
            res.status(500).send({
              code:-1,
              message:err
            })
          });
   
 });

// 启动服务器 
app.listen(3003, () => {
  console.log('3003服务器已启动');
});
