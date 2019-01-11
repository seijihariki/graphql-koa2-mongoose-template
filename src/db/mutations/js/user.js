import { ApolloError } from "apollo-server-koa";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt-nodejs";
import { models } from "../../model";
import logger from "../../../util/logging";
import uuidv4 from "uuid/v4";

const { User, Person, Company } = models;

const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const SECRET = process.env.SECRET || "SECRET";

export default {
  async createUser(parent, args) {
    // Check input
    const { data } = args;

    // Creds
    if (!data.credentials || data.credentials.length < 1)
      throw new ApolloError("At least one credential is required", 400);
    else {
      data.credentials
        .filter(c => c.credType === "API_KEY")
        .forEach(cred => {
          if (cred.key)
            throw new ApolloError("API key will be generated server-side");
        });
    }

    const passCreds = data.credentials.filter(c => c.credType === "PASSWORD");

    if (passCreds.length > 1)
      throw new ApolloError(
        "There must be a maximum of one password per account",
        400
      );

    passCreds.forEach(cred => {
      if (!cred.password || cred.password.length < 5)
        throw new ApolloError("Password length must be >= 5", 400);
    });

    // Email
    if (!data.email || !data.email.trim())
      throw new ApolloError("Email is required", 400);
    else if (!data.email.match(emailRegex))
      throw new ApolloError("Invalid email address", 400);
    else if (await User.findOne({ email: data.email }))
      throw new ApolloError("Email address is already being used");

    // Company
    if (!data.company) throw new ApolloError("Company must be specified", 400);
    const companies = Array.from(await Company.find(data.company).limit(2));
    if (companies.length === 0)
      throw new ApolloError("Company was not found", 404);
    if (companies.length > 1)
      throw new ApolloError("Multiple companies found matching query", 409);
    data.company = companies[0].id;

    // Person
    if (data.person) {
      const people = Array.from(await Person.find(data.person).limit(2));
      if (people.length === 0)
        throw new ApolloError("Person was not found", 404);
      if (people.length > 1)
        throw new ApolloError("Multiple people found matching query", 409);
      data.person = people[0].id;
    }

    // Create user
    data.credentials.forEach(credential => {
      const cred = credential;
      if (cred.credType === "PASSWORD") {
        cred.hash = bcrypt.hashSync(cred.password, bcrypt.genSaltSync());
      } else if (cred.credType !== "API_KEY") {
        throw new ApolloError("Unrecognized credential type", 500);
      }
    });

    const user = new User(data);

    user.credentials.forEach(credential => {
      const cred = credential;
      if (cred.credType === "API_KEY") {
        cred.key = jwt.sign({ key_id: cred.id }, SECRET, {
          expiresIn: "1y"
        });
      } else if (cred.credType !== "PASSWORD") {
        throw new ApolloError("Unrecognized credential type", 500);
      }
    });

    // Save
    try {
      await user.save();
    } catch (e) {
      logger.error(e);
      throw new ApolloError("Failed to create user", 500);
    }

    return User.findById(user.id);
  },
  async login(parent, args) {
    // Check input
    const data = args;

    if ((data.password && data.key) || (!data.password && !data.key))
      throw new ApolloError(
        "Must provide one, and only one of password and api key"
      );

    if (!data.email || !data.email.trim())
      throw new ApolloError("Email is required", 400);
    const email = data.email.trim();
    if (!email.match(emailRegex))
      throw new ApolloError("Invalid email address", 400);

    // Find user
    const user = await User.findOne({ email });

    const session = {
      user,
      token: null
    };

    // If password
    if (data.password) {
      let hash = "";
      if (user) {
        user.credentials.forEach(credential => {
          if (credential.credType === "PASSWORD") hash = credential.hash;
        });
      }

      const sessionObj = {
        user: user.id,
        permissions: user.permissions,
        device: uuidv4()
      };

      // Compare hashes
      if (hash && bcrypt.compareSync(data.password, hash)) {
        session.token = jwt.sign(sessionObj, SECRET, {
          expiresIn: "3d"
        });
      } else return null;
    }
    return session;
  }
};
