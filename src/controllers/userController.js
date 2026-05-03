const bcrypt = require("bcryptjs");
const AppDataSource = require("../config/data-source");

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    const userRepository = AppDataSource.getRepository("User");

    const existingUser = await userRepository.findOne({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: "customer"
    });

    const savedUser = await userRepository.save(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

module.exports = {
  registerUser
};