import { useEffect, useState } from "react";
import AuthForm from "./RegisterForm";
import { createUser } from "./AuthService";
import { useNavigate } from "react-router-dom";

const AuthRegister = () => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [add, setAdd] = useState(false);

  // Find way to automatically display user's name in navbar after registration without refreshing the page
  useEffect(() => {
    if (newUser && add) {
      createUser(newUser).then((userCreated) => {
        if (userCreated) {
          alert(
            `${userCreated.get("firstName")}, you successfully registered!`
          );
        }
        setAdd(false);
      });
    }
  }, [newUser, add]);

  const onChangeHandler = (e) => {
    e.preventDefault();
    const { name, value: newValue } = e.target;
    setNewUser({ ...newUser, [name]: newValue });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setAdd(true);
  };

  const navigate = useNavigate();
  const onBackHandler = () => {
    navigate("/");
  };

  return (
    <div>
      <AuthForm
        user={newUser}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
        goBack={onBackHandler}
      />
    </div>
  );
};

export default AuthRegister;
