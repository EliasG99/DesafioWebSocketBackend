// Imports

import {Router} from 'express';
import CartManager from '../controllers/CartManager.js';
import __dirname from '../utils.js';
import {join} from 'path';

// Definitions

let fileName = join(__dirname, "/data/carts.json");
let cartManager = new CartManager(fileName);
export const router = Router();

// Methods

router.get("/", async (req, res) => { // Get the complete list of carts
  res.setHeader("Content-Type", "application/json"); // Set the header
  let carts = await cartManager.getCarts();
  res.status(200).json({ carts });
});

router.get("/:cid", async (req, res) => { // Get a cart by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let id = parseInt(req.params.cid); // This param comes in string format
  if (isNaN(id)) {
    return res.status(400).json({error: "The ID you entered is not a valid number"});
  }
  let result = await cartManager.getCartById(id);
  if (!result) {
    res.status(400).json({error: "The cart couldn't be found"});
  } else {
    res.status(200).json({ result });
  }
});

router.post("/:cid/product/:pid", async (req, res) => { // Adds a product to a cart by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let cartId  = parseInt(req.params.cid); // This param comes in string format
  let productId = parseInt(req.params.pid);
  let product = req.body; // The object product with its quantity
  if (isNaN(cartId) || isNaN(productId)) {
    return res.status(400).json({error: "The cart or product ID you entered is not a valid number"});
  }
  if (await cartManager.addProductToCart(cartId, product)){
    res.status(200).json({status:'success', message: "Cart created successfully"})
  } else {
    return res.status(400).json({status: 'error', error: "The cart couldn't be updated, make sure you entered the data correctly"})
  }
});

router.post("/", async (req,res) => { // Creates a new cart with products
  let products = req.body;
  if (!products) {
    return res.status(400).json({status: 'error', error: "Incomplete data, make sure specify the products to be added to the cart"})
  } else {
    if (await cartManager.addCart(products)) {
      res.status(200).json({status:'success', message: "Cart created successfully"})
    } else{
      return res.status(400).json({status: 'error', error: "The cart couldn't be created, make sure you entered the data correctly"})
    }
    
  }
})

