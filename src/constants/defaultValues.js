export const UserRole = {
  Admin: 0,
  Editor: 1,
};

export const Operations = {
  SHOW: "show",
  UPDATE: "update",
  DESTROY: "destroy",
  LIST: "list",
  STORE: "store",
};

// TODO: quando trocar de url alterar
export const form_public_link = "http://137.184.159.51/f/";
/*
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = "menu-default";

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = "pt";
export const localeOptions = [
  { id: "pt", name: "Português Brasil", direction: "ltr" },
  // { id: "en", name: "English", direction: "ltr" },
  // { id: "es", name: "Español", direction: "ltr" },
  // { id: "enrtl", name: "English - RTL", direction: "rtl" },
];

export const firebaseConfig = {
  apiKey: "AIzaSyBBksq-Asxq2M4Ot-75X19IyrEYJqNBPcg",
  authDomain: "gogo-react-login.firebaseapp.com",
  databaseURL: "https://gogo-react-login.firebaseio.com",
  projectId: "gogo-react-login",
  storageBucket: "gogo-react-login.appspot.com",
  messagingSenderId: "216495999563",
};

export const currentUser = {
  id: 1,
  title: "Jackiê Macklein",
  img: "/assets/img/profiles/l-1.jpg",
  date: "Last seen today 15:24",
  role: UserRole.Admin,
};

export const msgDangerInvoice = `<span className="text-danger">Atenção!</span> As notas podem levar até uma hora para serem listados. Por favor, aguarde.`;

export const appNameFooter = "Onside Tecnologia";
export const adminRoot = "/app";
export const buyUrl = "";
export const searchPath = `${adminRoot}/pages/miscellaneous/search`;
export const showSearchPath = false;
export const showFullScreen = false;
export const showTopnavEasyAccess = false;
export const showTopnavNotifications = false;
export const servicePath = "";

export const themeColorStorageKey = "__theme_selected_color";
export const isMultiColorActive = true;
export const defaultColor = "light.yellowgranola";
export const isDarkSwitchActive = false;
export const defaultDirection = "ltr";
export const themeRadiusStorageKey = "__theme_radius";
export const isAuthGuardActive = true;
export const colors = [
  "bluenavy",
  "blueyale",
  "blueolympic",
  "greenmoss",
  "greenlime",
  "purplemonster",
  "orangecarrot",
  "redruby",
  "yellowgranola",
  "greysteel",
  "unicus",
];

export const protocolHttp = [
  {
    value: "https",
    label: "HTTPS",
  },
  {
    value: "http",
    label: "HTTP",
  },
];

/** tipos de pessoa */
export const typesPerson = [
  {
    value: "PF",
    label: "Pessoa Física",
  },
  {
    value: "PJ",
    label: "Pessoa Jurídica",
  },
];

/** estado civil */
export const maritalStates = [
  {
    value: "SINGLE",
    label: "Solteiro",
  },
  { value: "MARRIED", label: "Casado" },
  { value: "WIDOWER", label: "Viúvo" },
  { value: "DISCHARGED", label: "Separado" },
  { value: "DIVORCED", label: "Divorciado" },
];

export const caseTypes = [
  { value: "CONCILIATION", label: "Conciliação" },
  { value: "MEDIATION-ONLINE", label: "Mediação Online" },
  { value: "MEDIATION-OFFILINE", label: "Mediação Presencial" },
  { value: "ARBITRATION", label: "Arbitragem" },
];

export const caseStatus = [
  { value: "PENDING", label: "Em análise" },
  { value: "ACCEPTED", label: "Em Processo de Comunicação" },
  { value: "REFUSED", label: "Recusado" },
];

export const communicationTypes = [
  { value: "INVITE", label: "Convite de Participação no Caso" },
  { value: "OTHERS", label: "Assuntos gerais" },
];

export const caseStatusName = status => {
  try {
    return caseStatus.find(i => i.value === status)?.label;
  } catch {
    return "Em análise";
  }
};
export const caseTypeName = type => {
  try {
    return caseTypes.find(i => i.value === type).label;
  } catch {
    return "-";
  }
};
export const communicationTypeName = type => {
  try {
    return communicationTypes.find(i => i.value === type).label;
  } catch {
    return "-";
  }
};
