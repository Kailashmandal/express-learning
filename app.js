const express= require('express');
// requring express in file
const fs= require('fs');

const app=express(); // storing express in app

// port , host specifying for our servere
const port=  8000 || process.env.PORT;
const host = '127.0.0.1' || '0.0.0.0';

/**
 *  adding a middleware here 
 *  a middleware function that can simpally modify the incomng req data 
 *  
 * for example express.json( ) is a middleware here
 */
app.use(express.json());


/**
 * JSON.parse is method used to parse the json objects into js objects like json array 
 *  will get parsed into js array objects and json objects get parsed into js objects
 *  etc. and etc. 
 */
const tours= JSON.parse(
    fs.readFileSync('./dev-data/data/tours-simple.json' , 'utf-8')
    );

app.get('/' ,(req, res)=>{
    res.status(200).send('welcome to our application.');
})

app.get('/api/v1/tours', (req ,res)=>{
   res.status(200).json({
       status : 'success',
       results : tours.length,
       data : {
           tours : tours
       }
   })
});

// handling post requests
app.post('/api/v1/tours', (req , res)=>{
    // for posting any data req object contains the data
       //console.log(req.body);

  const newId= tours[tours.length -1].id +1 ;
  const newTour = Object.assign( {id : newId} , req.body);
  tours.push(newTour);
  const newTourJson = JSON.stringify(tours);
  
  fs.writeFile('./dev-data/data/tours-simple.json' , newTourJson,(err)=>{
            res
            .status(201)
            .json({
                status : 'success' ,
                data : {
                    tour : newTour
                }
            })
  })
    //    res.send('done');
});

// started listening on the port 8000
app.listen(port ,host, ()=>{
    console.log('server is running at http://127.0.0.1:8000');
});