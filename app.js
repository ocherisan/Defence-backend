const express = require('express');
const config = require('config');
const mongoose = require('mongoose');


const PORT = config.get("port") || 5000;

const app = express();

app.use('/api/auth',require('./routes/auth.routes'))

async function start(){
    try{
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(PORT, ()=>{console.log(`App has been started on port ${PORT}`)});
    }
    catch (e){
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start();

//db.createUser({user:"admin",pwd:"131281",roles:[{role:"clusterAdmin",db:"admin"},{role:"readAnyDatabase",db:"admin"},"readWrite"]},{w:"majority",wtimeout:5000})
