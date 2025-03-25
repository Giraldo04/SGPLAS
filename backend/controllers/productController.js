// backend/controllers/productController.js
const Product = require('../models/Product');

// Función para obtener todos los productos
const getProducts = async (req, res) => {
  try {
    // Encuentra todos los documentos de la colección "products"
    const products = await Product.find({});
    // products será un array, aunque tengas 1 o 0 documentos
    res.json(products); 
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Función para obtener un producto por su ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

// Función para crear un producto (se puede restringir a admin)
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      countInStock: req.body.countInStock,
      image: req.body.image,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};

// Función para actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.countInStock = req.body.countInStock || product.countInStock;
      product.image = req.body.image || product.image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

// Función para eliminar un producto
// Función para eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Antes: await product.remove();
      // Ahora:
      await product.deleteOne(); 
      // o: await Product.deleteOne({ _id: product._id });

      return res.json({ message: 'Producto eliminado' });
    } else {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
