import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import { loginUser } from "./AuthService";
import { useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && login) {
      loginUser(user.username, user.password).then((userLoggedIn) => {
        if (userLoggedIn) {
          alert(
            `${userLoggedIn.get("firstName")}, you successfully logged in!`
          );
          navigate("*");
        }
        setLogin(false);
      });
    }
  }, [user, login]);

  const onChangeHandler = (e) => {
    e.preventDefault();
    console.log(e.target);
    const { name, value: newValue } = e.target;
    setUser({ ...user, [name]: newValue });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setLogin(true);
  };

  const onBackHandler = () => {
    navigate("/");
  };

  return (
    <div>
      <LoginForm
        user={user}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
        goBack={onBackHandler}
      />
    </div>
  );
};

export default AuthLogin;
