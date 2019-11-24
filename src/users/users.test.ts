import 'jest'
import * as request from 'supertest'
import { environment } from "../common/environment";
import { Server } from "../server/server";
import { usersRouter } from "../users/users.router";
import { User } from "../users/users.model";

let server: Server

beforeAll(() => {
    environment.db.name = 'meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001
    server = new Server()
    server.boostrap
})

test('GET /users', () => {
    return request('http://localhost:3000')
        .get('/users')
        .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('POST /users', () => {
    return request('http://localhost:3000')
    .post('/users')
    .send({
        name: 'usuario1',
        email: 'usuario1@email.com',
        password: '123543'
    })
    .then(res => {
        expect(res.status).toBe(200)
        expect(res.body._id).toBeDefined()
        expect(res.body.name).toBe('usuario1')
        expect(res.body.email).toBe('usuario1@email.com')
        expect(res.body.password).toBeUndefined()
    }).catch(fail)
})