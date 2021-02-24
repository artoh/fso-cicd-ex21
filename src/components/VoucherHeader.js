import { useTranslation } from "react-i18next"

import { connect } from "react-redux"

import DayJS from "react-dayjs"

import Paper from "@material-ui/core/Paper"
import Container from "@material-ui/core/Container"
import Chip from "@material-ui/core/Chip"

import TodayIcon from "@material-ui/icons/Today"
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import EuroIcon from "@material-ui/icons/Euro"
import EventIcon from "@material-ui/icons/Event"
import RotateRightIcon from "@material-ui/icons/RotateRight"
import ReportIcon from "@material-ui/icons/Report"

import NumberFormat from "react-number-format"

import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"

import VoucherHeaderButtons from "./VoucerHeaderButtons"
import { isEditable } from "../utils/makeDocument"

import Defines from "../defines"

import dayjs from "dayjs"

const VoucherChips = ({ data, initials }) => {
  const { t } = useTranslation([
    "voucherHeader",
    "voucherType",
    "voucherStatus",
  ])
  const summa =
    data && data.viennit
      ? "" +
        data.viennit.reduce(
          (acc, cur) =>
            acc + (parseFloat(cur.debet) ? parseFloat(cur.debet) : 0),
          0.0
        )
      : ""

  const kierto =
    data.kierto && initials.kierrot.find((e) => e.id === data.kierto)

  return (
    <div>
      {data.tunniste && (
        <Chip
          variant="outlined"
          size="large"
          label={(data.sarja ? data.sarja : "") + data.tunniste}
        />
      )}
      <Chip
        variant="outlined"
        size="large"
        label={<DayJS format="DD.MM.YYYY" date={data.pvm} />}
        icon={<CalendarTodayIcon />}
      />
      {data.laskupvm && data.laskupvm !== data.pvm && (
        <Chip
          variant="outlined"
          size="large"
          label={<DayJS format="DD.MM.YYYY" date={data.laskupvm} />}
          icon={<TodayIcon />}
        />
      )}
      {data.erapvm && (
        <Chip
          variant="outlined"
          size="large"
          label={<DayJS format="DD.MM.YYYY" date={data.erapvm} />}
          icon={<EventIcon />}
        />
      )}
      <Chip
        variant="outlined"
        size="large"
        label={t("voucherType:" + (data.tyyppi > 0 ? data.tyyppi : "0"))}
      />
      {kierto && (
        <Chip
          variant="outlined"
          size="large"
          label={kierto.nimi}
          icon={<RotateRightIcon />}
        />
      )}
      <Chip
        variant="outlined"
        size="large"
        label={t("voucherStatus:" + data.tila)}
      />
      <Chip
        variant="outlined"
        size="large"
        label={
          <NumberFormat
            value={parseFloat(summa)}
            displayType="text"
            decimalSeparator=","
            thousandSeparator="&nbsp;"
            fixedDecimalScale={true}
            decimalScale={2}
          />
        }
        icon={<EuroIcon />}
      />
      {data.huomio && (
        <Chip
          label={t("marked")}
          icon={<ReportIcon />}
          size="large"
          color="secondary"
        />
      )}
    </div>
  )
}

const VoucherHeaderBody = ({ data }) => {
  return (
    <div>
      <h2>{data.otsikko}</h2>
      {data.kumppani && <p>{data.kumppani.nimi}</p>}
      {data.info && (
        <div style={{ whiteSpace: "pre-line" }}>
          <Divider />
          <p>{data.info}</p>
        </div>
      )}
    </div>
  )
}

const VoucherHeader = ({ data, initials, current }) => {
  const closeDaySetting = initials.asetukset["TilitPaatetty"]
  const closeDay = closeDaySetting
    ? dayjs(closeDaySetting).add(1, "day")
    : dayjs("2020-01-01")
  const voucherDate = dayjs(data.pvm)
  const unLocked = closeDay.isBefore(voucherDate)

  const buttonsVisible =
    unLocked &&
    ((data.tila >= Defines.VoucherStatus.Received &&
      data.tila <= Defines.VoucherStatus.Accepted &&
      (current.rights.includes("Kt") || current.rights.includes("Kh"))) ||
      (current.rights.includes("Tt") && isEditable(data)))

  return (
    <Paper>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={buttonsVisible ? 10 : 12}>
            <VoucherChips data={data} initials={initials} />
            <VoucherHeaderBody data={data} />
          </Grid>
          {buttonsVisible && (
            <Grid item xs={2}>
              <VoucherHeaderButtons data={data} />
            </Grid>
          )}
        </Grid>
      </Container>
    </Paper>
  )
}

const mapStateToProps = (state) => {
  return {
    initials: state.cloud.init,
    current: state.cloud.current,
  }
}

export default connect(mapStateToProps, {})(VoucherHeader)
