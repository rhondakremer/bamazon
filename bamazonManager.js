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

connection.connect(function(error){
    if(error) {
        console.log(error)
    } else {
        //console.log("You have successfully connected!");
        
    }
});

function anotherTask() {
    inquirer.prompt([
        {
        type: "list",
        name: "anotherTask",
        message : "Would you like to complete another task?",
        choices: ["yes","no"]
        }
    ])
    .then(function(response) {
        if (response.anotherTask == "no") {
            connection.end()
        } else if (response.anotherTask == "yes") {
            options();
        }
})
}

function displayItems() {
    connection.query("SELECT * FROM products", function(error, res){
        if(error) {
            console.log(error)
        } else {
           for (let i = 0; i < res.length; i++) {
               console.log("Item ID: " + res[i].item_id + "|| Product: " + res[i].product_name + "|| Price: $" + res[i].price + "|| Stock Quantity: " + res[i].stock_quantity);
               console.log("-------")
           } anotherTask()
        }
    }) 
}

function displayItemsForAdd() {
    connection.query("SELECT * FROM products", function(error, res){
        if(error) {
            console.log(error)
        } else {
           for (let i = 0; i < res.length; i++) {
               console.log("Item ID: " + res[i].item_id + "|| Product: " + res[i].product_name + "|| Price: $" + res[i].price + "|| Stock Quantity: " + res[i].stock_quantity);
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
                if (res.length > 0) {
                //console.log(addQuantity)
                var quantity = parseInt(res[0].stock_quantity) + parseInt(addQuantity);
                connection.query("UPDATE products SET stock_quantity = " + quantity + " WHERE item_id = " + addItem)
                console.log("You have successfully restocked this item!");
                anotherTask();
            } else {console.log("Please pick a valid item number!")
            updateItems();
            }}
        })        
    }
    
    function addNewToInventory(newItemName, newItemDepartment, newItemPrice, newItemQuantity) {
        connection.query("INSERT INTO `products`(product_name,department_name,price,stock_quantity) VALUES ('" + newItemName + "','" + newItemDepartment + "'," + newItemPrice + "," + newItemQuantity + ");", function(error, res){
            if(error) {
                console.log(error)
            } else {
                console.log("Your item has been successfully added.")
                anotherTask()
            }
        })        
    }

function addNewItem() {
    inquirer.prompt([
        {
        type: "input",
        name: "newItemName",
        message : "Enter the name of the item you would like to add",
        },
        {
        type: "input",
        name: "newItemDepartment",
        message : "What department does it belong in?",
        },
        {
        type: "input",
        name: "newItemPrice",
        message: "What is the price of this item?"
        },
        {
        type: "input",
        name: "newItemQuantity",
        message: "How many would you like to stock?"
        }
    ])
    .then(function(response) {
        newItemName = response.newItemName;
        newItemDepartment = response.newItemDepartment;
        newItemPrice = parseFloat(response.newItemPrice);
        newItemQuantity = parseInt(response.newItemQuantity)
        //console.log(newItemName,newItemDepartment,newItemPrice,newItemQuantity);
        if (!newItemName){
            console.log("Please enter a valid item!")
            addNewItem()}
        else if (!newItemDepartment) {
            console.log("Please enter a valid department!")
            addNewItem()
        }
        else if (!newItemPrice) {
            console.log("Please enter a valid price!")
            addNewItem()
        
        } else if (!newItemQuantity) {
        console.log("Please enter a valid quantity!")
            addNewItem()
        } else {
            addNewToInventory(newItemName, newItemDepartment, newItemPrice, newItemQuantity);
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
            displayItems();
        } else if (response.options == "View Low Inventory"){
            connection.query("SELECT * FROM products WHERE stock_quantity<5", function(error, res){
                if(error) {
                    console.log(error)
                } else {
                    console.log("These items are running low: ")
                   for (let i = 0; i < res.length; i++) {
                       console.log("\nItem ID: " + res[i].item_id + "|| Product: " + res[i].product_name + "|| Quantity: " + res[i].stock_quantity);
                       console.log("-------")
                   } anotherTask()
                } 
            }) 
        } else if (response.options == "Add to Inventory"){
            updateItems();
            displayItemsForAdd();
        } else if (response.options == "Add New Product"){
            addNewItem()
        }
        })

}

options()

