var inquirer = require("inquirer");
var mysql=require("mysql");
var connection=mysql.createConnection({
    host:"localhost",
    port:"8889",
    user:"root",
    password:"root",
    database:"bamazon"
});

function displayItems() {
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

function updateItems() {
    inquirer.prompt([
        {
        type: "input",
        name: "id",
        message : "Enter the ID of the item you would like to restock",
        },
        {
        type: "input",
        name: "quantity",
        message: "How many would you like to add?"
        }
    ])
    .then(function(response) {
        addItem = response.id;
        addQuantity = parseInt(response.quantity)
        addToInventory(addItem, addQuantity)
    }
    )
}

    function addToInventory(addItem, addQuantity) {
        connection.query("SELECT * FROM products WHERE item_id = " + addItem, function(error, res){
            if(error) {
                console.log(error)
            } else {
                console.log(addQuantity)
                var quantity = parseInt(res[0].stock_quantity) + parseInt(addQuantity);
                connection.query("UPDATE products SET stock_quantity = " + quantity + " WHERE item_id = " + addItem)
                console.log("You have successfully restock this item!")
            }
        }) 
                
            
       
    }
    


function options() {
    inquirer.prompt([
        {
        type: "list",
        name: "options",
        message : "What would you like to do?",
        choices : ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ])
    .then(function(response) {
        console.log(response.options)
        if (response.options == "View Products for Sale") {
            connection.connect(function(error){
                if(error) {
                    console.log(error)
                } else {
                    console.log("You have successfully connected!");
                    displayItems()
                }
            });
        } else if (response.options == "View Low Inventory"){
            connection.query("SELECT * FROM products WHERE stock_quantity<=15", function(error, res){
                if(error) {
                    console.log(error)
                } else {
                   for (let i = 0; i < res.length; i++) {
                       console.log("These items are running low: \nItem ID: " + res[i].item_id + "|| Product: " + res[i].product_name + "|| Quantity: " + res[i].stock_quantity);
                       console.log("-------")
                   }
                }
            }) 
        } else if (response.options == "Add to Inventory"){
            updateItems();
            displayItems();
        } else if (response.options == "Add New Product"){
            // do a bunch of code here
        }
        })

}

options()

