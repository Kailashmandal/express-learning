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

/**
 * handling parameters here :
 * 
 *  suppose we have an extra parametere in the url 
 *  '/api/v1/tours/5' 5 is a parameter here than we hav to handle it
 *  by specifying an variable in the the route like -  /:var-name1/: var-name2/: var-name3
 * 
 * we can also have optional parameters : i.e it not need to be passed in url
 * 
 * for exmaple if url: 127.0.0.1:8000/api/v1/tours/5/6 <- two parameters is here but we int
 *  the route we can make it optional to fetch the url parameter by adding a question mark after 
 *  the parameter name or var-name for example -> app.get('/api/v1/tours/:id/:x?/:y?' ,(req, res)=>{})
 *   in this example x and y are optional which means that if user do not add params than 
 *  no error will be thrown.
 */


// app.get('/api/v1/tours/:id/:x/:y?', (req ,res)=>{
//     console.log(req.params);
//     // params is request property that contains the parameters in it of type object
//     res.status(200).json({
//         status : 'success',
        
//     })
//  });
 
app.get('/api/v1/tours/:id' , (req, res)=>{
    console.log(req.params);
     // id is string now but we have to convert it into the integer by multiplying *1
    const id = req.params.id * 1; 

    if(id > tours.length){
        // if id specified in the url is greater than the length of tuors array than this is invalid parameter
       return res.status(404).json({
            status : 'Fail',
            message : 'Invalid ID'
        })
    }
    
    /**
     *  find function in javascirpt return the value of 1st value in the provided array
     *  that matches the conditions provided in testing function.
     *  if no match is found than undefined is returned.
     * example : -
     *  var requiredElment = array.find( callback function )
     */
    const tour= tours.find(element => element.id=== id);

    res
    .status(200)
    .json({
        status : 'success',
        tour:tour
    })


})

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