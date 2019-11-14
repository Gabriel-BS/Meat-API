import { Server } from "./server/server";

const server = new Server()
server.boostrap().then(server => {
    console.log('Server is listeling on', server.application.address())
}).catch((error => {
    console.log('Server failed to start')
    console.error(error)
    process.exit(1)
}))
