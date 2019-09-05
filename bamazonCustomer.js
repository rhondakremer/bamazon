var inquirer = require("inquirer");
var mysql=require("mysql");
var connection=mysql.createConnection({
    host:"localhost",
    port:"8889",
    user:"root",
    password:"root",
    database:"bamazon"
});

connection.connect(function(error){
    if(error) {
        console.log(error)
    } else {
        console.log("You have successfully connected!");
        //var artist = process.argv.slice(2).join(" ");
        //console.log(artist);
        connection.query("SELECT * FROM products", function(error, res){
            if(error) {
                console.log(error)
            } else {

                
               for (let i = 0; i < res.length; i++) {

                   console.log("Item ID: " + res[i].item_id + "|| Product: " + res[i].product_name + "|| Price: $" + res[i].price);
                   console.log("-------")
                   
               }
            }
        }) 
    }
});




inquirer
    .prompt([
        {
        type: "input",
        name: "id",
        message : "Pick enter the ID of the item you would like to purchase",
        },
        {
        type: "input",
        name: "quantity",
        message: "How many would you like to purchase?"
        }
    ])
    .then(function(response) {
        requestedItem = response.id;
        requestedQuantity = response.quantity
        console.log(requestedItem, requestedQuantity)
    }
    )

  