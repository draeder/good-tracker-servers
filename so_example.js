const Main = require('./so_main')

let opts = {
    cool: "stuff"
}

let main = new Main(opts)

main.on("stuff", data => console.log(data))
main.stuff("whatever")