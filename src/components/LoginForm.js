import React, { useState } from "react"
import { connect } from "react-redux"
import { login } from "../reducers/cloudReducer"
import Paper from "@material-ui/core/Paper"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Alert from "@material-ui/lab/Alert"

import * as EmailValidator from "email-validator"
import { useTranslation } from "react-i18next"

import { useHistory } from "react-router-dom"
import { useSnackbar } from "notistack"

import logo from "./webkitsas.png"

import axios from "axios"

const LoginForm = (props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { t } = useTranslation("loginForm")
  const { enqueueSnackbar } = useSnackbar()
  const [forgetOpen, setForgetOpen] = useState(false)
  const history = useHistory()

  const doLogin = async (event) => {
    console.log("Login " + email)
    event.preventDefault()
    try {
      await props.login(email, password)
      history.push("/")
    } catch (e) {
      console.log(e)
      setPassword("")
      enqueueSnackbar(t("loginfailed"), { variant: "error" })
    }
  }

  const forgotten = async () => {
    try {
      await axios.post("/api/users", { email: email })
      enqueueSnackbar(t("forgetsent"), { variant: "info" })
      setForgetOpen(false)
    } catch (e) {
      console.log(e)
      enqueueSnackbar(t("forgotfailed", { variant: "failed" }))
    }
  }

  return (
    <Container>
      <Paper>
        <Container text>
          <p align="center">
            <img src={logo} alt="webkitsas" width="80%" />
          </p>
          <h2>{t("title")}</h2>
          <p>{t("instruction")}</p>
          <Alert severity="info">{t("beta")}</Alert>
          <p>{t("logininstruction")}</p>
          <form onSubmit={doLogin}>
            <TextField
              type="email"
              name="email"
              label={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              required
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              type="password"
              name="password"
              label={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              required
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              margin="normal"
            />
            <Button
              primary
              type="submit"
              disabled={!EmailValidator.validate(email) || password.length < 8}
              variant="contained"
              color="primary"
            >
              {t("login")}
            </Button>
            <Button onClick={() => setForgetOpen(true)}>{t("forgot")}</Button>
            <Dialog
              open={forgetOpen}
              onClose={setForgetOpen}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle>{t("forgottitle")}</DialogTitle>
              <DialogContent>
                <DialogContentText>{t("forgotinfo")}</DialogContentText>
                <TextField
                  fullWidth
                  label={t("email")}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  onClick={forgotten}
                  disabled={!EmailValidator.validate(email)}
                >
                  {t("askfor")}
                </Button>
                <Button onClick={() => setForgetOpen(false)}>
                  {t("close")}
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        </Container>
      </Paper>
    </Container>
  )
}
const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, { login })(LoginForm)
