const LoginForm = ({ user, onChange, onSubmit, goBack }) => {
  //add isLogin flag for AuthForm input to toggle off some inputs
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label> Username</label>
          <br />
          <input
            type="username"
            value={user.username}
            onChange={onChange}
            name="username"
            placeholder="username"
            required
          />
        </div>
        <div>
          <label> Password</label>
          <br />
          <input
            type="password"
            value={user.password}
            onChange={onChange}
            name="password"
            placeholder="password"
            required
          />
        </div>
        <br />
        <div>
          <button type="submit" onSubmit={onSubmit}>
            Submit
          </button>
        </div>
        <br />
      </form>
      <div>
        <button type="button" onClick={goBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
