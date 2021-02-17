## :construction: This is a work in progress . . . 

# tracker-servers
Tests, then returns an array of working tracker servers (HTTP, HTTPS, WS, WSS) from [trackerslist](https://github.com/ngosang/trackerslist), then optionally adds them to a specified DNS TXT record for a domain hosted by cloudlfare.

After the initial test, tracker-servers will periodically re-test the list of known-good tracker servers based on the interval specified in `opts`.

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
    dns: true, // add record to dns using cloudflare. Must pass in the cloudflare object when true. [default = false]
    cloudflare: 
    {
        zone: 'abc123', // zone ID
        email: 'someone@example.com', // email address
        auth: 'abc123', // auth key
        subdomain: 'ws' // subdomain to use for added/updated record
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
To use the records stored in DNS, query the TXT records for the domain. This can be done on the server and on the browser.

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
