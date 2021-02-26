//http://tracker4.itzmx.com:2710/announce
const { FakeBitTorrentClient } = require('fake-bittorrent-client')
const crypto = require('crypto')

let infoHash = function(){
    return crypto.createHash('sha1').update(JSON.stringify(Math.random())).digest('hex')
}
let hash = infoHash()
let peerId = infoHash()

const trackerUrl = "http://tracker.skyts.net:6969/announce"//
const torrentHash = hash
const options = {
    peerId: peerId,
    port: 31452, // Listen port ( for fake, API will never open a port )
    timeout: 1000
};

const client = new FakeBitTorrentClient(trackerUrl, torrentHash, options);

const bytes = 1024

client
    .upload(bytes)
    .then(() => {
        console.log(['Uploaded ', bytes, ' bytes to ', trackerUrl].join(''))
    })
    .catch(err => {
        console.log(trackerUrl, "Upload Failed", err)
        console.error(['Error : ', err].join(''))
    })

client
    .download(bytes)
    .then(() => {
        console.log(['Downloaded ', bytes, ' bytes from ', trackerUrl].join(''))
    })
    .catch(err => {
        console.log(trackerUrl, "Download Failed", err)
        console.error(['Error : ', err].join(''))
    })