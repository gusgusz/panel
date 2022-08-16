import React from "react";
import api from "services/api";

export const SettingsContext = React.createContext({});

export const SettingsProvider = props => {
  const [settings, setSettings] = React.useState({});

  const loadLocal = () => {
    const data = localStorage.getItem("@onsite_current_settings");
    if (data) setSettings(JSON.parse(data));

    api
      .get(`/configurations`)
      .then(response => {
        setSettings(response.data);
        localStorage.setItem("@onsite_current_settings", JSON.stringify(response.data));
      })
      .catch(error => {
        localStorage.removeItem("@onsite_current_settings");
      });
  };

  React.useEffect(() => {
    loadLocal();
  }, []);

  return <SettingsContext.Provider value={{ ...settings }}>{props.children}</SettingsContext.Provider>;
};

export const useSettings = () => React.useContext(SettingsContext);
