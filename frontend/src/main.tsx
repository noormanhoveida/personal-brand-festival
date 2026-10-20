import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { App } from "./App";
import "./index.css";

// Apply the persisted theme before first paint to avoid a flash of the
// wrong theme.
document.documentElement.setAttribute("data-theme", store.getState().theme.current);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
