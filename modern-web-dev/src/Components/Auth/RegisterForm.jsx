const AuthForm = ({ user, onChange, onSubmit, goBack }) => {
  //add isLogin flag for AuthForm input to toggle off some inputs
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label> First Name</label>
          <br />
          <input
            type="text"
            value={user.firstName}
            onChange={onChange}
            name="firstName"
            placeholder="first name"
            required
          />
        </div>
        <div>
          <label> Last Name</label>
          <br />
          <input
            type="text"
            value={user.lastName}
            onChange={onChange}
            name="lastName"
            placeholder="last name"
            required
          />
        </div>
        <div>
          <label> Email</label>
          <br />
          <input
            type="email"
            value={user.email}
            onChange={onChange}
            name="email"
            placeholder="email"
            required
          />
        </div>
        <div>
          <label> Password</label>
          <br />
          <input
            type="text"
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

export default AuthForm;
