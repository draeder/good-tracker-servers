const dns = require('dns')

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