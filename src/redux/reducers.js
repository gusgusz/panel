import { combineReducers } from "redux";
import settings from "./settings/reducer";
import menu from "./menu/reducer";
import authUser from "./auth/reducer";

// import users from "./user/reducer";
// import profiles from "./profile/reducer";
// import modules from "./module/reducer";
// import operations from "./operation/reducer";

const reducers = combineReducers({
  menu,
  settings,
  authUser,
  // users,
  // profiles,
  // modules,
  // operations,
});

export default reducers;
