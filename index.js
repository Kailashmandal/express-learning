const express= require('express');
// requring express in file
const fs= require('fs');

const app=express(); // storing express in app

// port , host specifying for our servere
const port=  8000 || process.env.PORT;
const host = '127.0.0.1' || '0.0.0.0';

// get is method used for sending response and accepting only get requstes
// means when a get request is accepted  than only this response is send with matching url
app.get('/' , (req, res)=>{
    res
    .status(200)
    .json({
        message : 'hye from express server !!' ,
        app : 'express server',
        content_type : 'json'
    });
    // sending the json type data to server
});


// making post request response method
app.post('/' , (req , res)=>{
    res
    .status(200)
    .json({
        method:'post',
        urlPath:'/',
        message: ' this is response for post method'
    })
       
});

// started listening on the port 8000
app.listen(port ,host, ()=>{
    console.log('App is runing on port ', port);
});