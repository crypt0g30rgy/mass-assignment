const express = require("express");
const router = express.Router();

const { signUpUser, newLoginUser, signUpUserFixed } = require('../controllers/auth')
const { getCurrentUser, getPaymentData, updatePaymentData, updatePaymentFixed } = require("../controllers/user");
const authMiddleware = require("../utils/authMiddleWare")


/**
 * @swagger
 * tags:
 *   name: Root
 *   description: the Root
 * /:
 *   get:
 *     summary: Return the Root Message
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Root Message
 */

router.get("/", (req, res) => {
  return res.status(200).json("API");
})

// new SignIn API

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes for user sign-in and sign-up.
 * /v1/SignIn:
 *   post:
 *     summary: Authenticate a user and return user data
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user ID
 *                     email:
 *                       type: string
 *                       description: The user's email address
 *                     name:
 *                       type: string
 *                       description: The user's full name
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the user was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the user was last updated
 *       400:
 *         description: Bad Request - Missing or invalid input
 *       401:
 *         description: Unauthorized - Incorrect email or password
 */

router.post("/v1/SignIn", newLoginUser)

// old SignUp API

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes for user sign-in and sign-up.
 * /v1/SignUp:
 *   post:
 *     summary: Authenticate a user and return user data
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - company
 *               - department
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *               username:
 *                 type: string
 *                 format: string
 *                 description: The username
 *               company:
 *                 type: string
 *                 format: string
 *                 description: The user's company
 *               department:
 *                 type: string
 *                 format: string
 *                 description: The user's department
 *     responses:
 *       201:
 *         description: User Created successfully
 *       400:
 *         description: Bad Request - Missing or invalid input
 *       409:
 *         description: user Exists
 */

router.post("/v1/SignUp", signUpUser)

// new SignUp API

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes for user sign-in and sign-up.
 * /v2/SignUp:
 *   post:
 *     summary: Authenticate a user and return user data
 *     tags: [Secure]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - company
 *               - department
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *               username:
 *                 type: string
 *                 format: string
 *                 description: The username
 *               company:
 *                 type: string
 *                 format: string
 *                 description: The user's company
 *               department:
 *                 type: string
 *                 format: string
 *                 description: The user's department
 *     responses:
 *       201:
 *         description: User Created successfully
 *       400:
 *         description: Bad Request - Missing or invalid input
 *       409:
 *         description: user Exists
 */

router.post("/v2/SignUp", signUpUserFixed)

// get user info

/**
 * @swagger
 * tags:
 *   name: User
 *   description: user info
 * /v1/users/me:
 *   get:
 *     summary: Return user information
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user ID
 *                     email:
 *                       type: string
 *                       description: The user's email address
 *                     name:
 *                       type: string
 *                       description: The user's full name
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the user was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the user was last updated
 *       400:
 *         description: Bad Request - Bad JWT
 *       401:
 *         description: Unauthorized - JWT has expired
 *       403:
 *         description: Unauthorized - JWT Error
 */

router.get("/v1/users/me", authMiddleware, getCurrentUser)

/**
 * @swagger
 * tags:
 *   name: User
 *   description: user info
 * /v1/users/me/payment-info:
 *   get:
 *     summary: Return user payment information
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user ID
 *                     email:
 *                       type: string
 *                       description: The user's email address
 *                     name:
 *                       type: string
 *                       description: The user's full name
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the user was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the user was last updated
 *       400:
 *         description: Bad Request - Bad JWT
 *       401:
 *         description: Unauthorized - JWT has expired
 *       403:
 *         description: Unauthorized - JWT Error
 */
router.get("/v1/users/me/payment-info", authMiddleware, getPaymentData)

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and information
 * /v1/users/me/payment-info:
 *   put:
 *     summary: Update user payment information
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 description: The user's payment method
 *                 enum:
 *                   - credit_card
 *                   - paypal
 *                   - bank_transfer
 *                 example: credit_card
 *               userName:
 *                 type: string
 *                 description: The name associated with the payment method
 *     responses:
 *       200:
 *         description: User payment information successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The payment ID
 *                     user:
 *                       type: string
 *                       description: The user ID associated with the payment
 *                     paymentMethod:
 *                       type: string
 *                       description: The payment method (e.g., credit_card, paypal, bank_transfer)
 *                     amount:
 *                       type: number
 *                       description: The amount for the payment
 *                     status:
 *                       type: string
 *                       description: The status of the payment (e.g., pending, completed, failed)
 *                     userName:
 *                       type: string
 *                       description: The name associated with the payment
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the payment was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the payment was last updated
 *       400:
 *         description: Bad Request - Missing or invalid parameters
 *       404:
 *         description: Not Found - No payment found for this user
 *       401:
 *         description: Unauthorized - JWT has expired
 *       403:
 *         description: Forbidden - Invalid JWT
 */


router.put("/v1/users/me/payment-info", authMiddleware, updatePaymentData)


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and information
 * /v2/users/me/payment-info:
 *   put:
 *     summary: Update user payment information
 *     tags: [Secure]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 description: The user's payment method
 *                 enum:
 *                   - credit_card
 *                   - paypal
 *                   - bank_transfer
 *                 example: credit_card
 *               userName:
 *                 type: string
 *                 description: The name associated with the payment method
 *     responses:
 *       200:
 *         description: User payment information successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The payment ID
 *                     user:
 *                       type: string
 *                       description: The user ID associated with the payment
 *                     paymentMethod:
 *                       type: string
 *                       description: The payment method (e.g., credit_card, paypal, bank_transfer)
 *                     amount:
 *                       type: number
 *                       description: The amount for the payment
 *                     status:
 *                       type: string
 *                       description: The status of the payment (e.g., pending, completed, failed)
 *                     userName:
 *                       type: string
 *                       description: The name associated with the payment
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the payment was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date when the payment was last updated
 *       400:
 *         description: Bad Request - Missing or invalid parameters
 *       404:
 *         description: Not Found - No payment found for this user
 *       401:
 *         description: Unauthorized - JWT has expired
 *       403:
 *         description: Forbidden - Invalid JWT
 */


router.put("/v2/users/me/payment-info", authMiddleware, updatePaymentFixed)

module.exports = router;