import React from "react"
import { connect } from "react-redux"

import Container from "@material-ui/core/Container"
import { useTranslation } from "react-i18next"

import TextField from "@material-ui/core/TextField"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"

import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import Checkbox from "@material-ui/core/Checkbox"

import DateFnsUtils from "@date-io/date-fns"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers"

import { setField } from "../reducers/newVoucherReducer"

const InvoiceExtra = ({ voucher, setField }) => {
  const { t } = useTranslation("invoiceExtra")

  return (
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
              label={t("invoicedate")}
              inputVariant="outlined"
              value={voucher.invoicedate}
              onChange={(e) => setField("invoicedate", e)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              invalidDateMessage={t("invalidDate")}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <FormControl fullWidth>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd.MM.yyyy"
              margin="normal"
              id="date-picker-inline"
              label={t("duedate")}
              inputVariant="outlined"
              value={voucher.duedate}
              onChange={(e) => setField("duedate", e)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              invalidDateMessage={t("invalidDate")}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <TextField
          label={t("invoicenr")}
          variant="outlined"
          fullWidth
          value={voucher.invoicenr}
          onChange={(e) => setField("invoicenr", e.target.value)}
        />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <TextField
          label={t("ref")}
          variant="outlined"
          fullWidth
          value={voucher.ref}
          onChange={(e) => setField("ref", e.target.value)}
        />
      </Grid>
    </Grid>
  )
}

const NewVoucherExtras = (props) => {
  const contraAccount = props.accounts.find(
    (a) => a.numero === props.newVoucher.contraAccount
  )
  const invoice =
    contraAccount &&
    (contraAccount.tyyppi === "AO" || contraAccount.tyyppi === "BO")

  const { t } = useTranslation("newVoucherExtras")

  return (
    <Paper>
      <Container maxWidth="xl" text>
        {invoice && (
          <InvoiceExtra voucher={props.newVoucher} setField={props.setField} />
        )}
        <Grid container spacing={1}>
          <Grid item lg={5} xs={12}>
            <TextField
              label={t("info")}
              variant="outlined"
              value={props.newVoucher.info}
              onChange={(e) => props.setField("info", e.target.value)}
              multiline
              fullWidth
            />
          </Grid>
          <Grid item lg={5} sm={8} xs={12}>
            <TextField
              label={t("comment")}
              variant="outlined"
              multiline
              fullWidth
              value={props.newVoucher.comment}
              onChange={(e) => props.setField("comment", e.target.value)}
            />
          </Grid>
          <Grid item lg={2} sm={4} xs={12}>
            <FormControlLabel
              control={<Checkbox name="checkedA" />}
              label={t("mark")}
              checked={props.newVoucher.mark}
              onChange={(e) => props.setField("mark", e.target.checked)}
            />
          </Grid>
        </Grid>
      </Container>
    </Paper>
  )
}

const mapStateToProps = (state) => {
  return {
    newVoucher: state.newVoucher,
    accounts: state.cloud.init.tilit,
  }
}

export default connect(mapStateToProps, { setField })(NewVoucherExtras)
