# bamazon

bamazonCustomer.js 
This is a shopping app. Items with prices are populated from a mySQL database. Using Inquirer, the user is prompted to pick an item ID number and the quantity they would like to buy. If the item number is valid and the quantity exists, the quantity is subtracted and updated to mySQL and the total is presented to the user along with a success message. If one of the two conditions is not met, an error message populates and the user is prompted to select an item and quantity again. After a successful purchase, the user is asked if he or she would like to purchase another item. If yes, the process repeats. If no, the connection is ended. 

See app's functionality here: https://drive.google.com/file/d/1_ADYavsW3B45BTttCdcDedf5ch7m5D6x/view

bamazonManager.js
This app is for managing inventory. Items with prices and quantities are populated from a mySQL database. Inquire is used to prompt if the user would like to see items available, see items that have low stock quantities, add to inventory, or add a new item. Improper inputs (such as non-existing items numbers, blanks, or strings when there should be numbers) are not accepted and the application prompts the user for valid inputs. Following a successful execution of any task, the app asks the user if he or she would like to complete another. If yes, the process repeats. If no, the connection ends. 

See app's functionality here: https://drive.google.com/file/d/1kJg4CeULB8W9iEKZTJN8hVyFlrvwm2Gi/view