## :construction: This is a work in progress . . . 

# tracker-servers
Tests, then emits an array of working tracker servers (HTTP, HTTPS, WS, WSS) from [trackerslist](https://github.com/ngosang/trackerslist). 

Optionally adds the array of working tracker servers to a specified DNS TXT record for a domain hosted by Cloudlfare. Since Cloudflare will not proxy signalling servers, TXT records are a great way to still make them available through DNS to clients.

After the initial test, tracker-servers will periodically re-test the list of known-good tracker servers based on the interval specified in `opts`.

## How tracker testing works
- Retrieves all HTTP, HTTPS, WS, and WSS trackers from [trackerslist](https://github.com/ngosang/trackerslist), and any trackers passed in via `check` in the `opts` object.
- Pings the host address of each tracker and removes dead hosts
- Attempts to send a fake torrent upload, followed by a fake torrent download to each tracker. If either upload or download fails, the tracker is added to the `ignored` array and emitted
- Finally, Successful trackers are added to the `trackers` array and emitted

# Install
```

```

# Usage
```

```

## opts
```
let opts = {
    interval: 3, // minutes [default = 3]
    cons: true, // show status and results in the console [default = true]
    dns: true, // add record to dns using cloudflare. Must pass in the cloudflare object when true. [default = false]
    cloudflare: // optional cloudflare object. Required when dns = true
    {
        zone: 'abc123', // zone ID
        email: 'someone@example.com', // email address
        auth: 'abc123', // auth key
        subdomain: 'trackers' // subdomain to use for added/updated record
    },
    ignore: // array of trackers to ignore
    [
        'wss://video.blender.org/tracker/socket',
        'wss://peertube.cpy.re/tracker/socket'
    ],
    check: // array of additional trackers to check
    [
        'https://ws.peer.ooo,
        'http://ws.peer.ooo,
        'wss://ws.peer.ooo',
        'ws://ws.peer.ooo'
    ]
}
```

# Example
```
```

# Retrieve the records from DNS
To use the records stored in DNS, query the TXT records for the domain. This can be performed by the server or the browser:

## Server
```
const dns = require('dns')

let trackers = []

let resolve = dns.resolveTxt('trackers.peer.ooo', function (err, addresses, family) {
    addresses.forEach(element => {
        element.forEach(el => {
            trackers.push(el)
        })
    })
    console.log(trackers)
    // do something with the trackers array
    // perhaps pass into a webtorrent script to announce a new webtorrent or infohash
})
```

## Browser
Browsers do not have the ability to query DNS by default, so we use the [DoHjs](https://github.com/byu-imaal/dohjs) library which allows us to use DNS over HTTPS for queries from the browser.

```
<script src="https://cdn.jsdelivr.net/npm/dohjs@latest/dist/doh.min.js"></script>
<script>

const resolver = new doh.DohResolver('https://1.1.1.1/dns-query')

let trackers = []
resolver.query('trackers.peer.ooo', 'TXT')
  .then(response => {
    response.answers.forEach(ans => {
        trackers.push(ans.data)
    })
    console.log(trackers)
    // do something with the trackers array
    // perhaps pass into a webtorrent script to fetch a webtorrent or infohash
  })
  .catch(err => console.error(err))
</script>
```

## Demo
A working demo is running for the domain `trackers.peer.ooo` which can be tested in your webtorrent projects with the above server and browser code.
