const dns = require('dns')

/*
let trackers = []

let resolve = dns.resolveTxt('trackers.peer.ooo', function (err, addresses, family) {
    addresses.forEach(element => {
        element.forEach(el => {
            trackers.push(el)
        })
    })
    console.log(trackers)
    // do something with the array of trackers
    // perhaps pass into a webtorrent script to announce a new webtorrent or infohash
})
*/
// testing module
let TS = require('./server')

let opts = 
{
    interval: 3, // minutes [default = 3]
    trackerslist: false, // get trackers to check from trackerslist [default = true]. If set to false, use custom list specified by `check` parameter
    recheck: false, // always recheck the trackers from trackerslist [default = false]
    ignores: // array of trackers to ignore
    [
        'wss://video.blender.org/tracker/socket',
        'wss://peertube.cpy.re/tracker/socket',
    ],
    check: // array of additional trackers to check. Required if `trackerslist` is set to false.
    [

    ],
    dns: true, // add record to dns using cloudflare. Must pass in the cloudflare object when true. [default = false]
    cloudflare: // optional cloudflare object. Required when dns = true
    {
        zone: 'abc123', // zone ID
        email: 'someone@example.com', // email address
        auth: 'abc123', // auth key
        subdomain: 'trackers' // subdomain to use for added/updated record
    },
}

let ts = new TS(opts)

ts.on('results', data => console.log(data))

ts.on('trackers', data => console.log(data))
ts.trackers('trackers')

ts.on('status', data => {
    console.clear()
    console.log(data)
})