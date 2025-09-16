import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import api from "services/api";
import { adminRoot, currentUser } from "constants/defaultValues";
import { setCurrentUser } from "helpers/Utils";
import { LOGIN_USER, REGISTER_USER, LOGOUT_USER, FORGOT_PASSWORD, RESET_PASSWORD } from "../actions";

import {
  loginUserSuccess,
  loginUserError,
  registerUserSuccess,
  registerUserError,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordSuccess,
  resetPasswordError,
} from "./actions";

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const loginWithEmailPasswordAsync = async (email, password) => {
  try {
    const { data } = await api.post("/people/login", { email, password });

    return data;
  } catch (error) {
    console.log("Erro ao realziar login => ", error);
    if (error?.response?.data[0]?.message === "Invalid user password") {
      return { error: true, message: "Usuário ou senha inválidos" };
    } else if (error?.response?.data[0]?.message === "unverified account") {
      return { error: true, message: "Sua conta ainda não foi verificada", type: "unverifiedAccount" };
    } else {
      return { error: true, message: "Ocorreu um erro ao tentar realizar login! Tente novamente" };
    }
  }
};

function* loginWithEmailPassword({ payload }) {
  const { email, password } = payload.user;
  const { history } = payload;
  try {
    const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
    if (loginUser && !loginUser.error) {
      if (loginUser.token) {
        const item = { uid: loginUser.user.id, ...loginUser };
        setCurrentUser(item);
        yield put(loginUserSuccess(item));
        history.push("/app");
      } else {
        yield put(loginUserError(loginUser));
      }
    } else {
      yield put(loginUserError(loginUser));
    }
  } catch (error) {
    yield put(loginUserError(error));
  }
}

export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

const registerWithEmailPasswordAsync = async (email, password) => {
  // await auth
  //   .createUserWithEmailAndPassword(email, password)
  //   .then(user => user)
  //   .catch(error => error);
};

function* registerWithEmailPassword({ payload }) {
  const { email, password } = payload.user;
  const { history } = payload;
  try {
    const registerUser = yield call(registerWithEmailPasswordAsync, email, password);
    if (!registerUser.message) {
      const item = { uid: registerUser.user.uid, ...currentUser };
      setCurrentUser(item);
      yield put(registerUserSuccess(item));
      history.push("/app");
    } else {
      yield put(registerUserError(registerUser));
    }
  } catch (error) {
    yield put(registerUserError(error));
  }
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async history => {
  // await auth
  //   .signOut()
  //   .then(user => user)
  //   .catch(error => error);
  document.location.href = "/usuario";
  // history.push("/usuario");
};

function* logout({ payload }) {
  const { history } = payload;
  setCurrentUser();
  yield call(logoutAsync, history);
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async email => {
  // return await auth
  //   .sendPasswordResetEmail(email)
  //   .then(user => user)
  //   .catch(error => error);
};

function* forgotPassword({ payload }) {
  const { email } = payload.forgotUserMail;
  try {
    const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
    if (!forgotPasswordStatus) {
      yield put(forgotPasswordSuccess("success"));
    } else {
      yield put(forgotPasswordError(forgotPasswordStatus.message));
    }
  } catch (error) {
    yield put(forgotPasswordError(error));
  }
}

export function* watchResetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
  // return await auth
  //   .confirmPasswordReset(resetPasswordCode, newPassword)
  //   .then(user => user)
  //   .catch(error => error);
};

function* resetPassword({ payload }) {
  const { newPassword, resetPasswordCode } = payload;
  try {
    const resetPasswordStatus = yield call(resetPasswordAsync, resetPasswordCode, newPassword);
    if (!resetPasswordStatus) {
      yield put(resetPasswordSuccess("success"));
    } else {
      yield put(resetPasswordError(resetPasswordStatus.message));
    }
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

export default function* rootSaga() {
  yield all([fork(watchLoginUser), fork(watchLogoutUser), fork(watchRegisterUser), fork(watchForgotPassword), fork(watchResetPassword)]);
}
