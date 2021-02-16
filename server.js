module.exports = TrackerServers

const fetch = require('node-fetch')
const crypto = require('crypto')
const { FakeBitTorrentClient } = require('fake-bittorrent-client')

// Emitter
const EventEmitter = require('events').EventEmitter;
const util = require('util');

function TrackerServers (){
    EventEmitter.call(this)
}

util.inherits(TrackerServers, EventEmitter)

TrackerServers.prototype.trackers = async function (event, opts, hash) { 
    if(event === 'get'){
        //poll()
        // emit updatded trackers
    }
    if(event === 'poll'){
        // poll known trackers
    }
}

poll()
let trackers = []
let servers = []
function poll(){
    // poll trackers
    fetch(`https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all_ws.txt`, {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization"
        }
    })
    .then(async res => {
        let data = await res.text()
        //console.log(data)
        let lines = data.split("\n")
        servers = lines.filter(function(item){
            return item !== '';
        })
        console.log("Servers:", servers.length)

        servers.forEach(element => {
            let url = new URL(element)
            //console.log(url)
            
            let port = url.port
            let host = httper(element)
            test(host)
        })
        
        //test(trackers)
        console.log(trackers)
        length = trackers.length
    })
}
let count = 0
function test(tracker){
    //console.log(tracker)

    let infoHash = function(){
        return crypto.createHash('sha1').update(JSON.stringify(Math.random())).digest('hex')
    }
    let hash = infoHash()
    let peerId = infoHash()

    const trackerUrl = tracker
    const torrentHash = hash
    const options = {
        peerId: peerId,
        port: 31452 // Listen port ( for fake, API will never open a port )
    };
    
    const client = new FakeBitTorrentClient(trackerUrl, torrentHash, options);
    
    const bytes = 1024
    
    client
        .upload(bytes)
        .then(() => {
            //console.log(['Uploaded ', bytes, ' bytes to ', trackerUrl].join(''))
            //console.log("Good deal",wser(trackerUrl))
            insert(wser(trackerUrl))
            counter()
        })
        .catch(err => {
            console.log(trackerUrl, "Upload Failed", err)
            //console.error(['Error : ', err].join(''))
            remove(wser(trackerUrl))
            counter()
        })

    client
        .download(bytes)
        .then(() => {
            //console.log(['Downloaded ', bytes, ' bytes from ', trackerUrl].join(''))
            //console.log("Good deal",wser(trackerUrl))
            insert(wser(trackerUrl))
            counter()
        })
        .catch(err => {
            console.log(trackerUrl, "Download Failed", err)
            remove(wser(trackerUrl))
            //console.error(['Error : ', err].join(''))
            counter()
        })
}

function counter(){
    count++
    let percent = Math.round(((count/2)/servers.length)*100)
    console.clear()
    console.log("Testing trackers:", Math.round(((count/2)/servers.length)*100) + "% complete")
    if(percent == 100){
        console.log("Removed", servers.length - trackers.length, "trackers")
        console.log(trackers)
    }
}
function wser(uri){
    let host
    let url = new URL(uri)
    if(url.protocol == 'http:'){
        host = "ws://"+url.host+url.pathname
    }
    if(url.protocol == 'https:'){
        host = "wss://"+url.host+url.pathname
    }
    return host
}
function httper(uri){
    let host
    let url = new URL(uri)
    if(url.protocol == 'ws:'){
        host = "http://"+url.host+url.pathname
    }
    if(url.protocol == 'wss:'){
        host = "https://"+url.host+url.pathname
    }
    return host
}

function insert(element){
    trackers.push(element)
    trackers = [...new Set(trackers)]
    //console.log(trackers)
}
function remove(element) {
    // remove trackers
    trackers.filter(x => x !== element)
    trackers = [...new Set(trackers)]
    //console.log(trackers)
}