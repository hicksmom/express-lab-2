const express = require('express');
const cart = express.Router();

const pool = require("./pg-connection-pool");

// logic for our endpoints
// const cartItems = [
//     {id: 1, product: "Lemons", price: 0.50, quantity: 6},
//     {id: 2, product: "Avocados", price: 0.79, quantity: 4},
//     {id: 3, product: "Shrimp", price: 12.50, quantity: 1},
//     {id: 4, product: "Pineapple Juice", price: 4.75, quantity: 1},
//     {id: 5, product: "Prosecco", price: 11.99, quantity: 1},
// ];

cart.get("/cart-items", (req, res) => {
         
    const maxPrice = parseFloat(req.query.maxPrice);
    const prefix = (req.query.prefix);
    const limit = parseInt(req.query.limit);


    if (maxPrice) {
        pool.query('SELECT * FROM shopping_cart WHERE price <= $1', [maxPrice]).then( (results) => {
            res.json(results.rows);
        })
    } else
    
    if (prefix) {
        pool.query('SELECT * FROM shopping_cart WHERE LOWER(product) LIKE $1', [prefix.toLowerCase() + '%']).then( (results) => {
            console.log(prefix);
            console.log(results.rows);
            res.json(results.rows);
        }
    )} else

    if (limit) {
        pool.query('SELECT * FROM shopping_cart ORDER BY id LIMIT $1', [limit]).then( (results) => {
        res.json(results.rows);
        }
    )} else 
    
    {
        pool.query('SELECT * FROM shopping_cart ORDER BY id;').then( (results) => {
        res.json(results.rows);
        }
    )}

});

cart.get("/cart-items/:id", (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM shopping_cart WHERE id = $1', [id]).then( (results) => {

        if (results.rowCount > 0) {
            res.json(results.rows);
        } else {
            res.status(404);
            res.send("ID Not Found");
        }
    });
});

cart.post("/cart-items", (req, res) => {
    let newItem = req.body;

    pool.query('INSERT INTO shopping_cart (product, price, quantity) VALUES ($1, $2, $3) returning *;', [
        newItem.product,
        newItem.price,
        newItem.quantity
    ]).then( () => {
        res.status(201);
        res.json(newItem);
    })      
});

// accept PUT request at URI: /cart-items
cart.put("/cart-items/:id", (req, res) => {

    const id = parseInt(req.params.id);
    const product = req.body.product;
    const price = req.body.price;
    const quantity = req.body.quantity;

    const updatedItem = req.body;
    updatedItem.id = id;

    pool.query('UPDATE shopping_cart SET product = $1, price = $2, quantity = $3 WHERE id=$4', [product, price, quantity, id]).then( () => {
        res.status(200);
        res.json(updatedItem);              
    })
});

cart.delete("/cart-items/:id", (req, res) => {
    const id = parseInt(req.params.id);

    pool.query("DELETE FROM shopping_cart WHERE id=$1", [id]).then( () => {
        res.status(204);
        res.json("");
    });
});

// export module so it's usable in other files
module.exports = cart;