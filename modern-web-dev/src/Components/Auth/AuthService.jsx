import Parse from "parse";
const LASTFM_API_KEY = "92ea0b9fbc8ed207b0eead607af4f4d7";

export function createUser(newUser) {
  const user = new Parse.User();

  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("email", newUser.email);
  user.set("password", newUser.password);

  const acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setWriteAccess(user, true);
  user.setACL(acl);

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

// create logout function that can be used in the navbar to log out the user and refresh the page to update the navbar
export const logoutUser = ({setFlag}) => {
  Parse.User.logOut()
    .then(() => {
      setFlag(false);
      alert("You successfully logged out!");
      window.location.reload();
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
};

export const fetchLastFmInfo = async (lastfmUsername) => {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${lastfmUsername}&api_key=${LASTFM_API_KEY}&format=json`;
  const response = await fetch(url);
  const data = await response.json();
  return data.user; 
};