import React from "react"
import { connect } from "react-redux"

import Paper from "@material-ui/core/Paper"
import Container from "@material-ui/core/Container"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"

import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Typography from "@material-ui/core/Typography"

import { useTranslation } from "react-i18next"

import LockIcon from "@material-ui/icons/Lock"
import VpnKeyIcon from "@material-ui/icons/VpnKey"

import { logout } from "../reducers/cloudReducer"
import { useSnackbar } from "notistack"

import axios from "axios"

const UserInfo = (props) => {
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState({
    current: "",
    new1: "",
    new2: "",
  })
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation("userInfo")

  const close = () => {
    setValues({ current: "", new1: "", new2: "" })
    setOpen(false)
  }

  const change = async () => {
    try {
      await axios.post(
        "/api/password",
        {
          oldpassword: values.current,
          newpassword: values.new1,
          invalidate: true,
        },
        { headers: { authorization: `bearer ${props.user.token}` } }
      )
      enqueueSnackbar(t("success"), { variant: "success" })
      close()
    } catch (e) {
      console.log(e)
      enqueueSnackbar(t("failed"), { variant: "failed" })
    }
  }

  return (
    <Paper>
      <Container text>
        <Grid container>
          <Grid item sm={10}>
            <Typography variant="h5">{props.user.name}</Typography>
            <Typography variant="body1">{props.user.email}</Typography>
            <Typography variant="overline">
              {props.user.plan.name}
            </Typography>{" "}
          </Grid>
          <Grid item sm={2}>
            <Button fullWidth variant="outlined" onClick={() => props.logout()}>
              <LockIcon /> {t("logout")}
            </Button>
            <Button fullWidth variant="outlined" onClick={() => setOpen(true)}>
              <VpnKeyIcon /> {t("password")}
            </Button>
            <Dialog
              open={open}
              onClose={close}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle>{t("password")}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {values.new1.length < 10 && <span>{t("length")} </span>}
                  {!(
                    /[A-Z]/.test(values.new1) &&
                    /[a-z]/.test(values.new1) &&
                    /[0-9]/.test(values.new1)
                  ) && <span>{t("weak")} </span>}
                  {values.new1 !== values.new2 && <span>{t("notequals")}</span>}
                </DialogContentText>
                <TextField
                  fullWidth
                  label={t("current")}
                  type="password"
                  autoComplete="current-password"
                  value={values.current}
                  onChange={(event) =>
                    setValues({ ...values, current: event.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label={t("new1")}
                  type="password"
                  value={values.new1}
                  onChange={(event) =>
                    setValues({ ...values, new1: event.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label={t("new2")}
                  type="password"
                  value={values.new2}
                  onChange={(event) =>
                    setValues({ ...values, new2: event.target.value })
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={change}
                  disabled={
                    values.current.length < 10 ||
                    values.new1 !== values.new2 ||
                    values.new1.length < 10 ||
                    !(
                      /[A-Z]/.test(values.new1) &&
                      /[a-z]/.test(values.new1) &&
                      /[0-9]/.test(values.new1)
                    )
                  }
                >
                  {t("password")}
                </Button>
                <Button onClick={close}>{t("close")}</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.cloud && state.cloud.login,
  }
}

export default connect(mapStateToProps, { logout })(UserInfo)
