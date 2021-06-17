import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";
import AuthContext from "../../store/auth-context";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
const emailReducer = (state, action) => {
  switch (action.type) {
    case "EMAIL_INPUT":
      return { email: action.val, isValid: action.val.includes("@") };
    case "INPUT_BLUR":
      return { email: state.email, isValid: state.email.includes("@") };
    default:
      return { email: "", isValid: false };
  }
};

const passwordReducer = (state, action) => {
  switch (action.type) {
    case "PASSWORD_INPUT":
      return { password: action.val, isValid: action.val.length > 6 };
    case "INPUT_BLUR":
      return { password: state.password, isValid: state.password.length > 6 };
    default:
      return { password: "", isValid: false };
  }
};

const Login = (props) => {
  const ctx = useContext(AuthContext);
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    email: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    password: "",
    isValid: null,
  });
  const { isValid: isEmailvalid } = emailState;
  const { isValid: isPasswordValid } = passwordState;
  useEffect(() => {
    const identifier = setTimeout(() => {
      // key debounce
      setFormIsValid(isEmailvalid && isPasswordValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [isEmailvalid, isPasswordValid]);
  const emailRefHandler = useRef();
  const passwordRefHandler = useRef();
  const emailChangeHandler = (event) => {
    dispatchEmail({ val: event.target.value, type: "EMAIL_INPUT" });
    // setFormIsValid(emailState.isValid && passwordState.val.trim().length > 6);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ val: event.target.value, type: "PASSWORD_INPUT" });
    // setFormIsValid(emailState.isValid && passwordState.val.length > 6);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) ctx.onLogin(emailState.val, passwordState.val);
    else if (!isEmailvalid) {
      emailRefHandler.current.focus();
    } else {
      passwordRefHandler.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRefHandler}
          isValid={emailState.isValid}
          label="E-Mail"
          type="email"
          id="email"
          value={emailState.val}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordRefHandler}
          isValid={passwordState.isValid}
          label="Password"
          type="password"
          id="password"
          value={passwordState.val}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
