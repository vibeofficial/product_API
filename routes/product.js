const { createProduct, getAll, getOne, update, deleteProduct } = require('../controllers/product');
const { authenticate } = require('../middleware/authenticate');
const uploads = require('../middleware/multer');

const router = require('express').Router();


/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: Create a new product
 *     description: Authenticated users can create a product with name, price, description, and image.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []    # 👈 Requires token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - price
 *               - description
 *               - productImage
 *             properties:
 *               productName:
 *                 type: string
 *                 example: "Chicken Burger"
 *               price:
 *                 type: number
 *                 example: 12.99
 *               description:
 *                 type: string
 *                 example: "Juicy grilled chicken burger with fries"
 *               productImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Product already exists
 *       404:
 *         description: Cannot create product for unexisting user
 *       500:
 *         description: Error creating product
 */
router.post('/products/create', uploads.single('productImage'), authenticate, createProduct);

/**
 * @swagger
 * /get-all:
 *   get:
 *     summary: Get all products
 *     description: Retrieves a list of all products from the database.
 *     tags:
 *       - Products
 *     responses:
 *       '200':
 *         description: Successfully retrieved all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All products
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 650b3d7f32b1ab001f4c25dd
 *                       productName:
 *                         type: string
 *                         example: Apple iPhone 15
 *                       price:
 *                         type: number
 *                         example: 1200
 *                       description:
 *                         type: string
 *                         example: Latest iPhone model with advanced features
 *                       productImage:
 *                         type: object
 *                         properties:
 *                           imageUrl:
 *                             type: string
 *                             example: https://res.cloudinary.com/demo/image/upload/v1694106768/sample.jpg
 *                           publicId:
 *                             type: string
 *                             example: sample_public_id
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting all products
 */
router.get('/get-all', getAll);

/**
 * @swagger
 * /get-one/{id}:
 *   get:
 *     summary: Get a single product
 *     description: Retrieves a specific product by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve
 *         example: 650b3d7f32b1ab001f4c25dd
 *     responses:
 *       '200':
 *         description: Successfully retrieved the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 650b3d7f32b1ab001f4c25dd
 *                     productName:
 *                       type: string
 *                       example: Apple iPhone 15
 *                     price:
 *                       type: number
 *                       example: 1200
 *                     description:
 *                       type: string
 *                       example: Latest iPhone model with advanced features
 *                     productImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           example: https://res.cloudinary.com/demo/image/upload/v1694106768/sample.jpg
 *                         publicId:
 *                           type: string
 *                           example: sample_public_id
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting product
 */
router.get('/get-one/:id', getOne);

/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Update a product
 *     description: Updates an existing product's details and optionally replaces its image on Cloudinary.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *         example: 650b3d7f32b1ab001f4c25dd
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 example: Samsung Galaxy S24
 *               price:
 *                 type: number
 *                 example: 1100
 *               description:
 *                 type: string
 *                 example: Updated description of the product
 *               productImage:
 *                 type: string
 *                 format: binary
 *                 description: New product image file (optional)
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 650b3d7f32b1ab001f4c25dd
 *                     productName:
 *                       type: string
 *                       example: Samsung Galaxy S24
 *                     price:
 *                       type: number
 *                       example: 1100
 *                     description:
 *                       type: string
 *                       example: Updated description of the product
 *                     productImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           example: https://res.cloudinary.com/demo/image/upload/v1694106768/sample.jpg
 *                         publicId:
 *                           type: string
 *                           example: sample_public_id
 *       '400':
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An input field is required
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error getting product
 */
router.put('/update/:id', uploads.single('productImage'), update);

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product from the database and removes its image from Cloudinary.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete
 *         example: 650b3d7f32b1ab001f4c25dd
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting product
 */
router.delete('/delete/:id', deleteProduct);



module.exports = router;