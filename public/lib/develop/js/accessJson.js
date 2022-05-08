let writeJson = function(){
  if(window.event.keyCode === 13 && $('#sendMessageField').val()){ 
    $.ajax({
      type: "post",
      url:"/jsonwrite/",
      data: createSendMessage(),
      contentType: 'application/json',
      dataType:"json"
    }).done((data => {
      ;
    })).fail((data) => {
      console.log('cannot access url');
    })
  }
}

let createSendMessage = function(){
    let output = {};
    output.time = moment().format('YYYY/MM/DD HH:mm:SS');
    output.name = $('#username').val();
    output.text = $('#sendMessageField').val();
    $('#sendMessageField').val("");
    return JSON.stringify(output);
}
  
let  readJson = function(){
    $.ajax({
      type: "post",
      url:"/jsonread/",
      data: JSON.stringify({"currentline":$('#currentline').val()}),
      contentType: 'application/json',
      dataType:"json"
    }).done((data => {
      updateMessage(data);
    })).fail((data) => {
      console.log('cannot access url');
    })
}

let updateMessage = function(data){
    if(data.length>0){
        let loginuser = $('#username').val();
        let message = "";
        data.forEach(dt => {
            if(loginuser === dt.name) message = createMessage(dt);
            else message = createMessageOther(dt);

            $('#messages').append(message);
            $('#currentline').val(dt.currentline);    
        })
        scrollBottom();
        let lastdata = data[data.length-1];
        let isFocus = document.hasFocus();
        if(!isFocus && loginuser !==  lastdata.name) push(lastdata);
    }
}

let createMessageOther = function(data){
  let output = "";
  output += '<li class="clearfix">';
  output += '<div class="message-data text-right">';
  output += '    <span class="message-data-time">'+data.time+'</span>';
  output += '    <span class="message-data-time">'+data.name+'</span>';
  output += '    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">';
  output += '</div>';
  output += '<div class="message other-message float-right">'+data.text+'</div>';
  output += '</li>';

  return output;
}

let createMessage = function(data){
    let output = "";
    output += '<li class="clearfix">';
    output += '<div class="message-data">';
    output += '    <span class="message-data-time">'+data.time+'</span>';
    output += '    <span class="message-data-time">'+data.name+'</span>';
    output += '</div>';
    output += '<div class="message my-message">'+data.text+'</div>';
    output += '</li>';

    return output;
}

let scrollBottom = function(){
  $('.chat-history').scrollTop($('.chat-history').get(0).scrollHeight);
}

let push = function(data){
  Push.create(data.text);
}