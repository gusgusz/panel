import { defaultDirection, defaultLocale, defaultColor, localeOptions, themeColorStorageKey, themeRadiusStorageKey } from "constants/defaultValues";

export const mapOrder = (array, order, key) => {
  array.sort(function (a, b) {
    const A = a[key];
    const B = b[key];
    if (order.indexOf(`${A}`) > order.indexOf(`${B}`)) {
      return 1;
    }
    return -1;
  });
  return array;
};

export const getDateWithFormat = () => {
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; // January is 0!

  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${dd}.${mm}.${yyyy}`;
};

export const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`;
};

export const getDirection = () => {
  let direction = defaultDirection;

  try {
    if (localStorage.getItem("direction")) {
      const localValue = localStorage.getItem("direction");
      if (localValue === "rtl" || localValue === "ltr") {
        direction = localValue;
      }
    }
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : getDirection -> error", error);
    direction = defaultDirection;
  }
  return {
    direction,
    isRtl: direction === "rtl",
  };
};

export const setDirection = localValue => {
  let direction = "ltr";
  if (localValue === "rtl" || localValue === "ltr") {
    direction = localValue;
  }
  try {
    localStorage.setItem("direction", direction);
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setDirection -> error", error);
  }
};

export const getCurrentColor = () => {
  let currentColor = defaultColor;
  try {
    if (localStorage.getItem(themeColorStorageKey)) {
      currentColor = localStorage.getItem(themeColorStorageKey);
    }
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : getCurrentColor -> error", error);
    currentColor = defaultColor;
  }
  return currentColor;
};

export const setCurrentColor = color => {
  try {
    localStorage.setItem(themeColorStorageKey, color);
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setCurrentColor -> error", error);
  }
};

export const getCurrentRadius = () => {
  let currentRadius = "rounded";
  try {
    if (localStorage.getItem(themeRadiusStorageKey)) {
      currentRadius = localStorage.getItem(themeRadiusStorageKey);
    }
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : getCurrentRadius -> error", error);
    currentRadius = "rounded";
  }
  return currentRadius;
};

export const setCurrentRadius = radius => {
  try {
    localStorage.setItem(themeRadiusStorageKey, radius);
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setCurrentRadius -> error", error);
  }
};

export const getCurrentLanguage = () => {
  let language = defaultLocale;
  try {
    language =
      localStorage.getItem("currentLanguage") && localeOptions.filter(x => x.id === localStorage.getItem("currentLanguage")).length > 0
        ? localStorage.getItem("currentLanguage")
        : defaultLocale;
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : getCurrentLanguage -> error", error);
    language = defaultLocale;
  }
  return language;
};

export const setCurrentLanguage = locale => {
  try {
    localStorage.setItem("currentLanguage", locale);
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setCurrentLanguage -> error", error);
  }
};

export const getCurrentUser = () => {
  let user = null;
  try {
    user = localStorage.getItem("@onsite_current_user") != null ? JSON.parse(localStorage.getItem("@onsite_current_user")) : null;
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js  : getCurrentUser -> error", error);
    user = null;
  }
  return user;
};

export const getCurrentUserToken = () => {
  let user = null;
  try {
    user = localStorage.getItem("@onsite_current_user") != null ? JSON.parse(localStorage.getItem("@onsite_current_user")) : null;

    return user?.token ?? "";
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js  : getCurrentUser -> error", error);
    user = null;
  }
  return user;
};

export const setCurrentUser = user => {
  try {
    if (user) {
      localStorage.setItem("@onsite_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("@onsite_current_user");
    }
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setCurrentUser -> error", error);
  }
};

export const getInitialsName = (name, custom) => {
  if (name) {
    let initials = name.split(" ");

    if (initials.length > 1) {
      if (custom) {
        initials = `${initials.shift().charAt(0)}. ` + initials.pop();
      } else {
        initials = initials.shift().charAt(0) + initials.pop().charAt(0);
      }
    } else {
      initials = name.substring(0, 2);
    }

    return initials.toUpperCase();
  } else {
    return "UA";
  }
};

export const getCurrentUserPermissions = () => {
  let user = null;
  try {
    user = localStorage.getItem("@onsite_current_user");

    if (user) {
      user = JSON.parse(localStorage.getItem("@onsite_current_user"));

      if (user.user.is_root) return "*";
      else {
        return JSON.parse(atob(user.permissions ?? ""));
      }
    }
  } catch (error) {
    user = null;
  }
  return null;
};

/*** funcoes de renderização baseado nas permissões */
export const renderButtonsPermission = (module_key, operation_key, children, childrenAlt = <></>) => {
  const permissions = getCurrentUserPermissions();

  if (permissions) {
    if (permissions === "*") return children;
    else {
      const exists = permissions?.find(p => p.module.key === module_key && p.operation.key === operation_key);

      if (exists) return children;
      else return childrenAlt;
    }
  } else return childrenAlt;
};

export const permissionByModule = module_key => {
  const permissions = getCurrentUserPermissions();
  if (permissions === "*") return true;
  const exists = permissions?.find(p => p.module.key === module_key);

  if (exists) return true;
  else return false;
};

const permissionByMenu = menuItems => {
  const permissions = getCurrentUserPermissions();
  if (permissions === "*") return data;
  else {
    const response = [];
    menuItems.map(i => {
      const exists = permissions?.find(p => p.module.key === i.key);
      if (exists) response.push(i);
    });

    return response;
  }
};
