const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs')
const readline = require('readline')
const os = require('os');
const conf = require('config');

app.listen(conf.port, () => {
  console.log('Running at Port '+conf.port+'...');
});

// 静的ファイルのルーティング
app.use(express.static(path.join(__dirname, 'public')));

// CSV書き込み
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.post('/jsonwrite/',(req,res) => {
  console.log(req.body);
  const options = {
    flag: 'a'
  };
  fs.writeFile(conf.chatfilepath,JSON.stringify(req.body)+os.EOL,options,(err)=>{
    if(err){
      console.log(err);
      throw err;
    }
  });
  res.send("Received Post Data");
});

// CSV取得
app.post('/jsonread/',(req,res) => {
  console.log(req.body);
  // Streamを準備
  const stream = fs.createReadStream(conf.chatfilepath, {
    encoding: "utf8",         // 文字コード
    highWaterMark: 1024       // 一度に取得するbyte数
  });

  // readlineにStreamを渡す
  const reader = readline.createInterface({ input: stream });

  let i = 1;
  let current = Number(req.body.currentline);
  let retdata = [];
  reader.on("line", (data) => {
    console.log(data);
    console.log(i>current);
  // 行番号を作成
    if(i>current){
      dataJson = JSON.parse(data);
      dataJson.currentline=i;
      retdata.push(dataJson);
    }
    i++;
  });
  reader.on('close',(data) => {
    console.log(retdata);
    res.send(retdata);  
  })

});