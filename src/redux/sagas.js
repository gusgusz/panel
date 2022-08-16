import { all } from "redux-saga/effects";
import authSagas from "./auth/saga";

// import userSagas from "./user/saga";
// import profileSagas from "./profile/saga";
// import moduleSagas from "./module/saga";
// import operationSagas from "./operation/saga";

export default function* rootSaga() {
  yield all([authSagas() /*userSagas(), profileSagas(), moduleSagas(), operationSagas()*/]);
}
