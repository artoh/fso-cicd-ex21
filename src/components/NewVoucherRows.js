import React from "react"
import { connect } from "react-redux"
import { useTranslation } from "react-i18next"
import NumberFormat from "react-number-format"

import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"

import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import Defines from "../defines"

import { inLanguage } from "../utils/languageUtils"
import { setField } from "../reducers/newVoucherReducer"
import LanguageField from "./LanguageField"
import PropTypes from "prop-types"

import * as dayjs from "dayjs"

const EuroFormat = (props) => {
  const { inputRef, onChange, ...other } = props
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange(values.value)
        console.log("VC", values)
      }}
      decimalSeparator=","
      thousandSeparator="&nbsp;"
      fixedDecimalScale={true}
      decimalScale={2}
      suffix="&nbsp;€"
      isNumericString={true}
    />
  )
}

EuroFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

const NewVoucherRow = ({ row, accounts, update, sectors }) => {
  const { t, i18n } = useTranslation("newVoucherRow")

  return (
    <Grid container spacing={1}>
      <Grid
        item
        lg={sectors.length > 1 ? 3 : 5}
        sm={sectors.length > 1 ? 6 : 12}
        xs={12}
      >
        <TextField
          label={t("subject")}
          variant="outlined"
          fullWidth
          value={row.subject}
          onChange={(e) => update("subject", e.target.value)}
        />
      </Grid>
      <Grid
        item
        lg={sectors.length > 1 ? 4 : 5}
        sm={sectors.length > 1 ? 6 : 8}
        xs={12}
      >
        <Autocomplete
          autoComplete
          disableClearable
          options={accounts}
          value={accounts.find((a) => a.numero === row.account)}
          onChange={(e, value) => update("account", value.numero)}
          getOptionLabel={(option) =>
            "" + option.numero + " " + inLanguage(option.nimi, i18n.language)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("account")}
              variant="outlined"
              fullWidth
            />
          )}
        />
      </Grid>
      {sectors.length > 1 && (
        <Grid item lg={3} sm={8} xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>{t("sector")}</InputLabel>
            <Select
              fullWidth
              value={row.sector}
              onChange={(event) => update("sector", event.target.value)}
            >
              {sectors.map((s) => (
                <MenuItem value={s.id} key={s.id}>
                  <LanguageField text={s.nimi} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      <Grid item lg={2} sm={4} xs={12}>
        <TextField
          label={t("euro")}
          variant="outlined"
          fullWidth
          value={row.euro}
          onChange={(value) => {
            console.log("UD", value, row.euro)
            if (value !== row.euro) update("euro", value)
          }}
          InputProps={{ inputComponent: EuroFormat }}
        />
      </Grid>
    </Grid>
  )
}

const NewVoucherRows = (props) => {
  const filteredAccounts = props.accounts.filter(
    (a) =>
      (props.type === Defines.VoucherType.Income
        ? a.tyyppi.startsWith("C")
        : a.tyyppi.startsWith("D")) && !(a.laajuus > props.accountLevel)
  )

  const formattedDay =
    props.date && dayjs(props.date).isValid()
      ? dayjs(props.date).toISOString()
      : null
  const filteredSectors = props.sectors.filter(
    (sector) =>
      !(sector.alkaa > formattedDay) && !(sector.paattyy < formattedDay)
  )

  const updateField = (index, key, value) => {
    console.log("update", index, key, value)
    const rows = props.rows
    const current = props.rows[index]
    const object = {}
    object[key] = value
    const newObject = { ...current, ...object }
    const newArray = rows
      .slice(0, index)
      .concat(newObject)
      .concat(rows.slice(index + 1))
    props.setField("rows", newArray)
  }

  const insertRow = () => {
    const newAccount =
      props.type === Defines.VoucherType.Income
        ? parseInt(props.settings["OletusMyyntitili"])
        : parseInt(props.settings["OletusMenotili"])
    const newRow = {
      subject: "",
      account: newAccount,
      sector: props.rows[props.rows.length - 1].sector,
      euro: "0.00",
    }
    const rows = props.rows.concat(newRow)
    props.setField("rows", rows)
  }

  const removeRow = () => {
    const newRows = props.rows.slice(0, props.rows.length - 1)
    props.setField("rows", newRows)
  }

  return (
    <Paper>
      <Container maxWidth="xl" text>
        {props.rows.map((row, index) => (
          <NewVoucherRow
            row={row}
            key={index}
            index={index}
            accounts={filteredAccounts}
            sectors={filteredSectors}
            update={(mykey, myvalue) => updateField(index, mykey, myvalue)}
          />
        ))}
        <div style={{ float: "right" }}>
          {parseFloat(props.rows[props.rows.length - 1].euro) !== 0.0 && (
            <Button variant="contained" onClick={() => insertRow()}>
              <AddIcon /> Lisää rivi
            </Button>
          )}
          {props.rows.length > 1 && (
            <Button variant="contained" onClick={() => removeRow()}>
              <RemoveIcon /> Poista rivi
            </Button>
          )}
        </div>
      </Container>
    </Paper>
  )
}

const mapStateToProps = (state) => {
  return {
    accounts: state.cloud.init.tilit,
    sectors: state.cloud.init.kohdennukset,
    date: state.newVoucher.date,
    rows: state.newVoucher.rows,
    type: state.newVoucher.type,
    accountLevel: parseInt(state.cloud.init.asetukset["laajuus"]),
    settings: state.cloud.init.asetukset,
  }
}

export default connect(mapStateToProps, { setField })(NewVoucherRows)
