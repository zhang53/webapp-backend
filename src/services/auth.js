const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { ObjectId } = require('mongodb');
const authValidation = require('../validations/auth');
const UserContainer = require('../containers/user');

class AuthService {
  constructor() {
    this._userContainer = new UserContainer();
  }

  async register(body) {
    const validate = authValidation.register(body);

    if (validate.error) {
      throw createError(422, validate.error);
    }

    const { email } = body;
    if (await this._userContainer.countUsers({ email })) {
      throw createError(409, 'Email has already been taken');
    }

    const { password } = body;
    const salt = bcrypt.genSaltSync(10);
    Object.assign(body, { password: bcrypt.hashSync(password, salt) });

    return this._userContainer.createUser(body);
  }

  async login(body) {
    const validate = authValidation.login(body);

    if (validate.error) {
      throw createError(422, validate.error);
    }

    const { username } = body;
    const user = await this._userContainer.findUser({ email: username });

    if (!user || !bcrypt.compareSync(body.password, user.password)) {
      throw createError(401, 'Invalid username or password');
    }

    return user;
  }

  findUserById(id) {
    const validate = authValidation.findUserById({ id });

    if (validate.error) {
      throw createError(422, validate.error);
    }

    return this._userContainer.findUser({ _id: ObjectId(id) });
  }

  static getToken(user, secret) {
    return jwt.sign({
      id: user._id.toString(),
      email: user.email,
    }, secret, { expiresIn: '2h' });
  }
}

module.exports = AuthService;
