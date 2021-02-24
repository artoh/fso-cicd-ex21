import React from "react"
import { connect } from "react-redux"

import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"

import { selectSector } from "../reducers/cloudReducer"

import { useTranslation } from "react-i18next"
import { inLanguage } from "../utils/languageUtils"
import LanguageField from "./LanguageField"

const SelectSector = (props) => {
  const { t, i18n } = useTranslation("selectSector")
  const filtered = props.sectors.filter(
    (e) =>
      props.period &&
      !(e.alkaa > props.period.loppuu) &&
      !(e.paattyy < props.period.alkaa)
  )
  const language = i18n.language.substring(0, 2) ? i18n.language : "fi"

  filtered.sort((a, b) =>
    a.nimi && b.nimi
      ? inLanguage(a.nimi, language).localeCompare(inLanguage(b.nimi, language))
      : 0
  )

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel>{t("sector")}</InputLabel>
      <Select
        fullWidth
        value={props.sector}
        onChange={(event) => props.selectSector(event.target.value)}
      >
        <MenuItem value={-1} key={-1}>
          {t("allsectors")}
        </MenuItem>
        {filtered.map((p) => (
          <MenuItem value={p.id} key={p.id}>
            <LanguageField text={p.nimi} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const mapStateToProps = (state) => {
  return {
    period: state.cloud ? state.cloud.period : null,
    sector: state.cloud ? state.cloud.sector : -1,
    sectors:
      state.cloud && state.cloud.init ? state.cloud.init.kohdennukset : [],
  }
}

export default connect(mapStateToProps, { selectSector })(SelectSector)
