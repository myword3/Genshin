const express = require('express');
const cors =require('cors');
const { spawn,exec } = require('child_process');
const path = require('path');
const iconv = require('iconv-lite');

const app = express(); 

const command = 'java';
const args = ['-jar', '.\\grasscutter-1.6.1.jar'];
const childProcess = spawn(command, args);

childProcess.stdout.on('data', (data) => {
  console.log(iconv.decode(data, 'gbk'));
});

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));

//跨域
app.use(cors());

app.get('/account/:username/:uid', function (req, res) {
  
  childProcess.stdin.write(`account create ${req.params.username} ${req.params.uid}\n`);//向子进程写入命令

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  childProcess.stdout.on('data', (data) => {
    res.write(data);
    res.end();
  });
 });

// 启动服务器 
app.listen(3000, () => {
  console.log('3000服务器已启动');
});
