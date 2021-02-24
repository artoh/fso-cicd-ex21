import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { useParams } from "react-router-dom"

import { useTranslation } from "react-i18next"
import { getConfig, getUrl } from "../services/cloudService"
import axios from "axios"
import DayJS from "react-dayjs"

import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"

import Euro from "./Euro"
import LanguageField from "./LanguageField"
import VoucherAttachments from "./VoucherAttachments"
import VoucherHeader from "./VoucherHeader"
import VoucherLog from "./VoucherLog"
import VoucherComments from "./VoucherComments"

const VoucherEntryRow = ({ entry, initials }) => {
  const { i18n } = useTranslation()
  const account = initials.tilit.find(
    (o) => !o.tyyppi.startsWith("H") && o.numero === entry.tili
  )

  const sector =
    entry.kohdennus > 0 &&
    initials.kohdennukset.find((e) => e.id === entry.kohdennus)

  return (
    <TableRow>
      <TableCell>
        <DayJS format="DD.MM.YYYY">{entry.pvm}</DayJS>
      </TableCell>
      <TableCell>
        {entry.tili} {account && <LanguageField text={account.nimi} />}
      </TableCell>
      <TableCell>
        {sector && sector.nimi[i18n.language.substring(0, 2)]}
      </TableCell>
      <TableCell>{entry.selite}</TableCell>
      <TableCell align="right">
        <Euro value={entry.debet} />
      </TableCell>
      <TableCell align="right">
        <Euro value={entry.kredit} />
      </TableCell>
    </TableRow>
  )
}

const VoucherEntries = ({ entries, initials }) => {
  const { t } = useTranslation("voucherEntries")

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t("date")}</TableCell>
          <TableCell>{t("account")}</TableCell>
          <TableCell>{t("sector")}</TableCell>
          <TableCell>{t("subject")}</TableCell>
          <TableCell align="center">{t("debet")}</TableCell>
          <TableCell align="center">{t("credit")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {entries.map((entry) => (
          <VoucherEntryRow key={entry.id} entry={entry} initials={initials} />
        ))}
      </TableBody>
    </Table>
  )
}

const VoucherPortalInfo = ({ data }) => {
  return (
    <Grid item sm={12}>
      <Paper>
        <Container text>
          <p>
            {data.portaali.nimi}
            <br />
            {data.portaali.osoite}
            <br />
            {data.portaali.email}
            <br />
            {data.portaali.puhelin}
            <br />
            {data.portaali.iban}
          </p>
        </Container>
      </Paper>
    </Grid>
  )
}

const VoucherInvoiceInfo = ({ data }) => {
  return (
    <Grid item sm={12}>
      <Paper>
        <Container text maxWidth="xl">
          <p>
            {data.lasku && data.lasku.numero && (
              <div>
                Laskun numero: {data.lasku.numero}
                <br />
              </div>
            )}
            {data.viite && <div>Viite: {data.viite}</div>}
          </p>
        </Container>
      </Paper>
    </Grid>
  )
}

const Voucher = (props) => {
  const id = useParams().id
  const [data, setData] = useState({})

  useEffect(() => {
    if (id) {
      axios.get(getUrl("/tositteet/" + id), getConfig()).then((response) => {
        setData(response.data)
      })
    }
  }, [props.updated, id])

  if (!data || !data.viennit) return <Paper />

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <VoucherHeader data={data} />
        </Grid>
        <Grid item sm={12}>
          <VoucherAttachments attachments={data.liitteet} />
        </Grid>
        <Grid item sm={12}>
          <Paper>
            <Container text maxWidth="xl">
              <VoucherEntries
                entries={data.viennit}
                initials={props.initials}
              />
            </Container>
          </Paper>
        </Grid>
        <Grid item lg={6} sm={12}>
          <Grid container spacing={3}>
            {data.portaali && <VoucherPortalInfo data={data} />}
            {(data.lasku || data.viite) && <VoucherInvoiceInfo data={data} />}
            <Grid item sm={12}>
              <VoucherLog log={data.loki} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={6} sm={12}>
          <VoucherComments comments={data.kommentit} docId={data.id} />
        </Grid>
      </Grid>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    updated: state.cloud ? state.cloud.updated : null,
    initials: state.cloud && state.cloud.init ? state.cloud.init : [],
  }
}

export default connect(mapStateToProps, {})(Voucher)
