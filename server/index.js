const server = require('ws').Server;
const s = new server({ port: 5001 });
const fs = require('fs');
s.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message);
    message = JSON.parse(message);
    if (message.type === 'senderName') {
      ws.senderName = message.data;
      return;
    }
    if (message.type === 'receiverName') {
      ws.receiverName = message.data;
      return;
    }

    s.clients.forEach(function (client) {
      console.log(client.senderName, ws.receiverName);
      if (message.type !== 'image') {
        if (client != ws && client.senderName == ws.receiverName) {
          client.send(
            JSON.stringify({
              name: ws.senderName,
              data: message.data,
            })
          );
        }
      }
      if (message.type === 'image') {
        if (client != ws && client.senderName == ws.receiverName) {
          client.send(
            JSON.stringify({
              name: ws.senderName,
              data: message.data,
              type: 'image',
            })
          );
        }
      }
    });
  });
});
