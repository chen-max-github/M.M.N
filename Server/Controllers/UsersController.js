require("dotenv").config();

const { compare } = require("../Utilities/Bcrypt");
const { sign } = require("../Utilities/Jwt");
const { error, success } = require("../Repository/ResponseRepository");
const Users = require("../Models/Users");

const refresh_token = process.env.REFRESH_TOKEN;

exports.register = async (req, res) => {
  const { name, surname, email, password, role } = req.body;

  if (!(email && password && role)) {
    error(res, "Veuillez saisir tous les champs");
  }

  const [verification, _] = await Users.findByEmail(email);

  if (verification.length > 0) {
    return error(res, "Un utilisateur utilise déjà cet email !");
  }
  const user = {
    password: password,
    email: email,
    role: role,
    name: name,
    surname: surname,
  };

  const request = await Users.save(user);

  console.log(request);

  return success(res, "Compte créé avec succès");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  if (!(email && password)) {
    return error(res, "Veuillez saisir tous les champs");
  }

  const [verification, _] = await Users.findByEmail(email);

  if (verification.length < 1) {
    return error(res, "Cet email n'est associé à aucun utilisateur.");
  }

  const data = verification[0];

  if (!(await compare(password, data.password))) {
    return error(res, "Mot de passe incorrect");
  }

  const user = {
    name: data.name,
    surname: data.surname,
    email: data.email,
    role: data.role,
  };

  const token = await sign({
    ...data,
    password: null,
  });

  return success(res, {
    user: user,
    token: token,
    refresh_token: refresh_token,
  });
};

exports.update = async (req, res) => {
  let { email, name, address, password } = req.body;

  if (!(email && name && address && password)) {
    error(res, "Veuillez saisir tous les champs");
  }
  name = await upperFirst(name);

  const currentUser = await Users.findByEmail(email);

  if (currentUser.length < 1) {
    error(res, "Cet email n'est associé à aucun utilisateur.");
  }

  let modifiedUser = Users({
    email: email,
    password: password,
    address: address,
    name: name,
  });

  modifiedUser = Users.modify();
  console.log(modifiedUser);

  return success(res, "Modification enregistrée.");
};
