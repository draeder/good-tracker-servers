module.exports = TrackerServers

var ping = require('ping');
const fetch = require('node-fetch')
const crypto = require('crypto')
const { FakeBitTorrentClient } = require('fake-bittorrent-client')
const fs = require('fs')

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

let servers = []
let trackers = []
let ignored = []
let testing = []
let alive = []
let count = 0
let finished = false
//poll()
poll()
setInterval(()=>{
    if(finished == true){
        finished = false
        count = 0
        testing.splice(0, testing.length)
        servers.splice(0, servers.length)
        ignored.splice(0, ignored.length)
        alive.splice(0, alive.length)
        poll()
    }
}, 180000)

function poll(){
    if(trackers.length === 0){
        let fetchParams = 
        {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization"
            }
        }
        
        let p1 = fetch(`https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all_ws.txt`, fetchParams)
        .then(async res => {
            let data = await res.text()
            process(data)
        })
        let p2 = fetch(`https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all_https.txt`, fetchParams)
        .then(async res => {
            let data = await res.text()
            process(data)
        })
        let p3 = fetch(`https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all_http.txt`, fetchParams)
        .then(async res => {
            let data = await res.text()
            process(data)
        })
        function process(data){
            let lines = data.split("\n")
            lines.filter(function(item){
                if(item != ''){
                    servers.push(item)
                }
            })
        }
        Promise.all([p1, p2, p3]).then((values) => {
            buildList(servers)
        })
    } else {
        console.log("servers", servers.length)
        console.log("trackers", trackers.length)
        console.log("trackers",trackers)
        buildList(trackers)
    }
}

function buildList(list){

    list.forEach(element => {
        let url = new URL(element)
        testing.push({original: element, ping: url.hostname})
    })

    var cfg = {
        timeout: 0.001
    }

    let c = 0

    testing.forEach(function(host){

        ping.sys.probe(host.ping, function(isAlive){
            c++
            let percent = (c/testing.length)*100
            var msg = isAlive ? 'host ' + host.ping + ' is alive' : 'host ' + host.ping + ' is dead'
            console.clear()
            console.log(`Pinging tracker ${c}/${testing.length} (${percent}% complete) - `,msg)
            
            if(isAlive){
                alive.push(host.original)
            }

            if(c === list.length){
                alive.forEach(element => {
                    let url = new URL(element)            
                    if(url.protocol == "ws:" || url.protocol == "wss:"){
                        host = httper(element)
                    } else {
                        host = element
                    }
                    test(host)
                })

            }
        });
    }, cfg)
}

let perf = {}
let start
function test(tracker){
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
            counter(tracker)
            insert(trackerUrl)
        })
        .catch(err => {
            //console.log(trackerUrl, "Upload Failed", err)
            //console.error(['Error : ', err].join(''))
            counter(tracker)
            remove(trackerUrl)
            ignore(trackerUrl)
        })

    client
        .download(bytes)
        .then(() => {
            //console.log(['Downloaded ', bytes, ' bytes from ', trackerUrl].join(''))
            //console.log("Good deal",wser(trackerUrl))
            counter(tracker)
            insert(trackerUrl)
        })
        .catch(err => {
            //console.log(trackerUrl, "Download Failed", err)
            counter(tracker)
            remove(trackerUrl)
            ignore(trackerUrl)
            //console.error(['Error : ', err].join(''))
        })
        //perf.push({tracker: tracker, perf: t1-t0})
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

function ignore(tracker){
    ignored.push(tracker)
    ignored = [...new Set(ignored)]
}

function counter(tracker){
    count++
    let percent = Math.round(((count/2)/alive.length)*100)
    let i = Math.floor(count/2)
    console.clear()
    console.info(`Testing tracker ${Math.floor(count/2)}/${alive.length} (${percent}% complete): ${alive[i-1]}`)
    if(!alive[i]){
        percent = 100
    }
    if(percent == 100){
        alive.filter(function(item){
            let url = new URL(item)
            if(url.protocol === "ws:"){
                trackers.filter(function(element){
                    let url1 = new URL(element)
                    if(url.host == url1.host){
                        const found = (el) => el === element;
                        let index = trackers.findIndex(found)
                        trackers[index] = item
                    }
                })
            } else
            if(url.protocol === "wss:"){
                trackers.filter(function(element){
                    let url1 = new URL(element)
                    if(url.host == url1.host){
                        const found = (el) => el === element;
                        let index = trackers.findIndex(found)
                        trackers[index] = item
                    }
                })
            }
        })
        trackers = [... new Set(trackers)]
        
        console.clear()
        console.log(percent + "% complete")
        console.log("Found", trackers.length, "working trackers")
        console.log("Ignoring", ignored.length, "non-working trackers")
        console.log(trackers)
        finished = true
    }
}