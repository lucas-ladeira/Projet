const Product = require('../models/Product');

exports.getShopRoot = async (req, res) => {
  return res.redirect('/shop/products');
}
exports.getAllProductsForShop = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('ShopProducts', { products });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.getCartForShop = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    res.render('ShopCart', { cartItems: cart, totalAmount });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.addToCartForShop = async (req, res) => {
  const productId = req.body.id;
  console.log("Product ID received:", productId);

  const cart = req.session.cart || []; // Recupera o carrinho da sessão ou inicializa vazio

  try {
    // Verifica se o produto já está no carrinho
    const existingItem = cart.find(item => item._id.toString() === productId);

    if (existingItem) {
      // Incrementa a quantidade do produto existente
      existingItem.quantity += 1;
      console.log("Product quantity incremented:", existingItem);
    } else {
      // Busca o produto no banco de dados
      const product = await Product.findById(productId);
      if (product) {
        // Adiciona o produto com quantidade inicial de 1
        cart.push({
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          quantity: 1, // Quantidade inicial
        });
        console.log("Product added to cart:", product);
      } else {
        return res.status(404).render('error', { message: 'Product not found' });
      }
    }

    // Atualiza o carrinho na sessão
    req.session.cart = cart;

    // Redireciona de volta para a página dos produtos
    res.redirect('/shop/products');
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    return res.status(500).render('error', { message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  const productId = req.body.id;
  const action = req.body.action;
  let quantity = parseInt(req.body.quantity) || 1;

  // Inicializa o carrinho na sessão
  const cart = req.session.cart || [];

  try {
    // Encontra o item no carrinho
    const existingItem = cart.find(item => item._id.toString() === productId);

    if (!existingItem) {
      return res.status(404).render('error', { message: 'Product not found in cart' });
    }
    switch (action) {
      case 'increase':
        existingItem.quantity += 1;
        break;
      case 'decrease':
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        }
        break;
      case 'update':
        if (quantity >= 1) {
          existingItem.quantity = quantity;
        }
        break;
      default:
        return res.status(400).render('error', { message: 'Invalid action' });
    }
    console.log(`Updated quantity for product ${productId}:`, existingItem.quantity);

    // Salva o carrinho na sessão
    req.session.cart = cart;

    // Redireciona de volta para a página do carrinho
    res.redirect('/shop/cart');
  } catch (error) {
    console.error('Error updating cart:', error.message);
    return res.status(500).render('error', { message: error.message });
  }
};

exports.removeToCartForShop = async (req, res) => {
  const productId = req.body.id;
  console.log("Product ID received:", productId);
  const cart = req.session.cart || [];

  try {
    const updatedCart = cart.filter(item => item._id.toString() !== productId);
    req.session.cart = updatedCart;
    res.redirect('/shop/cart');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.getCheckout = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    let totalAmount = 0;
    cart.forEach(item => {
      totalAmount += item.price * item.quantity;
    });
    res.render('Checkout', { cart, totalAmount });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};