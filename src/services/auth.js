const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { ObjectId } = require('mongodb');
const authValidation = require('../validations/auth');
const userModel = require('../models/user');

const register = async (body) => {
  const validate = authValidation.register(body);

  if (validate.error) {
    throw createError(422, validate.error);
  }

  const { email } = body;
  if (await userModel.countUsers({ email })) {
    throw createError(409, 'Email has already been taken');
  }

  const { password } = body;
  const salt = bcrypt.genSaltSync(10);
  Object.assign(body, { password: bcrypt.hashSync(password, salt) });

  return userModel.createUser(body);
};

const login = async (body) => {
  const validate = authValidation.login(body);

  if (validate.error) {
    throw createError(422, validate.error);
  }

  const { username } = body;
  const user = await userModel.findUser({ email: username });

  if (!user || !bcrypt.compareSync(body.password, user.password)) {
    throw createError(401, 'Invalid username or password');
  }

  return user;
};

const findUserById = (id) => {
  const validate = authValidation.findUserById({ id });

  if (validate.error) {
    throw createError(422, validate.error);
  }

  return userModel.findUser({ _id: ObjectId(id) });
};

const getToken = (user, secret) => jwt.sign({
  id: user._id.toString(),
  email: user.email,
}, secret, { expiresIn: '2h' });

module.exports = {
  register,
  login,
  findUserById,
  getToken,
};
