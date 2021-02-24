import { useTranslation } from "react-i18next"

import { connect } from "react-redux"
import { putVoucher } from "../services/cloudService"
import { reload } from "../reducers/cloudReducer"

import CheckIcon from "@material-ui/icons/Check"
import DoneAllIcon from "@material-ui/icons/DoneAll"
import CloseIcon from "@material-ui/icons/Close"
import EditIcon from "@material-ui/icons/Edit"

import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"

import { useHistory } from "react-router-dom"
import { useSnackbar } from "notistack"

import { GreenButton, YellowButton } from "./colorbuttons"
import { isEditable } from "../utils/makeDocument"
import { editVoucher } from "../reducers/newVoucherReducer"

import Defines from "../defines"

const VoucherHeaderButtons = (props) => {
  const { t } = useTranslation("voucherHeaderButtons", "voucherStatus")
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()

  const saveToStatus = async (status) => {
    try {
      console.log("To status", status)
      const json = props.data
      json.tila = status
      await putVoucher(json)
      await props.reload()
      history.goBack()
      enqueueSnackbar(
        t("successed") + " " + t("voucherStatus:" + status).toLowerCase(),
        { variant: "success" }
      )
    } catch (e) {
      console.log(e.stack)
      enqueueSnackbar(t("failed"), { variant: "error" })
    }
  }

  const edit = () => {
    props.editVoucher(props.data)
    history.push("/edit")
  }

  return (
    <Grid container alignItems="flex-end" direction="columns-reverse">
      {props.data.tila < Defines.VoucherStatus.Accepted &&
        props.rights.includes("Kh") && (
          <GreenButton
            fullWidth
            variant="contained"
            startIcon={<DoneAllIcon />}
            onClick={() => saveToStatus(Defines.VoucherStatus.Accepted)}
          >
            {t("accept")}
          </GreenButton>
        )}
      {props.data.tila < Defines.VoucherStatus.Checked &&
        props.rights.includes("Kt") && (
          <YellowButton
            variant="contained"
            fullWidth
            startIcon={<CheckIcon />}
            onClick={() => saveToStatus(Defines.VoucherStatus.Checked)}
          >
            {t("check")}
          </YellowButton>
        )}
      {props.data.tila >= Defines.VoucherStatus.Received &&
        props.data.tila < Defines.VoucherStatus.Accepted && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<CloseIcon />}
            color="secondary"
            onClick={() => saveToStatus(Defines.VoucherStatus.Rejected)}
          >
            {t("reject")}
          </Button>
        )}

      {props.data.tila === Defines.VoucherStatus.Accepted &&
        props.rights.includes("Tt") && (
          <GreenButton
            fullWidth
            variant="contained"
            startIcon={<DoneAllIcon />}
            onClick={() => saveToStatus(Defines.VoucherStatus.Booked)}
          >
            {t("book")}
          </GreenButton>
        )}

      {props.rights.includes("Tt") && isEditable(props.data) && (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => edit()}
        >
          {t("edit")}
        </Button>
      )}
    </Grid>
  )
}

const mapStateToButtonProps = (state) => {
  return {
    rights: state.cloud.current.rights,
    periods: state.cloud.init.tilikaudet,
    settings: state.cloud.init.asetukset,
  }
}

export default connect(mapStateToButtonProps, { reload, editVoucher })(
  VoucherHeaderButtons
)
