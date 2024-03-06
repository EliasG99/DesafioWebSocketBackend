// Imports

import { Router } from "express";
import ProductManager  from '../controllers/ProductManager.js';
import { join } from "path"; //Utilizamos el path para poder trabajar con rutas absolutas
import __dirname from '../utils.js'; //Importamos utils para poder trabvajar con rutas absolutas

// Definitions

export const router = Router();
let fileName = join(__dirname, "/data/products.json");
const productManager = new ProductManager(fileName)

// Methods

router.get('/', async (req,res) => {

  try {
    
    let data =  await productManager.getProducts();
    res.status(200).render('home' , {data, title: "Home Page"})

  } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`error`});
  }
})

router.get('/realtimeproducts', async (req,res) => {

  try {  

    let data =  await productManager.getProducts();
    res.status(200).render('realTimeProducts' , {data, title: "Real Time Products"})

  } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`error`});
  }
})