module.exports = TrackerServers

// Constants
var ping = require('ping');
const fetch = require('node-fetch')
const crypto = require('crypto')
const { FakeBitTorrentClient } = require('fake-bittorrent-client')

// Emitter
const EventEmitter = require('events').EventEmitter;
const util = require('util');

// Global variables

function TrackerServers(opts){
    EventEmitter.call(this)
    this.opts = opts
}

util.inherits(TrackerServers, EventEmitter)

TrackerServers.prototype.start = async function(event) { 
    ts = this
    opts = this.opts
    getTrackers(ts, opts)
    setInterval(()=>{
        getTrackers(ts, opts)
    }, opts.interval*60*1000)
}

// get list of trackers from trackerlist
function getTrackers(ts){
    let trackers = []
    let unfiltered = []
    let alive = []
    let dead = []
    let good = []
    let bad = []

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
    function process(data, protocol){
        let lines = data.split("\n")
        lines.filter(function(item){
            if(item != ''){
                let url = new URL(item)
                let protocol
                if(url.protocol == 'ws:' || url.protocol == 'wss:'){
                    if(url.protocol == 'ws:') protocol = 'http:'
                    if(url.protocol == 'wss:') protocol = 'https:'
                } else {
                    protocol = url.protocol
                }
                trackers.push({original: item, test: protocol + '//' + url.host + url.pathname })
            }
        })
    }
    Promise.all([p1, p2, p3]).then(() => {
        unfiltered = trackers
        testTrackers(unfiltered)
    })
    let c = 0
    function testTrackers(unfiltered){
        // ping hosts and remove non-responsive
        var cfg = {
            timeout: 0.01
        }
    
        unfiltered.forEach(function(host){
            let url = new URL(host.test)
            ping.sys.probe(url.host, function(isAlive){
                c++
                let percent = Math.round((c/unfiltered.length)*100)
                var msg = isAlive ? 'host ' + host.test + ' is alive' : 'host ' + host.test + ' is dead'
    
                //console.clear()
                //console.log(`Pinging tracker ${c}/${unfiltered.length} (${percent}% complete) - ${msg}`)
                
                if(isAlive){
                    alive.push({original: host.original, test: host.test})
                }
                if(!isAlive){
                    dead.push({original: host.original, test: host.test})
                }
                if(c == unfiltered.length){
                    //console.clear()
                    //console.log("Found", alive.length, "alive trackers.")
                    //console.log("Found", dead.length, "dead trackers.")
                    testTrackers(alive)
                }
            })
        }, cfg)
    
        function testTrackers(alive){
    
            let infoHash = function(){
                return crypto.createHash('sha1').update(JSON.stringify(Math.random())).digest('hex')
            }
            alive.forEach(tracker => {
                let hash = infoHash()
                let peerId = infoHash()
            
                const trackerUrl = tracker.test
                const torrentHash = hash
                const options = {
                    peerId: peerId,
                    timeout: 30000
                };
                
                const client = new FakeBitTorrentClient(trackerUrl, torrentHash, options);
                
                const bytes = 1024
            
                client
                    .upload(bytes)
                    .then(() => {
                        good.push(tracker.original)
                        counter()
                    })
                    .catch(err => {
                        bad.push(tracker.original)
                        counter()
                    })
    
                client
                    .download(bytes)
                    .then(() => {
                        good.push(tracker.original)
                        counter()
                    })
                    .catch(err => {
                        bad.push(tracker.original)
                        counter()
                    })
            })
        }
    }
    let cc = 0
    function counter(){
        //console.log((dead.length + alive.length), unfiltered.length)
        let ccc = Math.floor(cc/2)
        //console.clear()
        //console.log("Tested", cc, alive[ccc])
        if(cc+1 === alive.length*2){
            good = good.filter( ( el ) => !bad.includes( el ) );
            good = [... new Set(good)]
            bad = [... new Set(bad)]
            //console.clear()
            //console.log("Good:",good.length, good)
            //console.log("Bad:",bad.length, bad)
            ts.emit("trackers", good)
        }
        cc++
    }
}