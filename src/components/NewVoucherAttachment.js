import React, { useState } from "react"
import { connect } from "react-redux"
import { useTranslation } from "react-i18next"

import Container from "@material-ui/core/Container"
import Paper from "@material-ui/core/Paper"
import CircularProgress from "@material-ui/core/CircularProgress"

import { DropzoneAreaBase } from "material-ui-dropzone"

import { addAttachment, removeAttachment } from "../reducers/attachmentReducer"
import { attach } from "../services/cloudService"
import { setField } from "../reducers/newVoucherReducer"

import { VoucherAttachment } from "./VoucherAttachments"

import Button from "@material-ui/core/Button"
import RemoveIcon from "@material-ui/icons/Remove"

import { useSnackbar } from "notistack"

const NewVoucherAttachment = (props) => {
  const [inProgress, setInProgress] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation("newVoucherAttachment")

  const importData = async (data) => {
    if (
      data.summa &&
      data.summa > 0 &&
      props.voucher.rows.length === 1 &&
      parseFloat(props.voucher.rows[0].euro) === 0.0
    ) {
      console.log("Sum", data.summa)
      const euroObject = { euro: data.summa.toFixed(2) }
      const newRow = { ...props.voucher.rows[0], ...euroObject }
      props.setField("rows", [newRow])
    }
    if (data.tositepvm) {
      props.setField("date", data.tositepvm)
    }

    // TODO: Import by company id or iban
  }

  const drop = async (files) => {
    files.forEach(async (object) => {
      console.log(object)
      try {
        setInProgress(true)
        const response = await attach(object)
        console.log(response)
        const location = response.headers.location
        const id = location.substring(location.lastIndexOf("/") + 1)
        await importData(response.data)
        props.addAttachment({ id, tyyppi: object.file.type })
        setInProgress(false)
      } catch (e) {
        console.error(e)
        enqueueSnackbar(t("dropfailed"), { variant: "error" })
        setInProgress(false)
      }
    })
  }

  return (
    <Paper>
      <Container maxWidth="xl">
        {inProgress && (
          <p align="center">
            <CircularProgress color="inherit" />
          </p>
        )}
        {props.attachments.length === 0 &&
          (props.voucher.old.liitteet === undefined ||
            props.voucher.old.liitteet.length === 0) &&
          !inProgress && (
          <DropzoneAreaBase
            id="dropzone"
            acceptedFiles={["image/jpeg", "application/pdf"]}
            maxFileSize={8338608}
            onAdd={(newFiles) => drop(newFiles)}
            showAlerts={["error"]}
            getDropRejectMessage={() => t("rejected")}
            dropzoneText={t("droptext")}
          />
        )}
        {props.voucher.old.liitteet &&
          props.voucher.old.liitteet.map((a) => (
            <VoucherAttachment key={a.id} data={a} />
          ))}
        {props.attachments.map((a) => (
          <div key={a.id}>
            <VoucherAttachment data={a} />
            <div style={{ float: "right" }}>
              <Button
                variant="contained"
                onClick={() => props.removeAttachment(a.id)}
              >
                <RemoveIcon /> {t("remove")}
              </Button>
            </div>
          </div>
        ))}
      </Container>
    </Paper>
  )
}

const mapStateToProps = (state) => {
  return {
    attachments: state.attachments,
    voucher: state.newVoucher,
  }
}

export default connect(mapStateToProps, {
  addAttachment,
  removeAttachment,
  setField,
})(NewVoucherAttachment)
