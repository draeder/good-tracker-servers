# tracker-servers
Builds a list of verified working webtorrent tracker servers and adds them as a TXT record for a specified subdomain hosted by Cloudflare.

Uses (trackerslist)[https://github.com/ngosang/trackerslist] to poll known webtorrent tracker servers, confirm they are working, then add them to a hosted Cloudflare domain's DNS as a TXT record for a provided subdomain; otherwise drop them from DNS if they are no longer working.

# Install
```

```

# Usage

## cloudflare
```
let cloudflare = {
    zone: 'abc123', // zone ID
    auth: 'abc123', // auth key
    subdomain: 'ws' // subdomain to use for added CNAME records
}
```

## opts
```
let opts = {
    infohash: 'abc123', // infohash to announce, find
    interval: 30, // minutes
    attempts: 1, // number of attempts before dropping record
}
```

# Retrieve and use the records
To use the stored records, query the TXT records for the domain. This can be done on the server and on the browser.

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
Browsers do not have the ability to query DNS by default, so we use the (DoHjs)[https://github.com/byu-imaal/dohjs] library which allows us to use DNS over HTTPS for queries from the browser.

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
A working demo is running for the domain `trackers.peer.ooo` which can be used now in your webtorrent projects.
