import Amplify, { Auth } from "aws-amplify";
import PropTypes from "prop-types";
import { createContext, useEffect, useReducer } from "react";
import { amplifyConfig } from "../config";
import { accountApi } from "../__Api__/accountAPI";
import { companyApi } from "../__Api__/companyApi";
import { S3Api } from "../__Api__/S3";

import { authApi } from "../__Api__/auth";

Amplify.configure(amplifyConfig);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state) => ({ ...state }),
  VERIFY_CODE: (state) => ({ ...state }),
  RESEND_CODE: (state) => ({ ...state }),
  PASSWORD_RECOVERY: (state) => ({ ...state }),
  PASSWORD_RESET: (state) => ({ ...state }),
  UPDATE_AVATAR: (state) => ({ ...state }),
  UPDATE_USER: (state) => ({ ...state }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  platform: "Amplify",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve(),
  updateAvatar: () => Promise.resolve(),
  updateUser: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();

      // Here you should extract the complete user profile to make it
      // available in your entire app.
      // The auth state only provides basic information.

      const myUser = await accountApi.getAccount(
        "9be16cb8-e8c5-4aa8-a8da-f14a2d5bd5ac"
      );

      const myCompany = await companyApi.getCompany(myUser.company_id);
      const singedURL = await S3Api.downloadProfile(myCompany.img_url);

      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: true,
          user: {
            id: user.attributes.sub,
            avatar: singedURL,
            email: user.attributes.email,
            company: myCompany,
            user: myUser,
            bearer: user.signInUserSession.accessToken.jwtToken,
          },
        },
      });
    } catch (error) {
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };

  const updateAvatar = async (user, profile) => {
    const newUser = user;

    newUser.avatar = profile;

    dispatch({
      type: "UPDATE_AVATAR",
      payload: {
        user: newUser,
      },
    });
  };

  const updateUser = async (user, profile) => {
    const newUser = user;

    newUser.user = profile;

    dispatch({
      type: "UPDATE_USER",
      payload: {
        user: newUser,
      },
    });
  };

  const login = async (email, password) => {
    const newEmail = "hello@sergey.fyi";
    const newPassword = "sergeysecretpwd";

    try {
      const Newuser = await authApi.login(newEmail, newPassword);

      const user = await Auth.signIn(email, password);

      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        // const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
        Auth.completeNewPassword(
          user, // the Cognito User Object
          password // the new password
          // OPTIONAL, the required attributes
        )
          .then((user) => {
            // at this time the user is logged in if no MFA required
            login(email, password);
          })
          .catch((e) => {
            console.error(e);
          });
        return;
      }

      if (user.challengeName) {
        console.error(
          `Unable to login, because challenge "${user.challengeName}" is mandated and we did not handle this case.`
        );
        return;
      }

      const myUser = await accountApi.getAccount(
        "9be16cb8-e8c5-4aa8-a8da-f14a2d5bd5ac"
      );

      if (!myUser) {
        console.error(`Unable to login.`);
        return;
      }

      const myCompany = await companyApi.getCompany(myUser.company_id);
      const singedURL = await S3Api.downloadProfile(myCompany.img_url);

      dispatch({
        type: "LOGIN",
        payload: {
          user: {
            id: user.attributes.sub,
            avatar: singedURL,
            email: user.attributes.email,
            company: myCompany,
            user: myUser,
            bearer: Newuser.access_token,
          },
        },
      });
    } catch (error) {
      throw new Error(error)
      return error
    }
  };

  const logout = async () => {
    await Auth.signOut();
    dispatch({
      type: "LOGOUT",
    });
  };

  const register = async (email, password) => {
    await Auth.signUp({
      username: email,
      password,
      attributes: { email },
    });
    dispatch({
      type: "REGISTER",
    });
  };

  const verifyCode = async (username, code) => {
    await Auth.confirmSignUp(username, code);
    dispatch({
      type: "VERIFY_CODE",
    });
  };

  const resendCode = async (username) => {
    await Auth.resendSignUp(username);
    dispatch({
      type: "RESEND_CODE",
    });
  };

  const passwordRecovery = async (username) => {
    await Auth.forgotPassword(username);
    dispatch({
      type: "PASSWORD_RECOVERY",
    });
  };

  const passwordReset = async (username, code, newPassword) => {
    await Auth.forgotPasswordSubmit(username, code, newPassword);
    dispatch({
      type: "PASSWORD_RESET",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "Amplify",
        login,
        logout,
        register,
        verifyCode,
        resendCode,
        passwordRecovery,
        passwordReset,
        updateAvatar,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
