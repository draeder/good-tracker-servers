module.exports = TrackerServers

const fetch = require('node-fetch')
const Client = require('bittorrent-tracker')
const wrtc = require('wrtc')

// Emitter
const EventEmitter = require('events').EventEmitter;
const util = require('util');

function TrackerServers (){
    EventEmitter.call(this)
}

util.inherits(TrackerServers, EventEmitter)

TrackerServers.prototype.trackers = async function (event, opts, hash) { 
    if(event === 'get'){
        poll()
        // emit updatded trackers
    }
    if(event === 'poll'){
        // poll known trackers
    }
}

poll()
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
        console.log(data)
        let lines = data.split("\n")
        let trackers = {}
        test('wss://ws.peer.ooo', 443)
        lines.forEach(element => {
            if(element !== ''){
                let url = new URL(element)
                //console.log(url)

                let port = url.port
                let host = url.protocol + "//" + url.hostname
                //console.log(port)
                if(!url.port && url.protocol === 'ws') {
                    port = '80'
                    //trackers.push(url.protocol + ":" + url.hostname + ":" + url.port)
                    //test(host, port)
                } else 
                if (!url.port && url.protocol === 'wss') {
                    port = '443'
                    //trackers.push(url.protocol + ":" + url.hostname)
                    //test(host, port)
                } else {
                    //test(host, port)
                }
            }
        })
        //console.log(trackers)

        /*
        let trackers = []
        let lines = data.split("\n")
        lines.forEach(element => {
            if(element !== ''){
                let cleaned = element.split('/')
                let port = element.split(':')
                console.log(port)
                let built = cleaned[0] + '//' + cleaned[2]
                trackers.push(built)
            }
        })
        console.log(trackers)
        */
       //test(trackers)
    })
}

function test(tracker, port){
    // test trackers
    console.log(port)
    var requiredOpts = {
      infoHash: new Buffer.from('Test 1243'), // hex string or Buffer
      peerId: new Buffer.from('Test 5265'), // hex string or Buffer
      announce: [tracker], // list of tracker server urls
      port: port // torrent client port, (in browser, optional)
    }

    var optionalOpts = {
        getAnnounceOpts: function () {
          // Provide a callback that will be called whenever announce() is called
          // internally (on timer), or by the user
          return {
            uploaded: 0,
            downloaded: 0,
            left: 0,
            customParam: 'blah' // custom parameters supported
          }
        },
        // RTCPeerConnection config object (only used in browser)
        rtcConfig: {},
        // User-Agent header for http requests
        userAgent: '',
        // Custom webrtc impl, useful in node to specify [wrtc](https://npmjs.com/package/wrtc)
        wrtc: {},
    }

    
    var client = new Client(requiredOpts)
    
    client.on('error', function (err) {
      // fatal client error!
      console.log(err.message)
    })
    
    client.on('warning', function (err) {
      // a tracker was unavailable or sent bad data to the client. you can probably ignore it
      console.log(err.message)
    })
    
    // start getting peers from the tracker
    client.start()
    
    client.on('update', function (data) {
      console.log('got an announce response from tracker: ' + data.announce)
      console.log('number of seeders in the swarm: ' + data.complete)
      console.log('number of leechers in the swarm: ' + data.incomplete)
    })
    
    client.once('peer', function (addr) {
      console.log('found a peer: ' + addr) // 85.10.239.191:48623
    })
    
    // announce that download has completed (and you are now a seeder)
    client.complete()
    
    // force a tracker announce. will trigger more 'update' events and maybe more 'peer' events
    client.update()
    
    // provide parameters to the tracker
    client.update({
      uploaded: 0,
      downloaded: 0,
      left: 0,
      customParam: 'blah' // custom parameters supported
    })
    
    // stop getting peers from the tracker, gracefully leave the swarm
    client.stop()
    
    // ungracefully leave the swarm (without sending final 'stop' message)
    client.destroy()
    
    // scrape
    client.scrape()
    
    client.on('scrape', function (data) {
      console.log('got a scrape response from tracker: ' + data.announce)
      console.log('number of seeders in the swarm: ' + data.complete)
      console.log('number of leechers in the swarm: ' + data.incomplete)
      console.log('number of total downloads of this torrent: ' + data.downloaded)
    })
}

function add(){
    // add trackers
}

function remove() {
    // remove trackers
}