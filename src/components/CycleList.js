import React from "react"
import { connect } from "react-redux"

import { useTranslation } from "react-i18next"

import DayJS from "react-dayjs"
import Euro from "./Euro"

import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Container from "@material-ui/core/Container"
import { useHistory } from "react-router-dom"
import NewFab from "./NewFab"

const CycleItem = ({ item, cycles }) => {
  const history = useHistory()
  const cycle = cycles && cycles.find((e) => e.id === item.kierto)
  return (
    <TableRow onClick={() => history.push("/vouchers/" + item.id)}>
      <TableCell>
        <DayJS format="DD.MM.YYYY" date={item.pvm} />
      </TableCell>
      <TableCell>
        {item.erapvm && <DayJS format="DD.MM.YYYY" date={item.erapvm} />}
      </TableCell>
      <TableCell>{cycle && cycle.nimi}</TableCell>
      <TableCell>{item.kumppaninimi}</TableCell>
      <TableCell>{item.otsikko}</TableCell>
      <TableCell align="right">
        <Euro value={item.summa} />
      </TableCell>
    </TableRow>
  )
}

const CycleStatusList = ({ cycles, list, status }) => {
  const filtered = list.filter((item) => item.tila === status)
  const { t } = useTranslation("voucherStatus")
  return (
    <div>
      {filtered.length > 0 && (
        <div>
          <h2>{t("" + status)}</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pvm</TableCell>
                <TableCell>Eräpvm</TableCell>
                <TableCell>Kierto</TableCell>
                <TableCell>Toimittaja</TableCell>
                <TableCell>Otsikko</TableCell>
                <TableCell>Summa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <CycleItem item={c} key={c.id} cycles={cycles} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

const CycleList = (props) => {
  const { t } = useTranslation("cycleList")
  return (
    <Container maxWidth="xl">
      <Paper>
        <Container text maxWidth="xl">
          {props.worklist.length === 0 && t("empty")}
          <CycleStatusList
            list={props.worklist}
            status={20}
            cycles={props.cycles}
          />
          <CycleStatusList
            list={props.worklist}
            status={30}
            cycles={props.cycles}
          />
          <CycleStatusList
            list={props.worklist}
            status={40}
            cycles={props.cycles}
          />
          <NewFab />
        </Container>
      </Paper>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    updated: state.cloud ? state.cloud.updated : null,
    worklist: state.cloud ? state.cloud.worklist : [],
    cycles: state.cloud && state.cloud.init ? state.cloud.init.kierrot : [],
  }
}

export default connect(mapStateToProps, {})(CycleList)
