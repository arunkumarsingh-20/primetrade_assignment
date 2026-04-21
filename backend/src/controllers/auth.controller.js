const { registerSchema, loginSchema } = require("../validations/auth.validation");
const { registerUser, loginUser } = require("../services/auth.service");

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/"
};

const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues.map((err) => err.message)
      });
    }

    const result = await registerUser(parsed.data);

    res.cookie("token", result.token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.user
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues.map((err) => err.message)
      });
    }

    const result = await loginUser(parsed.data);

    res.cookie("token", result.token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result.user
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout
};
