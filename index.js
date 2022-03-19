const express = require('express');
const app = express();
// パス指定用モジュール
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs')
const readline = require('readline')
const os = require('os');

// 8080番ポートで待ちうける
app.listen(8081, () => {
  console.log('Running at Port 8081...');
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
  fs.writeFile('./json/chat.json',JSON.stringify(req.body)+os.EOL,options,(err)=>{
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
  const stream = fs.createReadStream('./json/chat.json', {
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

});  /*
  fs.readFile('./json/chat.json','utf8',(err,data) => {
    if(err){
      console.log(err);
      throw err;
    }
    forEach
    console.log(data);
    res.send(data);
  })
  */

