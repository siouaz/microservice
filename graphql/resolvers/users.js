const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  Mutation: {
    async registerUser(_, { registerInput: { username, email, password } }) {
      //Verifier l'existance d'un utilisateur
      const oldUser = await User.findOne({ email });

      //Throw error si l'utilisateur existe deja
      if (oldUser) {
        throw new Error("email existe deja");
      }
      //cripter le mdp

      var encryptedPassword = await bcrypt.hash(password, 10);

      //creer mongoose model(User)
      const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      //creation du jwt
      const token = jwt.sign({ user_id: newUser._id, email }, "UNSAFE_STRING");
      newUser.token = token;

      //enregistrer l'utilisateur dans la base

      const res = await newUser.save();
      return {
        id: res.id,
        ...res._doc,
      };
    },
    async loginUser(_, { loginInput: { email, password } }) {
      //verifier si email existe

      const user = await User.findOne({ email });

      //verifier mdp
      if (user && (await bcrypt.compare(password, user.password))) {
        //creation du nouveau token
        const token = jwt.sign({ user_id: user._id, email }, "UNSAFE_STRING");
        //attacher le token au user model
        user.token = token;

        return {
          id: user.id,
          ...user._doc,
        };
      } else {
        //si user inconue retourner erreur
        throw new Error("mot de passe incorrect");
      }
    },
  },
  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
};
