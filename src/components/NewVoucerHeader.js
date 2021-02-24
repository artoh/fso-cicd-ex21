import React, { useEffect, useState } from "react"
import { connect } from "react-redux"

import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"

import FormControl from "@material-ui/core/FormControl"
import Container from "@material-ui/core/Container"
import TextField from "@material-ui/core/TextField"

import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"
import Autocomplete from "@material-ui/lab/Autocomplete"

import { useTranslation } from "react-i18next"
import { setField } from "../reducers/newVoucherReducer"

import DateFnsUtils from "@date-io/date-fns"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers"

import Defines from "../defines"
import { getPartnerNames } from "../services/cloudService"

import dayjs from "dayjs"

const NewVoucherHeader = (props) => {
  const { t } = useTranslation("newVoucherHeader")

  let maksutavat = []
  const haettu = JSON.parse(
    props.settings[
      props.newVoucher.type === Defines.VoucherType.Income
        ? "maksutavat+"
        : "maksutavat-"
    ]
  )
  let maksutilit = []
  haettu.forEach((t) => {
    if (!maksutilit.includes(t.TILI)) {
      maksutilit.push(t.TILI)
      maksutavat.push(t)
    }
  })

  const setCycle = (cyckle) => {
    props.setField("cycle", cyckle)
    const selected = props.cycles.find((e) => e.id === cyckle)
    if (selected && selected.type) {
      props.setField("type", selected.type)
    }
    if (selected && selected.vastatili) {
      props.setField("contraAccount", selected.vastatili)
    }

    if (
      selected &&
      selected.tili &&
      props.newVoucher.rows[0] &&
      props.newVoucher.rows[0].euro === 0
    ) {
      const rows = props.newVoucher.rows
      rows[0].account = selected.tili
      props.setField("rows", rows)
    }
  }

  const setType = (type) => {
    props.setField("type", type)
    if (props.newVoucher.rows[0] && props.newVoucher.rows[0].euro === 0.0) {
      const rows = props.newVoucher.rows
      const account =
        type === Defines.VoucherType.Income
          ? parseInt(props.settings["OletusMyyntitili"])
          : parseInt(props.settings["OletusMenotili"])
      rows[0].account = account
      console.log(rows)
      props.setField("rows", rows)
    }
  }

  const [partners, setPartners] = useState([])

  useEffect(() => {
    const fetch = async () => {
      setPartners(await getPartnerNames())
    }
    fetch()
  }, [props.updated])

  const closeDaySetting = props.settings["TilitPaatetty"]
  const closeDay = closeDaySetting
    ? dayjs(closeDaySetting).add(1, "day")
    : dayjs("2020-01-01")

  const lastPeriod = props.periods[props.periods.length - 1]
  const maxDay = dayjs(lastPeriod.loppuu)

  console.log("max", maxDay)

  return (
    <Paper>
      <Container text maxWidth="xl">
        <Grid container alignItems="center" spacing={1}>
          <Grid item lg={3} sm={6} xs={12}>
            <FormControl fullWidth>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd.MM.yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label={t("date")}
                  inputVariant="outlined"
                  value={props.newVoucher.date}
                  onChange={(e) => {
                    props.setField("date", e)
                    props.setField("invoicedate", e)
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  minDate={closeDay}
                  minDateMessage={t("mindate", {
                    date: closeDay.add(-1, "days").format("DD.MM.YYYY"),
                  })}
                  maxDate={maxDay}
                  maxDateMessage={t("maxdate", {
                    date: maxDay.format("DD.MM.YYYY"),
                  })}
                  invalidDateMessage={t("invalidDate")}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="cycleLabel">{t("cycle")}</InputLabel>
              <Select
                labelId="cycleLabel"
                value={props.newVoucher.cycle}
                onChange={(e) => setCycle(e.target.value)}
              >
                <MenuItem value={0}>{t("nocycle")}</MenuItem>
                {props.cycles.map((c) => (
                  <MenuItem value={c.id} key={c.id}>
                    {c.nimi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="typeLabel">{t("type")}</InputLabel>
              <Select
                labelId="typeLabel"
                value={props.newVoucher.type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value={Defines.VoucherType.Outcome}>
                  {t("outcome")}
                </MenuItem>
                <MenuItem value={Defines.VoucherType.Expences}>
                  {t("expences")}
                </MenuItem>
                <MenuItem value={Defines.VoucherType.Income}>
                  {t("income")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="paymethodLabel">{t("paymethod")}</InputLabel>
              <Select
                labelId="paymethodLabel"
                value={props.newVoucher.contraAccount}
                onChange={(e) =>
                  props.setField("contraAccount", e.target.value)
                }
              >
                {maksutavat.map((m) => (
                  <MenuItem value={m.TILI} key={m.TILI}>
                    {m.fi}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item lg={6} xs={12}>
            <Autocomplete
              freeSolo
              disableClearable
              options={partners}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={
                    props.newVoucher.type === Defines.VoucherType.Income
                      ? t("customer")
                      : props.newVoucher.type === Defines.VoucherType.Expences
                      ? t("invoicer")
                      : t("seller")
                  }
                  variant="outlined"
                  value={props.newVoucher.partner}
                  onChange={(e) => props.setField("partner", e.target.value)}
                  InputProps={{ ...params.InputProps, type: "search" }}
                />
              )}
            />
          </Grid>
          <Grid item lg={6} xs={12}>
            <TextField
              fullWidth
              label={t("subject")}
              variant="outlined"
              value={props.newVoucher.subject}
              onChange={(e) => props.setField("subject", e.target.value)}
            />
          </Grid>
        </Grid>
      </Container>
    </Paper>
  )
}

const mapStateToProps = (state) => {
  return {
    cycles: state.cloud && state.cloud.init ? state.cloud.init.kierrot : [],
    settings: state.cloud && state.cloud.init ? state.cloud.init.asetukset : [],
    newVoucher: state.newVoucher,
    updated: state.cloud ? state.cloud.updated : null,
    periods: state.cloud.init.tilikaudet,
  }
}

export default connect(mapStateToProps, { setField })(NewVoucherHeader)
