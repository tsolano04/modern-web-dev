import Parse from "parse";

export function createUser(newUser) {
  const user = new Parse.User();

  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("email", newUser.email);
  user.set("password", newUser.password);

  return user
    .signUp()
    .then((newUserSaved) => {
      return newUserSaved;
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
};

export const loginUser = (username, password) => {
  return Parse.User.logIn(username, password)
    .then((user) => {
      return user;
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
};
