interface Props {
    keyDownFunction: Function,
    aliasSetter: Function,
    passwordSetter: Function
}

const AuthenticationFields = (props: Props) => {
    const registerOrLogin = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter") {
      props.keyDownFunction;
    }
    };
    return (
    <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={registerOrLogin}
            onChange={(event) => (props.aliasSetter(event.target.value))}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            placeholder="Password"
            onKeyDown={registerOrLogin}
            onChange={(event) => (props.passwordSetter(event.target.value))}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
    </>
    )
}

export default AuthenticationFields;