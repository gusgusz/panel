import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "./redux/store";

const App = React.lazy(() => import(/* webpackChunkName: "App" */ "./App"));

const Main = () => {
  return (
    <Provider store={configureStore()}>
      <Suspense fallback={<div />}>
        <App />
      </Suspense>
    </Provider>
  );
};

ReactDOM.render(<Main />, document.getElementById("root"));
