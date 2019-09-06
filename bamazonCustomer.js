var inquirer = require("inquirer");
var mysql=require("mysql");
var connection=mysql.createConnection({
    host:"localhost",
    port:"8889",
    user:"root",
    password:"root",
    database:"bamazon"
});

function showProducts() {
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
               purchasePrompt();
            }
        }) 
    }
});
}


function purchasePrompt() {
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
        makePurchase(requestedItem, requestedQuantity)
    }
    )

    function makePurchase(requestedItem, requestedQuantity) {
        connection.query("SELECT * FROM products where item_id=" + requestedItem, function(error, res){
            if(error) {
                console.log(error)
            } else {
               for (let i = 0; i < res.length; i++) {
                   var amountAvailable = res[i].stock_quantity;
                   //console.log(amountAvailable)
                   //console.log(requestedQuantity)
                   if (amountAvailable >= requestedQuantity){
                       amountAvailable -= requestedQuantity;
                       //console.log(amountAvailable)
                       connection.query("UPDATE products SET stock_quantity = " + amountAvailable + " WHERE item_id = " + requestedItem);
                       console.log("You have purchased " + requestedQuantity + " " + res[i].product_name + "(s)! Thank you for your purchase.")
                   }
               }
            }
        }) 
   
    }
}
  showProducts()