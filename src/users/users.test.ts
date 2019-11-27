import 'jest'
import * as request from 'supertest'
import { environment } from "../common/environment";
import { Server } from "../server/server";
import { usersRouter } from "../users/users.router";
import { User } from "../users/users.model";

let address: string  = (<any>global).adress


test('GET /users', () => {
    return request(address)
    .get('/users')
    .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('POST /users', () => {
    return request(address)
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

test('GET /users/aaaaa - not found', () => {
    return request(address)
    .get('/users/aaaaa')
    .then(res => {
        expect(res.status).toBe(404)
    }).catch(fail)
})

test('PATCH /user/:id', () => {
    return request(address)
    .post('/users')
    .send({
        name: 'usuario2',
        email: 'usuario2@email.com',
        password: '123543'
    })
    .then(res => {
       return request(address)
        .patch(`/users/${res.body._id}`)
        .send({
            name: 'usuario2 - patch'
        })
    .then(res => {
        expect(res.body.name).toBe('usuario2 - patch')
    })
    }).catch(fail)
})
