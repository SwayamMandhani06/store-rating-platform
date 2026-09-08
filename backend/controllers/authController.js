const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { signToken } = require('../utils/jwt');
const {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
  collectErrors,
} = require('../utils/validators');

// POST /api/auth/signup - Normal User self-registration
async function signup(req, res, next) {
  try {
    const { name, email, password, address } = req.body;

    const errors = collectErrors([
      ['name', validateName(name)],
      ['email', validateEmail(email)],
      ['password', validatePassword(password)],
      ['address', validateAddress(address)],
    ]);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Validation failed', errors });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role: 'user' });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/auth/password - any logged-in user updates their own password
async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const passwordError = validatePassword(newPassword);
    if (passwordError) return res.status(400).json({ message: 'Validation failed', errors: { newPassword: passwordError } });

    const user = await User.findByPk(req.user.id);
    const match = await bcrypt.compare(currentPassword || '', user.password);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function me(req, res) {
  const { id, name, email, role, address } = req.user;
  return res.json({ id, name, email, role, address });
}

module.exports = { signup, login, updatePassword, me };
