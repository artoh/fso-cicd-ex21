export const inLanguage = (field, language) => {
  if (!field) {
    return ""
  }
  const lang = language && language.substring(0, 2)

  if (language && field[lang]) {
    return field[lang]
  }
  if (field["fi"]) {
    return field["fi"]
  }
  if (field.values && field.values[0]) {
    return field.values[0]
  }
  return ""
}
