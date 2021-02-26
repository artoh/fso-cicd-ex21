import styled from "styled-components"

import React, { useEffect, useState } from "react"
import { getConfig, getUrl } from "../services/cloudService"
import axios from "axios"

import CircularProgress from "@material-ui/core/CircularProgress"
import Paper from "@material-ui/core/Paper"

import { Document, Page } from "react-pdf"
import { pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PdfWrapper = styled.div`
  canvas {
    width: 100% !important;
    height: auto !important;
  }
`

const PdfAttachment = ({ id }) => {
  const [numPages, setNumPages] = useState([])

  return (
    <Document
      file={{
        url: getUrl("/liitteet/" + id),
        httpHeaders: getConfig().headers,
      }}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      loading={
        <p align="center">
          <CircularProgress />
        </p>
      }
    >
      {Array.apply(null, Array(numPages))
        .map((x, i) => i + 1)
        .map((page) => (
          <Paper key={page}>
            <PdfWrapper>
              <Page pageNumber={page} scale={2} key={page} />
            </PdfWrapper>
          </Paper>
        ))}
    </Document>
  )
}

const ImageAttachment = ({ id }) => {
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (id) {
      axios
        .get(getUrl("/liitteet/" + id), {
          ...getConfig(),
          responseType: "arraybuffer",
        })
        .then((response) => {
          const data = Buffer.from(response.data, "binary").toString("base64")
          setImage(data)
        })
    }
  }, [id])

  return (
    <div>
      {image && (
        <Paper>
          <img src={`data:image/png;base64,${image}`} alt="" width="100%" />
        </Paper>
      )}
      {!image && (
        <p align="center">
          <CircularProgress />
        </p>
      )}
    </div>
  )
}

export const VoucherAttachment = ({ data }) => {
  if (data.tyyppi === "application/pdf") {
    return <PdfAttachment id={data.id} />
  } else if (data.tyyppi === "image/jpeg") {
    return <ImageAttachment id={data.id} />
  }
  return <div />
}

const VoucherAttachments = ({ attachments }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    console.log("setData")
    if (attachments) {
      setData(attachments)
    }
  }, [attachments])

  return (
    <div>
      {data.map((item) => (
        <VoucherAttachment data={item} key={item.id} />
      ))}
    </div>
  )
}

export default VoucherAttachments
