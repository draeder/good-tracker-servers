const dns = require('dns')
const TS = require('./server-new')

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

ts.start()

ts.on("trackers", trackers => console.log(new Date().toLocaleTimeString(), trackers))
ts.on("unresponsive", unresponsive => console.log(unresponsive))
ts.on("wss", wss => console.log(wss))
ts.on("ws", ws => console.log(ws))
ts.on("https", https => console.log(https))
ts.on("http", http => console.log(http))