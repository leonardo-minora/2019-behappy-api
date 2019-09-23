import { Task } from "../../models";

export default {
  method: "GET",
  path: "/tasks",
  options: {
    auth: "token"
  },
  handler: (request, reply) => Task.getAll()
};
