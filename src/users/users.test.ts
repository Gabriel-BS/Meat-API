import 'jest'
import * as request from 'supertest'

let address: string  = (<any>global).adress
let auth: string  = (<any>global).auth


test('GET /users', () => {
    return request(address)
    .get('/users')
    .set('Authorization', auth)
    .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('POST /users', () => {
    return request(address)
    .post('/users')
    .set('Authorization', auth)
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
    .set('Authorization', auth)
    .then(res => {
        expect(res.status).toBe(404)
    }).catch(fail)
})

test('PATCH /user/:id', () => {
    return request(address)
    .post('/users')
    .set('Authorization', auth)
    .send({
        name: 'usuario2',
        email: 'usuario2@email.com',
        password: '123543'
    })
    .then(res => {
       return request(address)
        .patch(`/users/${res.body._id}`)
        .set('Authorization', auth)
        .send({
            name: 'usuario2 - patch'
        })
    .then(res => {
        expect(res.body.name).toBe('usuario2 - patch')
    })
    }).catch(fail)
})


test('PUT /user/:id', () => {
    return request(address)
    .post('/users')
    .set('Authorization', auth)
    .send({
        name: 'usuario6',
        email: 'usuario6@email.com',
        password: '123543'
    })
    .then(res => {
       return request(address)
        .put(`/users/${res.body._id}`)
        .set('Authorization', auth)
        .send({
            name: 'usuario6 - PUT'
        })
    .then(res => {
        expect(res.body.name).toContain('usuario6 - PUT')
    })
    }).catch(fail)
})


test('DELETE /user/:id', () => {
    return request(address)
    .post('/users')
    .set('Authorization', auth)
    .send({
        name: 'usuario4',
        email: 'usuario4@email.com',
        password: 'dasdadsa'
    }).then(res => {
        request(address).delete(`/users/${res.body._id}`)
        .set('Authorization', auth)
        .then(res => {
            expect(res.status).toBe(204)
        })
    }).catch(fail)
})
