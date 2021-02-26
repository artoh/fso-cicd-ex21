import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { useHistory } from "react-router-dom"

import { useTranslation } from "react-i18next"
import { getConfig, getUrl } from "../services/cloudService"
import axios from "axios"
import DayJS from "react-dayjs"

import Euro from "./Euro"
import SelectPeriod from "./SelectPeriod"
import NewFab from "./NewFab"

import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import Container from "@material-ui/core/Container"
import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid"

import AttachFileIcon from "@material-ui/icons/AttachFile"
import ReportIcon from "@material-ui/icons/Report"

const VoucherListItem = ({ item }) => {
  const history = useHistory()
  const { t } = useTranslation("voucherType")

  return (
    <TableRow
      onClick={() => {
        history.push("/vouchers/" + item.id)
      }}
    >
      <TableCell>
        {item.sarja && item.sarja}
        {item.tunniste}
      </TableCell>
      <TableCell>
        {item.liitteita && <AttachFileIcon />}
        {item.huomio && <ReportIcon style={{ color: "red" }} />}
      </TableCell>
      <TableCell>
        <DayJS format="DD.MM.YYYY">{item.pvm}</DayJS>
      </TableCell>
      <TableCell>{t("" + item.tyyppi > 0 ? item.tyyppi : "0")}</TableCell>
      <TableCell>{item.laji}</TableCell>
      <TableCell align="right">
        <Euro value={item.summa} />
      </TableCell>
      <TableCell>{item.kumppani}</TableCell>
      <TableCell>{item.otsikko}</TableCell>
    </TableRow>
  )
}

const VoucherList = (props) => {
  const { t } = useTranslation("voucherList")
  const [data, setData] = useState([])
  const [filter, setFilter] = useState(null)
  const filtered =
    filter && filter.length > 0
      ? data.filter(
        (item) =>
          (item.otsikko &&
              item.otsikko.toLowerCase().includes(filter.toLowerCase())) ||
            (item.kumppani &&
              item.kumppani.toLowerCase().includes(filter.toLowerCase()))
      )
      : data

  useEffect(() => {
    if (props.period) {
      axios
        .get(
          getUrl(
            "/tositteet?alkupvm=" +
              props.period.alkaa +
              "&loppupvm=" +
              props.period.loppuu
          ),
          getConfig()
        )
        .then((response) => {
          setData(response.data)
        })
    }
  }, [props.updated, props.period])

  return (
    <Container maxWidth="xl">
      <Paper>
        <Container text maxWidth="xl">
          <Grid container>
            <Grid item sm={3}>
              <SelectPeriod />
            </Grid>
            <Grid item sm={9}>
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
          <h2>Tositteet</h2>
          <Table>
            <TableBody>
              {filtered.map((voucher) => (
                <VoucherListItem key={voucher.id} item={voucher} />
              ))}
            </TableBody>
          </Table>
          <NewFab />
        </Container>
      </Paper>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    updated: state.cloud ? state.cloud.updated : null,
    period: state.cloud ? state.cloud.period : null,
  }
}

export default connect(mapStateToProps, {})(VoucherList)
