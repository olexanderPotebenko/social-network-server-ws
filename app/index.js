let config = require('./config/app');
let WebSocket = require('ws').Server;
let wss = new WebSocket({port: config.port});

let users = require('./controllers/users');

let actions = {
  auth: 'AUTH',
  send_message: 'SEND-MESSAGE',
  read_messages: 'READ-MESSAGES',
}

//main
console.log('Ws-server START on port: ' + config.port);

wss.on('connection', function(ws) {
  console.log('connection');

  ws.on('message', function(message) {

    // setInterval( () => {
    //   wss.clients.forEach(client => {
    //     console.log(`Client: ${client.id} online`);
    //   })
    // }, 5000);
    try {
      message = JSON.parse(message);


      console.log(message);
      switch(message.action) {
        case actions.auth:
          if(true) {
            console.log('AUTH');
            console.log(message);
            ws.send('authorized');

            ws.id = message.id;
            ws.token = message.token;
            console.log(ws.token);

            ws.on('message', function(message) {
              ws.send(message);
            });
          } else {
            let data = JSON.stringify({
              result_code: 1,
              text: 'unauthorized'
            });
            ws.send(data);
            ws.terminate();
          }
          break;
        case actions.send_message:
          console.log(message);
          console.log('SEND MESSAGE');
          wss.clients.forEach(client => {
            console.log(client.id);
            console.log(message.user_id);
            console.log(client.readyState);
            console.log(WebSocket);
            if(client.id == message.user_id && client.readyState == 1) {
              console.log('SEND MESSAGE FOR CLIENT WITH ID: ' + client.id);
            console.log(new Date().getMinutes());
              let data = {
                id: message.id,
                action: actions.send_message,
              };
              console.log(data);
              client.send(JSON.stringify(data));
            } else {
              console.log('Client ' + client.id + 'not online');
            };
          });
          break;
        case actions.read_messages:
          wss.clients.forEach(client => {
            if(client.id === message.user_id && client.readyState == 1) {
              console.log(`SEND FOR USER ID=${message.user_id} TO UPDATE DIALOG ID=${message.dialog_id}`);
              let data = {
                dialog_id: message.dialog_id,
                action: actions.read_messages,
              };
              console.log(data);
              client.send(JSON.stringify(data));
            } else {
              console.log('Client ' + client.id + 'not online');
            };
          });
          console.log(message);
          break;
      };
    } catch(e){
      console.log(e);
      let data = JSON.stringify({
        result_code: 1,
        text: e 
      });
      ws.send(data);
      ws.terminate();
    }
  });
});



