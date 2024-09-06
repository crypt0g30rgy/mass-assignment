// Imports
// Models Imports
const UserModel = require("../models/userModel"); // for user model
const PaymentModel = require("../models/paymentModel");


const jwt = require("jsonwebtoken");

// server validators
const bcrypt = require("bcryptjs"); // to encrypt password



// New Login Method
const newLoginUser = async (req, res) => {
  // Ensure the body has the required fields
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).json({ MissingFieldsException: "Missing body." });
  }

  const { email, password } = req.body;

  try {
    // Find the user by email and include the password field for verification
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({ AuthenticationError: "Invalid Login." });
    }

    // Compare provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ AuthenticationError: "Invalid Login." });
    }

    // User authentication successful, generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // Payload with user info
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: "1h" } // Token expiration time
    );

    // Return the token in response
    return res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Error" });
  }
};

const signUpUser = async (req, res) => {
  try {

    console.log(req.body)

    const { email, username } = req.body;

    const existingUser = await UserModel.findOne({
      $or: [
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(409).json({ error: "Email exists." });
      }
    }

    //---USER MODEL---
    user = new UserModel(req.body);

    console.log(user)

    await user.save();

    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create a dummy payment record for the new user
    const payment = new PaymentModel({
      user_id: user._id, // Reference the newly created user's ID
      paymentMethod: "credit_card", // Dummy payment method
      amount: 100, // Dummy amount
      userName: username.toLowerCase(), // Use the user's username
      currency: "USD"
    });

    // Save the payment record to the database
    await payment.save();

    return res.status(201).json({ message: "User created and payment data saved.", token, payment });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Error" });
  }
}


// SignUp User No Mass Assignment
const signUpUserFixed = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing Body." });
    }

    const existingUser = await UserModel.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email exists." });
    }

    // Create a new user instance
    const user = new UserModel({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: password
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create a dummy payment record for the new user
    const payment = new PaymentModel({
      user_id: user._id, // Reference the newly created user's ID
      paymentMethod: "credit_card", // Dummy payment method
      amount: 100, // Dummy amount
      userName: username.toLowerCase(), // Use the user's username
      currency: "USD"
    });

    // Save the payment record to the database
    await payment.save();

    return res.status(201).json({ message: "User created and payment data saved.", token, payment });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Error" });
  }
};


module.exports = { newLoginUser, signUpUserFixed, signUpUser }