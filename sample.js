'use strict';

const yelp = require('yelp-fusion');

const express = require("express");

const app = express();

const bodyParser = require("body-parser");





let data ={};


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = 'VKoaTzGZdP6AJfTf6vubDvA0LMDyllv7do26txusFNcD3BX_A1qxC9ZgG0tg2-ZnuARpfIRJuV9Q1CaAJX_zNepBJ2AvyJGnN29tL-gkM6V4vd-q556G_wG5MpbSWnYx';

const searchRequest = {
  term:'Halal',
  location: 'union city, ca'
};

const client = yelp.client(apiKey);




app.get("/", function(req, res){
  res.render("index");
})

app.post("/search", function(req, res){

  

    let food = req.body.food;
    let loc = req.body.city + ", " + req.body.state;

     data = {

      term: food,
      location: loc

    };

  client.search(data).then(function(response){
    
    let results = response.jsonBody.businesses;
     
   
  var filtered_results = filter_prices(results)

    var sorted_results = bestValue(filtered_results)


    for (var i =0; i < sorted_results.length; i++){

      console.log(sorted_results[i].name)

          
          
    }


      res.render("results", {results: sorted_results});

  }).catch(function(err){
  console.log(err);
})

})
  
app.get("/search/reviews/:id", function(req, res){

  
const businessId = req.params.id.substring(1);

//console.log(req.params.id);


 client.reviews(businessId).then(function(response){
 
      const revs = response.jsonBody.reviews;

      //console.log(revs[0].text);


      res.render("reviews.ejs", {revs: revs});
 })
 .catch(function(err){
  console.log(err);
 })

})




function bestValue (results) {

        for(var i = 0; i < results.length; i ++ ) {
               

              

         for (var j = 0; j < results.length -1 -i; j++) {

          console.log(results[j].price)
          console.log(results[j+1].price)
                 

          var weight_first = price_weight(results[j].price)

          var weight_last = price_weight(results[j+1].price)


              if((weight_first + results[j].rating)/2 < (weight_last + results[j+1].rating)/2 ) {
                            
                            const lesserValue = results[j]

                          results[j] = results[j+1]

                          results[j+1] = lesserValue

              }
         }

    
}
  
  return results
 
}


function price_weight (price) {

    if (price.length === 1) return 5

      if(price.length === 2) return 4

        if(price.length === 3) return 3

          if (price.length === 4) return 2

            if(price.length === 5) return 1


}

function filter_prices (results) {
    
    for (let i =0; i < results.length; i++) {

          if(!results[i].price) {

               results.splice(i, 1)
          }
    }

    return results

}

app.listen(process.env.PORT || 5000, function(){

  console.log("Server Running");
})














