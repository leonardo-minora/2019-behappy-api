import Hapi from "@hapi/hapi";
import { User } from "../../models";

const server = new Hapi.Server({
  port: process.env.PORT || 8000,
  debug: { request: ["*"] }
});

const validate = async (request, username, password) => {
  if (!User.login(username, password)) return { credentials: null, isValid: false };
  return { credentials: {}, isValid: true };
};

const init = async () => {
  await server.register([{
    plugin: require("hapi-router"),
    options: {
      routes: "src/routes/**/*.js"
    }
  },
  {
    plugin: require("@hapi/basic"),
  }]);
  server.auth.strategy('simple', 'basic', { validate });

  await server.start();
  console.log("Server is running");
  console.log(server.info);
};

init();
