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

const getAllTours = (req ,res)=>{
    res.status(200).json({
        status : 'success',
        results : tours.length,
        data : {
            tours : tours
        }
    })
 }
 const getTour = (req, res)=>{
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


};

// app.get('/api/v1/tours', getAllTours );

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
 
// app.get('/api/v1/tours/:id' ,getTour );

// handling post requests
const addTour = (req , res)=>{
    // for posting any data req object contains the data
       //console.log(req.body);

  const newId= tours[tours.length -1].id +1 ;
  const newTour = Object.assign( {id : newId} , req.body);
  tours.push(newTour);
  const newTourJson = JSON.stringify(tours);
  
  fs.writeFile('./dev-data/data/tours-simple.json' , newTourJson,(err)=>{
            res
            .status(201)// 201 status code data is send to server successfully
            .json({
                status : 'success' ,
                data : {
                    tour : newTour
                }
            })
  })
    //    res.send('done');
};

// app.post('/api/v1/tours', addTour);

/**
 *  patch request method : used to update only
 *  existing property of the objects like id , duration and name updation
 *  
 *  .patch('url/:parameter-value', (req,res)=>{})
 *  
 *  parameter-value is new value that we want to update. 
 */
const updateTour =  (req , res)=>{
    const id = req.params.id *1;
    if(id > tours.length){
        return res.status(404).json({
            // 404 status code for page not found 
            status : 'Fail',
            meassage : 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
        meassage: '<Data updated sucessfully>'
    }
});
};

// app.patch('/api/v1/tours/:id' ,updateTour);

/**
 * .delete() method handles the data delete request from the user
 *  
 * syntax : app.delete( ' url/: property-name-to-delete' , (req, res)={})
 */
const deleteTour=(req , res)=>{
    const id = req.params.id *1;

    if(id > tours.length){
        return res.status(404).json({
            status: 'Fail',
            message : 'Invalid ID'
        })
    }
    
    // 204 status code specifies that no data should be send in response.
    res.status(204).json({
        status : 'success',
        data : null
    })
};

// app.delete('/api/v1/tours/:id' , deleteTour);

/**
 *  concantenating the methods here with url routes
 */

app.route('/api/v1/tours')
.get(getAllTours)
.post(addTour) ;


app.route('/api/v1/tours/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

// started listening on the port 8000
app.listen(port ,host, ()=>{
    console.log('server is running at http://127.0.0.1:8000');
});