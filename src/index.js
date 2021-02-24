import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./components/App"

import store from "./store"
import { Provider } from "react-redux"
import { SnackbarProvider } from "notistack"

import { I18nextProvider } from "react-i18next"
import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import translation_fi from "./translations/fi.json"

i18next.use(LanguageDetector).init({
  fallbackLng: "fi",
  resources: {
    fi: translation_fi,
  },
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)
