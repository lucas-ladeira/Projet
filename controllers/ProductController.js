const Product = require('../models/Product');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { v4: uuidv4 } = require('uuid');

// Cloudinary configuration using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadImage = upload.single('image');

// Contrôleurs
exports.getAllProducts = async (req, res) => {
  try {
    if (!req.session.userId || req.session.user.role !== 'admin') {
      return res.redirect(req.session.userId ? '/shop' : '/user/login');
    }
    
    const products = await Product.find();

    res.render('Products', { products });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('Product', product);
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.addSingleProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    let image = null; // Use `let` so it can be reassigned

    if (req.file) {
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'panier', public_id: uuidv4() },
            (error, result) => {
              if (error) {
                reject(error); // Reject the promise if an error occurs
              } else {
                resolve(result); // Resolve the promise with the result
              }
            }
          );
          uploadStream.end(req.file.buffer); // Pass the buffer to the stream
        });
      };

      try {
        const result = await uploadToCloudinary();
        image = result.secure_url; // Use the secure Cloudinary URL
      } catch (error) {
        res.status(500).render('error', { message: error.message });
        return;
      }
    }

    // Create the product with or without an image
    await Product.create({ name, description, price, image });
    res.redirect('/admin/products');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.updateSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If a new image is uploaded, upload it to Cloudinary
    if (req.file) {
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'panier', public_id: uuidv4() },
            (error, result) => {
              if (error) {
                reject(error); // Reject the promise if an error occurs
              } else {
                resolve(result); // Resolve the promise with the result
              }
            }
          );
          uploadStream.end(req.file.buffer); // Pass the buffer to the stream
        });
      };

      try {
        const result = await uploadToCloudinary();
        updateData.image = result.secure_url; // Use the secure Cloudinary URL
      } catch (error) {
        res.status(500).render('error', { message: error.message });
        return;
      }
    }

    // Update the product in the database
    await Product.findByIdAndUpdate(id, updateData, { new: true }); // Return the updated document
    res.redirect('/admin/products');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.deleteSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/admin/products');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};
