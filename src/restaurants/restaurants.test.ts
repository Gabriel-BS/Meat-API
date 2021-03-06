import 'jest'
import * as request from 'supertest'

let address: string  = (<any>global).adress
let auth: string  = (<any>global).auth

test('GET /restaurants', () => {
    return request(address)
    .get('/restaurants')
    .set('Authorization', auth)
    .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('POST /restaurants', () => {
    return request(address)
    .post('/restaurants')
    .set('Authorization', auth)
    .send({
        name: 'restaurant1'
    })
    .then(res => {
        expect(res.status).toBe(200)
        expect(res.body._id).toBeDefined()
        expect(res.body.name).toBe('restaurant1')
    }).catch(fail)
})

test('GET /restaurants/aaaaa - not found', () => {
    return request(address)
    .get('/restaurants/aaaaa')
    .set('Authorization', auth)
    .then(res => {
        expect(res.status).toBe(404)
    }).catch(fail)
})

test('PATCH /restaurants/:id', () => {
    return request(address)
    .post('/restaurants')
    .set('Authorization', auth)
    .send({
        name: 'restaurant2',
    })
    .then(res => {
       return request(address)
        .patch(`/restaurants/${res.body._id}`)
        .set('Authorization', auth)        
        .send({
            name: 'restaurant2 - patch'
        })
    .then(res => {
        expect(res.body.name).toBe('restaurant2 - patch')
    })
    }).catch(fail)
})


test('PUT /restaurants/:id', () => {
    return request(address)
    .post('/restaurants')
    .set('Authorization', auth)
    .send({
        name: 'restaurant3',
    })
    .then(res => {
       return request(address)
        .put(`/restaurants/${res.body._id}`)
        .set('Authorization', auth)
        .send({
            name: 'restaurant3 - PUT'
        })
    .then(res => {
        expect(res.body.name).toContain('restaurant3 - PUT')
    })
    }).catch(fail)
})


test('DELETE /restaurants/:id', () => {
    return request(address)
    .post('/restaurants')
    .set('Authorization', auth)
    .send({
        name: 'restaurant4',
    }).then(res => {
        request(address).delete(`/restaurants/${res.body._id}`)    
        .set('Authorization', auth)
        .then(res => {
            expect(res.status).toBe(204)
        })
    }).catch(fail)
})
