import { Server } from "./src/server/server";
import { usersRouter } from "./src/users/users.router";


const server = new Server()
server.boostrap([usersRouter]).then(server => {
    console.log('Server is listeling on', server.application.address())
}).catch((error => {
    console.log('Server failed to start')
    console.error(error)
    process.exit(1)
}))
