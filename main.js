"use strict";
exports.__esModule = true;
var server_1 = require("./dist/server/server");
var users_router_1 = require("./dist/users/users.router");
var server = new server_1.Server();
server.boostrap([users_router_1.usersRouter]).then(function (server) {
    console.log('Server is listeling on', server.application.address());
})["catch"]((function (error) {
    console.log('Server failed to start');
    console.error(error);
    process.exit(1);
}));
