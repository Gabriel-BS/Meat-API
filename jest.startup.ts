import * as jestCli from 'jest-cli'

import "jest";
import { environment } from "./src/common/environment";
import { Server } from "./src/server/server";
import { usersRouter } from "./src/users/users.router";
import { User } from "./src/users/users.model";
import { Review } from "./src/reviews/reviews.model";
import { reviewRouter } from "./src/reviews/reviews.router";
import { restaurantRouter } from "./src/restaurants/restaurants.router";

let server: Server;
let address: string;

const beforeAllTests = () => {
  environment.db.name = "meat-api-test-db";
  environment.server.port = process.env.SERVER_PORT || 3001;
  address = `http://localhost:${environment.server.port}`;
  server = new Server();
  return server
    .boostrap([usersRouter, reviewRouter, restaurantRouter])
    .then(() => User.deleteMany({}).exec())
    .then(() => {
      let admin = new User()
      admin.name = "admin"
      admin.email = "admin@email.com"
      admin.password = "123456",
      admin.profiles = ['admin', 'user']
      return admin.save()
    })
    .then(() => Review.deleteMany({}).exec())
    .catch(console.error);
};

const afterAllTests = () => {
  return server.shutdown().catch(console.error);
};

beforeAllTests()
.then(() => jestCli.run())
.then(() => afterAllTests())
.catch(console.error)
