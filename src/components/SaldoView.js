import React, { useEffect, useState } from "react"
import { connect } from "react-redux"

import { useTranslation } from "react-i18next"
import { getConfig, getUrl } from "../services/cloudService"
import axios from "axios"

import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"

import { useHistory } from "react-router-dom"

import Euro from "./Euro"
import LanguageField from "./LanguageField"
import NewFab from "./NewFab"

import SelectPeriod from "./SelectPeriod"
import SelectSector from "./SelectSector"
import { TableFooter } from "@material-ui/core"

const SaldoItem = (props) => {
  const acob = props.accounts.find(
    (o) => !o.tyyppi.startsWith("H") && "" + o.numero === props.account
  )
  const history = useHistory()

  return (
    <TableRow onClick={() => history.push("/entries/" + props.account)}>
      <TableCell>{props.account}</TableCell>
      <TableCell>{acob && <LanguageField text={acob.nimi} />}</TableCell>
      <TableCell align="right">
        <Euro value={props.saldo} />
      </TableCell>
    </TableRow>
  )
}

const SaldoView = (props) => {
  const [saldos, setSaldos] = useState({})
  const { t } = useTranslation("saldoView")

  useEffect(() => {
    if (props.period) {
      axios
        .get(
          getUrl(
            "/saldot?pvm=" +
              props.period.loppuu +
              (props.sector > -1
                ? "&tuloslaskelma&kohdennus=" + props.sector
                : "")
          ),
          getConfig()
        )
        .then((response) => {
          setSaldos(response.data)
          console.log("Received", response.data)
        })
    }
  }, [props.updated, props.period, props.sector])

  const balanceAccounts = Object.keys(saldos).filter((nr) => nr < "3")
  const resultAccounts = Object.keys(saldos).filter((nr) => nr > "3")
  const resultTotal = resultAccounts.reduce(
    (acc, curr) => acc + parseFloat(saldos[curr]),
    0
  )

  return (
    <Container>
      <Paper>
        <Container text>
          <Grid container>
            <Grid item sm={6}>
              <SelectPeriod />
            </Grid>
            <Grid item sm={6}>
              <SelectSector />
            </Grid>
          </Grid>
          <h2>{t("saldos")}</h2>
          {balanceAccounts.length > 0 && (
            <div>
              <h3>{t("balance")}</h3>
              <Table>
                <TableBody>
                  {balanceAccounts.map((k) => (
                    <SaldoItem
                      key={k}
                      account={k}
                      saldo={saldos[k]}
                      accounts={props.accounts}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {resultAccounts.length > 0 && (
            <div>
              <h3>{t("result")}</h3>
              <Table>
                <TableBody>
                  {resultAccounts.map((k) => (
                    <SaldoItem
                      key={k}
                      account={k}
                      saldo={saldos[k]}
                      accounts={props.accounts}
                    />
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>{t("resultTotal")}</TableCell>
                    <TableCell align="right">
                      <Euro value={resultTotal} />
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}
          <NewFab />
        </Container>
      </Paper>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    updated: state.cloud ? state.cloud.updated : null,
    accounts: state.cloud && state.cloud.init ? state.cloud.init.tilit : [],
    period: state.cloud ? state.cloud.period : null,
    sector: state.cloud ? state.cloud.sector : -1,
  }
}

export default connect(mapStateToProps, {})(SaldoView)
