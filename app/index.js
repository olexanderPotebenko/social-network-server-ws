let config = require('./config/app');
let WebSocket = require('ws').Server;
let wss = new WebSocket({port: config.port});

let users = require('./controllers/users');

let actions = {
    auth: 'AUTH',
    send_message: 'SEND-MESSAGE',
}

//authClients
let authClients = []; // {id: '', ws}
let checkAuthData = (message) => message.id && message.token;
let checkAuth = (id) => 
    authClients.find(client => client.id == id);
let addToAuthClients = ( id, client) => {
    if(!checkAuth(id)){
        authClients.push({id, client});
        console.log(authClients.length);
    };
};
let removeAuthClient = client => 
    authClients = authClients.filter(item => item.id != client.id);

//main
console.log('Ws-server START on port: ' + config.port);

wss.on('connection', function(ws) {
    console.log('connection');

    ws.on('message', function(message) {

        try {
            message = JSON.parse(message);

            if(message.action === actions.auth){
                if(checkAuthData(message)) {
                    console.log('AUTH');
                    addToAuthClients(message.id, ws);
                    ws.send('authorized');
                    ws.on('message', function(message) {
                        ws.send(message);
                    });
                }else{
                    let data = JSON.stringify({
                        result_code: 1,
                        text: 'unauthorized'
                    });
                    ws.send(data);
                    ws.terminate();
                }
            }

            if(message.action === actions.send_message) {
                if(checkAuth(message.id)){
                    console.log('SEND MESSAGE');
                    ws.send(JSON.stringify(message));
                }
            };
        }catch(e){
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



