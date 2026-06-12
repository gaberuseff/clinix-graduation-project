import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import * as Sentry from "@sentry/react";
import "./i18n";

// Sentry.init({
//   dsn: "https://c574157015841ac9822ecdc055f9ffd6@o4510735390736384.ingest.de.sentry.io/4511474199363664",
//   // Setting this option to true will send default PII data to Sentry.
//   // For example, automatic IP address collection on events
//   sendDefaultPii: true,
// });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
