import Hapi from "@hapi/hapi";
import { User } from "./models";

const server = new Hapi.Server({
  port: process.env.PORT || 8000,
  debug: { request: ["*"] }
});

const validate = async (request, username, password) => {
  const user = await User.login(username, password)

  if (user == undefined) {
    return { credentials: null, isValid: false };
  }
  return { credentials: {id: user.oid, username: user.login}, isValid: true };
};

const init = async () => {
  await server.register([
    {
      plugin: require("@hapi/basic")
    }
  ]);
  server.auth.strategy('simple', 'basic', { validate });

  await server.register({
    plugin: require("hapi-router"),
    options: {
      routes: "src/routes/**/*.js"
    }
  });

  await server.start();
  console.log("Server is running");
  console.log(server.info);
};

init();
