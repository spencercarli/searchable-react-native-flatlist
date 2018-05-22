import _ from "lodash";
import users from "./users";

export const getUsers = (limit = 20) => {
  return new Promise((resolve, reject) => {
    resolve(_.take(users, limit));
  });
};

export default getUsers;
