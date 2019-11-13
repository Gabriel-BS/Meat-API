import * as restify from 'restify'

const server = restify.createServer({
    name: 'meat-api',
    version: '1.0.0'
})

server.use(restify.plugins.queryParser())

/**
 * @param resp 
 * it represents the response and the information it carries with itself like
 * contentType
 * 
 * @param req
 * it represents the requisiton and the information of that requisiton, method used,
 * parameters of it is an GET method for example 
 * 
 * @param next
 * Calling next() will move to the next function in the chain.
 * if you need to stop processing some request you can use return next(false)
 */
server.get('/info', [(req, resp, next) => {
    if(req.userAgent().includes('Mozilla/5.0')){
        resp.json({message: 'you are using Mozilla'})
        return next(false)
    }
    return next()
}, (req, resp, next) => {
    // resp.status(400)
    // resp.contentType = 'application/json';
    // resp.send({x: 1})
    resp.json({
        browser: req.userAgent(),
        method: req.method,
        url: req.href(),
        path: req.path(),
        query: req.query
    })
    return next()
}])

server.listen(3000, () => {
    console.log('API is running on http://localhost:3000')
})