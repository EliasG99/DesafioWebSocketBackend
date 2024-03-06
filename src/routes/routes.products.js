// Imports

import {Router} from 'express';
import ProductManager from '../controllers/ProductManager.js';
import __dirname from '../utils.js';
import {join} from 'path';
import { socketServer } from '../app.js';

// Definitions

let fileName = join(__dirname, "/data/products.json");
let productManager = new ProductManager(fileName);
export const router = Router();

// Methods

router.get("/", async (req, res) => { // Get the complete list of products
  res.setHeader("Content-Type", "application/json"); // Set the header
  let products = await productManager.getProducts();
  let limit = parseInt(req.query.limit); // Get the limit query for products
  if (!limit) {
    res.status(200).json({ products });
  } else {
    products = products.slice(0, limit); // Modify the array to limit the results
    res.status(200).json({ products });
  }
});

router.get("/:id", async (req, res) => { // Get a product by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let id = parseInt(req.params.id); // This param comes in string format
  if (isNaN(id)) {
    return res.status(400).json({error: "The ID you entered is not a valid number"});
  }
  let result = await productManager.getProductById(id);
  if (!result) {
    res.status(400).json({error: "The product couldn't be found"});
  } else {
    res.status(200).json({ result });
  }
});

router.delete("/:id", async (req, res) => { // Delete a product by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let id = parseInt(req.params.id); // This param comes in string format
  if (isNaN(id)) {
    return res.status(404).json({error: "The ID you entered is not a valid number"});
  }
  let result = await productManager.removeProduct(id);
  let updatedProducts = await productManager.getProducts();
  socketServer.emit('newProduct', updatedProducts);
  if (!result) {
    res.status(400).json({error: "The product couldn't be found"});
  } else {
    res.status(200).json({status:'success', message:'Product removed successfully'})
  }
});

router.put("/:id", async (req, res) => { // Update a product by its ID
  res.setHeader("Content-Type", "application/json"); // Set the header
  let product = req.body // Get the information to be updated
  let id = parseInt(req.params.id); // This param comes in string format
  if (isNaN(id)) {
    return res.status(400).json({error: "The ID you entered is not a valid number"});
  }
  let result = await productManager.updateProduct(id, product);
  let updatedProducts = await productManager.getProducts();
  socketServer.emit('newProduct', updatedProducts);
  if (!result) {
    res.status(404).json({error: "The product couldn't be found"});
  } else {
    res.status(200).json({status:'success', message:'Product updated successfully'})
  }
});

router.post('/', async (req, res)=> {
  let product = req.body;
  if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
    return res.status(400).json({status: 'error', error: 'Incomplete data, make sure to enter all required fields'})
  } 
  try {
    await productManager.addProduct(product) // Send the product and destructure it in the target function
    let updatedProducts = await productManager.getProducts();
    socketServer.emit('newProduct', updatedProducts);
    res.status(200).json({status:'success', message:'Product added successfully'})
  } catch (error) {
    res.status(400).json({status:'error', message: error.message});
  }
})

