import React from "react"
import { useTranslation } from "react-i18next"
import { inLanguage } from "../utils/languageUtils"

const LanguageField = ({ text }) => {
  const { i18n } = useTranslation()

  return <div>{inLanguage(text, i18n.language)}</div>
}

export default LanguageField
