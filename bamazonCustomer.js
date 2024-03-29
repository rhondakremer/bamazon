require('dotenv').config()

var inquirer = require("inquirer");
var mysql=require("mysql2");
var connection=mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "bamazon",
});

function showProducts() {
    connection.connect(function(error){
    if(error) {
        console.log(error)
    } else {
        //console.log("You have successfully connected!");
        connection.query("SELECT * FROM products", function(error, res){
            if(error) {
                console.log(error)
            } else {

                
               for (let i = 0; i < res.length; i++) {

                   console.log("Item ID: " + res[i].item_id + "|| Product: " + res[i].product_name + "|| Price: $" + res[i].price);
                   console.log("-------")
                   
               }
               purchasePrompt();
            }
        }) 
    }
});
}


function purchasePrompt() {
    inquirer.prompt([
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
        requestedQuantity = parseInt(response.quantity)
        makePurchase(requestedItem, requestedQuantity)
    }
    )

function makePurchase(requestedItem, requestedQuantity) {
    connection.query("SELECT * FROM products where item_id=" + requestedItem, function(error, res){
            if(error) {
                console.log(error)
            } else {
                if (res.length == 0) {
                    console.log("Please pick a valid item number!")
                    purchasePrompt()
                }
               for (let i = 0; i < res.length; i++) {
                   //console.log(res)
                   var amountAvailable = parseInt(res[i].stock_quantity);
                   //console.log(amountAvailable)
                   //console.log(requestedQuantity)
                   if (amountAvailable < requestedQuantity){
                    console.log("Sorry! Insufficient quantity!")
                    purchasePrompt()
                   } else {
                       amountAvailable -= requestedQuantity;
                       //console.log(amountAvailable)
                       var cost = res[i].price * requestedQuantity;
                       connection.query("UPDATE products SET stock_quantity = " + amountAvailable + " WHERE item_id = " + requestedItem);
                       console.log("You have purchased " + requestedQuantity + " " + res[i].product_name + "(s) for $" + cost + "! Thank you for your purchase.")
                       purchaseAnother();
                   }
               }
            }
        }) 
   
    }
}

function purchaseAnother() {
    inquirer.prompt([
        {
        type: "list",
        name: "another",
        message : "Would you like to purchase another item?",
        choices : ["yes", "no"]
        }
    ])
    .then(function(response) {
        //console.log(response.another)
        if (response.another == "yes") {
            connection.query("SELECT * FROM products", function(error, res){
                if(error) {
                    console.log(error)
                } else {
    
                   for (let i = 0; i < res.length; i++) {
    
                       console.log("Item ID: " + res[i].item_id + "|| Product: " + res[i].product_name + "|| Price: $" + res[i].price);
                       console.log("-------")
                       
                   }
                   purchasePrompt();
                }
            }) 
            
        } else {
            console.log("Have a great day and come back soon!")
            connection.end();
        }
    })
}


showProducts()