import React from "react"
import { connect } from "react-redux"

import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"

import SendIcon from "@material-ui/icons/Send"
import CheckIcon from "@material-ui/icons/Check"
import DoneAllIcon from "@material-ui/icons/DoneAll"
import CloseIcon from "@material-ui/icons/Close"
import SaveAltIcon from "@material-ui/icons/SaveAlt"
import DoneOutlineIcon from "@material-ui/icons/DoneOutline"

import { useTranslation } from "react-i18next"
import Defines from "../defines"

import { makeDocument } from "../utils/makeDocument"
import { resetNewVoucher } from "../reducers/newVoucherReducer"
import { reload } from "../reducers/cloudReducer"
import { useHistory } from "react-router-dom"
import { saveDocument } from "../services/cloudService"

import { GreenButton, YellowButton, BlueButton } from "./colorbuttons"

import { useSnackbar } from "notistack"
import dayjs from "dayjs"

const NewVoucherButtons = (props) => {
  const { t } = useTranslation("newVoucherButtons")
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  const cancel = () => {
    props.resetNewVoucher()
    history.goBack()
  }

  const closeDaySetting = props.settings["TilitPaatetty"]
  const closeDay = closeDaySetting
    ? dayjs(closeDaySetting).add(1, "day")
    : dayjs("2020-01-01")
  const lastPeriod = props.periods[props.periods.length - 1]
  const maxDay = dayjs(lastPeriod.loppuu)
  const currentDay = dayjs(props.voucher.date)

  const dayInvalid =
    !currentDay.isValid() ||
    currentDay.isBefore(closeDay) ||
    currentDay.isAfter(maxDay)

  console.log("DI", props.voucher.date, closeDay, dayInvalid)

  const saveVoucher = async (status) => {
    const back = props.voucher.old.id ? -2 : -1
    const document = makeDocument(
      props.voucher,
      props.attachemnts,
      status,
      props.accounts
    )

    try {
      await saveDocument(document)
      enqueueSnackbar(t("saved"), { variant: "success" })
      props.resetNewVoucher()
      props.reload()
      history.go(back)
    } catch (e) {
      console.error(e)
      enqueueSnackbar(t("savefailed"), { variant: "error" })
    }
  }

  const oldStatus = props.voucher.old.tila ? props.voucher.old.tila : 0

  return (
    <Paper>
      <Container maxWidth="xl">
        <Grid container spacing={2} justify="space-between">
          <div>
            <Button
              variant="contained"
              color="secondary"
              style={{ margin: "1em" }}
              startIcon={<CloseIcon />}
              onClick={() => cancel()}
            >
              {t("cancel")}
            </Button>
            {(props.cycle === 0 ||
              oldStatus === Defines.VoucherStatus.Accepted) &&
              props.rights.includes("Tl") && (
            // eslint-disable-next-line indent
                <Button
                variant="outlined"
                style={{ margin: "1em" }}
                disabled={dayInvalid}
                startIcon={<SaveAltIcon />}
                onClick={() => saveVoucher(Defines.VoucherStatus.Draft)}
              >
                {t("draft")}
              </Button>
            )}
          </div>
          <div>
            {props.cycle > 0 &&
              props.rights.includes("Kl") &&
              oldStatus < Defines.VoucherStatus.Received && (
              <BlueButton
                color="primary"
                variant="contained"
                style={{ margin: "1em" }}
                disabled={dayInvalid}
                startIcon={<SendIcon />}
                onClick={() => saveVoucher(Defines.VoucherStatus.Received)}
              >
                {t("cycle")}
              </BlueButton>
            )}

            {props.cycle > 0 &&
              props.rights.includes("Kt") &&
              oldStatus < Defines.VoucherStatus.Checked && (
              <YellowButton
                variant="contained"
                style={{
                  margin: "1em",
                }}
                color="secondary"
                startIcon={<CheckIcon />}
                disabled={dayInvalid}
                onClick={() => saveVoucher(Defines.VoucherStatus.Checked)}
              >
                {t("check")}
              </YellowButton>
            )}
            {props.cycle > 0 &&
              props.rights.includes("Kh") &&
              oldStatus < Defines.VoucherStatus.Accepted && (
              <GreenButton
                variant="contained"
                disabled={dayInvalid}
                startIcon={<DoneAllIcon />}
                onClick={() => saveVoucher(Defines.VoucherStatus.Accepted)}
              >
                {t("accept")}
              </GreenButton>
            )}
            {props.rights.includes("Tt") && (
              <GreenButton
                variant="contained"
                style={{
                  margin: "1em",
                }}
                disabled={dayInvalid}
                startIcon={<DoneOutlineIcon />}
                onClick={() => saveVoucher(Defines.VoucherStatus.Booked)}
              >
                {t("save")}
              </GreenButton>
            )}
          </div>
        </Grid>
      </Container>
    </Paper>
  )
}

const mapStateToProps = (state) => {
  return {
    voucher: state.newVoucher,
    type: state.newVoucher.type,
    cycle: state.newVoucher.cycle,
    rights: state.cloud.current.rights,
    accounts: state.cloud.init.tilit,
    attachemnts: state.attachments,
    settings: state.cloud.init.asetukset,
    periods: state.cloud.init.tilikaudet,
  }
}

export default connect(mapStateToProps, { resetNewVoucher, reload })(
  NewVoucherButtons
)
