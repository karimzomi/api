const Express = require("express");
const app = Express();
const accountRouter = require('./router/user')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({ path: './.env' })
const PORT = process.env.PORT || 8080
const MongoDB_URL = process.env.MongoDB_URL

//connecting to database
mongoose
    .connect(MongoDB_URL, { useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => console.log('Connection to data base established succesfully !'))
    .catch ((err) => console.log('Connection to data base went wrong'));

app.use(Express.json())

app.use('/account',accountRouter)
app.listen(PORT,()=>{
    console.log(`💻 server is running : http://localhost:${PORT}`);
})

