import React from "react"
import { connect } from "react-redux"
import { useHistory } from "react-router-dom"

import DayJS from "react-dayjs"

import Euro from "./Euro"
import LanguageField from "./LanguageField"

import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"

const EntryListItem = (props) => {
  const item = props.item
  const history = useHistory()
  const account = props.accounts.find((e) => e.numero === item.tili)
  const sector =
    item.kohdennus > 0 && props.sectors.find((e) => e.id === item.kohdennus)

  return (
    <TableRow onClick={() => history.push("/vouchers/" + item.tosite.id)}>
      <TableCell>
        <DayJS format="DD.MM.YYYY" date={item.pvm} />
      </TableCell>
      {props.showAccount && (
        <TableCell>
          {item.tili} {account && <LanguageField text={account.nimi} />}
        </TableCell>
      )}
      <TableCell align="right">
        <Euro value={item.debet} />
      </TableCell>
      <TableCell align="right">
        <Euro value={item.kredit} />
      </TableCell>
      <TableCell>{sector && <LanguageField text={sector.nimi} />}</TableCell>
      <TableCell>{item.kumppani && item.kumppani.nimi}</TableCell>
      <TableCell>{item.selite}</TableCell>
    </TableRow>
  )
}

const mapStateToProps = (state) => {
  return {
    accounts: state.cloud && state.cloud.init ? state.cloud.init.tilit : [],
    sectors:
      state.cloud && state.cloud.init ? state.cloud.init.kohdennukset : [],
  }
}

export default connect(mapStateToProps, {})(EntryListItem)
