# tracker-servers
Builds a list of verified working tracker servers and adds them as CNAMES to a specified subdomain hosted by Cloudflare.

Uses [trackerslist](https://github.com/ngosang/trackerslist) to poll known tracker servers to confirm they are working, then add them to a hosted Cloudflare domain's DNS as CNAME records for a provided subdomain; otherwise drop them if they are not working.

# Install

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
