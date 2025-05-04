import authRoutes from '../routes/auth.routes.js'


const routes = ((app)=>{
    app.get('/',(req, res)=>{res.status(200).send({message : 'Welcome To APP'})})
    app.use('/api/v1/auth',authRoutes)

    // app.get('*',(req, res)=>{res.status(400).send({message : 'Route You are Looking for not exists'})})
})


export default routes;