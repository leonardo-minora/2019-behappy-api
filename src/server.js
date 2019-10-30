import Hapi from "@hapi/hapi";
import { User, Token } from "./models";

const server = new Hapi.Server({
  port: process.env.PORT || 8000,
  headers: {
    "Content-Type": "application/json"
  },
  routes: {
    cors: true
  },
  debug: { request: ["*"] }
});

const basic_validate = async (request, username, password) => {
  const user = await User.login(username, password);

  if (user == undefined) {
    return { credentials: null, isValid: false };
  }
  const token = Token.add(user);
  return {
    credentials: { id: user.oid, username: user.login, token: token },
    isValid: true
  };
};

const token_validate = async (user, request) => {
  const token = Token.findByUser(user);
  if (token == undefined) {
    return { credentials: null, isValid: false };
  } else {
    const credentials = { id: user.id, name: user.name, token: token };
    return { credentials, isValid: true };
  }
};

const init = async () => {
  await server.register([require("@hapi/basic"), require("hapi-auth-jwt2")]);
  server.auth.strategy("simple", "basic", { validate: basic_validate });
  server.auth.strategy("token", "jwt", {
    key: Token.secret,
    validate: token_validate,
    verifyOptions: { algorithms: ["HS256"] }
  });

  await server.register([
    {
      plugin: require("hapi-router"),
      options: {
        routes: "src/routes/**/*.js"
      }
    },
    {
      plugin: require("hapi-cors"),
      options: {
        origins: ["*"]
      }
    }
  ]);

  await server.start();
  console.log("Server is running");
  console.log(server.info);
};

init();
