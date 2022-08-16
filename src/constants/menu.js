import { getCurrentUser, setCurrentUser } from "./../helpers/Utils";
import { getCurrentUserPermissions } from "./../helpers/Utils";
import { logoutUser } from "redux/actions";

import adminMenu from "./adminMenu";
import userMenu from "./userMenu";

const menu = () => {
  let data = [];

  // if (getCurrentUser()?.user?.is_root) {
  data = adminMenu;
  // } else if (getCurrentUser()?.is_user) {
  // data = userMenu;
  // }

  const permissions = getCurrentUserPermissions();

  if (permissions === "*") return data;
  else {
    const response = [];
    data.map(i => {
      if (i.subs && i.subs.length) {
        const responseSub = [];
        i.subs.map(sub => {
          const exists = permissions?.find(p => p.module.key === sub.key);
          if (exists) responseSub.push(sub);
        });

        i.subs = responseSub;
        if (i.subs.length > 0) response.push(i);
      } else {
        const exists = permissions?.find(p => p.module.key === i.key);
        if (exists) response.push(i);
      }
    });

    if (response.length <= 0) {
      logoutUser();
      setCurrentUser(null);
      window.location.href = "/usuario";
    }
    return response;
  }

  return response;
};

export default menu;
