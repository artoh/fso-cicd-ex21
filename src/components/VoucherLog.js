import React from "react"

import { useTranslation } from "react-i18next"
import DayJS from "react-dayjs"

import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import Container from "@material-ui/core/Container"

const VoucherLogRow = ({ row }) => {
  const { t } = useTranslation("voucherStatus")

  return (
    <TableRow>
      <TableCell>
        <DayJS format="DD.MM.YYYY HH.mm" date={row.aika} />
      </TableCell>
      <TableCell>{t("" + row.tila)}</TableCell>
      <TableCell>{row.nimi}</TableCell>
    </TableRow>
  )
}

const VoucherLog = ({ log }) => {
  return (
    <Paper>
      <Container text>
        <Table>
          <TableBody>
            {log.map((row) => (
              <VoucherLogRow row={row} key={row.id}/>
            ))}
          </TableBody>
        </Table>
      </Container>
    </Paper>
  )
}

export default VoucherLog
