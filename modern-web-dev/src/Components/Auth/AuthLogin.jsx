import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import { loginUser } from "./AuthService";
import { useNavigate } from "react-router-dom";

const AuthLogin = ({ setFlag }) => {
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
          setFlag(true); 
          
          alert(`${userLoggedIn.get("firstName")}, you successfully logged in!`);
          
          // 2. Move to home
          navigate("/");
        }
        setLogin(false);
      }).catch((error) => {
        alert(error.message);
        setLogin(false);
      });
    }
  }, [user, login, navigate, setFlag]);
  

  const onChangeHandler = (e) => {
    e.preventDefault();
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

  const handleLastFmLogin = async () => {
    try {
        const user = await Parse.User.logIn(username, password);
        
        // CRITICAL: Trigger the flag so the Navbar knows to refresh
        if (setFlag) {
            setFlag(true); 
        }
        
        navigate("/");
    } catch (error) {
        alert(error.message);
    }
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
