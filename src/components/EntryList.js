import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { useParams } from "react-router-dom"

import { useTranslation } from "react-i18next"
import { getConfig, getUrl } from "../services/cloudService"
import axios from "axios"
import SelectPeriod from "./SelectPeriod"
import SelectSector from "./SelectSector"

import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"

import EntryListItem from "./EntryListItem"

const EntryList = (props) => {
  const account = useParams().account
  const [data, setData] = useState([])
  const [filter, setFilter] = useState(null)

  const { t } = useTranslation("entryList")

  const accountData =
    account && props.accounts
      ? props.accounts.find((e) => e.numero === parseInt(account))
      : null

  const filtered =
    filter && filter.length > 0
      ? data.filter(
        (item) =>
          (item.selite &&
              item.selite.toLowerCase().includes(filter.toLowerCase())) ||
            (item.kumppani &&
              item.kumppani.nimi.toLowerCase().includes(filter.toLowerCase()))
      )
      : data

  useEffect(() => {
    console.log("UE", props.updated, props.period, props.sector, account)
    if (props.period) {
      const url = getUrl(
        "/viennit?alkupvm=" +
          props.period.alkaa +
          "&loppupvm=" +
          props.period.loppuu +
          (account ? "&tili=" + account : "") +
          (props.sector > -1 ? "&kohdennus=" + props.sector : "")
      )

      axios.get(url, getConfig()).then((response) => setData(response.data))
    }
  }, [props.updated, props.period, props.sector, account])

  return (
    <Container maxWidth="xl">
      <Paper>
        <Container text maxWidth="xl">
          <Grid container>
            <Grid item sm={3}>
              <SelectPeriod />
            </Grid>
            <Grid item sm={3}>
              <SelectSector />
            </Grid>
            <Grid item sm={6}>
              <TextField
                id="outlined-basic"
                label={t("filter")}
                variant="outlined"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>

          <h2>
            {accountData ? (
              <div>{accountData.numero + " " + accountData.nimi.fi}</div>
            ) : (
              t("entries")
            )}
          </h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("date")}</TableCell>
                {accountData === null && <TableCell>{t("account")}</TableCell>}
                <TableCell align="center">{t("debet")}</TableCell>
                <TableCell alitn="center">{t("credit")}</TableCell>
                <TableCell>{t("sector")}</TableCell>
                <TableCell>{t("partner")}</TableCell>
                <TableCell>{t("subject")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((entry) => (
                <EntryListItem
                  key={entry.id}
                  item={entry}
                  accounts={props.accounts}
                  sectors={props.sectors}
                  showAccount={accountData === null}
                />
              ))}
            </TableBody>
          </Table>
        </Container>
      </Paper>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    updated: state.cloud ? state.cloud.updated : null,
    period: state.cloud ? state.cloud.period : null,
    accounts: state.cloud && state.cloud.init ? state.cloud.init.tilit : [],
    sectors:
      state.cloud && state.cloud.init ? state.cloud.init.kohdennukset : [],
    sector: state.cloud ? state.cloud.sector : -1,
  }
}

export default connect(mapStateToProps, {})(EntryList)
