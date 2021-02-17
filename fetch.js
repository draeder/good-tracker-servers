const fetch = require('node-fetch')
const crypto = require('crypto')

let infoHash = function(){
    return crypto.createHash('sha1').update(JSON.stringify(Math.random())).digest('hex')
}
let hash = infoHash()
let peerId = infoHash()

const trackerUrl = "http://ws.peer.ooo/announce"
const torrentHash = hash
const port = 31452
const options = {
    peerId: peerId,
    port: 31452 // Listen port ( for fake, API will never open a port )
};

var url = [
    trackerUrl,
    '?info_hash=',
    torrentHash,
    '&peer_id=',
    peerId,
    '&port=',
    port,
    '&uploaded=',
    1024,
    '&downloaded=',
    1024,
    '&compact=1'
].join('');

console.log(url)

let fetchParams = 
{
    method: 'GET',
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization"
    }
}

let p1 = fetch(url, fetchParams)
.then(async res => {
    let data = await res.text()
    console.log(data)
    /*let lines = data.split("\n")
    lines.filter(function(item){
        if(item != ''){
            servers.push(item)
        }
    })*/

})

Promise.all([p1]).then((values) => {
    //console.log(servers);
});