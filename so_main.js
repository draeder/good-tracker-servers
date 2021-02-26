module.exports = Main

const EventEmitter = require('events').EventEmitter;
const util = require('util');
let opts

function Main(opts){
    this.opts = opts
    EventEmitter.call(this)
}

util.inherits(Main, EventEmitter)

Main.prototype.stuff = function (event) { 
    opts = this.opts
    console.log(opts)
    let main = this
    if(event){ // how do I use opts here?
        main.emit('stuff', opts.cool)
    }
}