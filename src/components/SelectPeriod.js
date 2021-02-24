import React from "react"
import { connect } from "react-redux"

import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"

import dayjs from "dayjs"

import { selectPeriod } from "../reducers/cloudReducer"

import { useTranslation } from "react-i18next"

const SelectPeriod = (props) => {
  const { t } = useTranslation("selectPeriod")

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel>{t("period")}</InputLabel>
      <Select
        fullWidth
        value={props.period}
        onChange={(event) => props.selectPeriod(event.target.value)}
      >
        {props.periods.map((p) => (
          <MenuItem value={p} id={p.alkaa}>
            {dayjs(p.alkaa).format("DD.MM.YYYY") +
              " " +
              dayjs(p.loppuu).format("DD.MM.YYYY")}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const mapStateToProps = (state) => {
  return {
    period: state.cloud ? state.cloud.period : null,
    periods: state.cloud && state.cloud.init ? state.cloud.init.tilikaudet : [],
  }
}

export default connect(mapStateToProps, { selectPeriod })(SelectPeriod)
