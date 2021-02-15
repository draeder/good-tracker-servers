# tracker-servers
Builds a list of verified working webtorrent tracker servers and adds them as CNAMES for a specified subdomain hosted by Cloudflare.

Uses [trackerslist](https://github.com/ngosang/trackerslist) to poll known tracker servers to confirm they are working, then add them to a hosted Cloudflare domain's DNS as CNAME records for a provided subdomain; otherwise drop them if they are no longer working.

# Install
```
npm i tracker-servers
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

## Demo
A working demo is running for the domain `trackers.peer.ooo` which can be used now in your webtorrent projects: e.g. `wss://trackers.peer.ooo`
