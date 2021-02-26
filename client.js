const { UniversalWebSocket } = require('universal-ws')
const PORT = 3002;
const HOST = `wss://tracker.peer.ooo`;
 
// Connect when instantiating (unless ConnectionOptions.autoConnect is false)
const uws = new UniversalWebSocket(HOST);

uws.on("connected", () => {
    console.log("Connected!")
    uws.sendWithAck('announce', { brakes: { location: 'front-left', strength: 75, hold: true, easeIn: false } }).then(() => {
        console.log('Server successfully received the message "action"');
    }).catch(error => {
        console.log('Server failed to receive the message "action"');
        console.log(error)
    });
})