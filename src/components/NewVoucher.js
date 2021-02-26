import React from "react"

import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"

import NewVoucherAttachment from "./NewVoucherAttachment"
import NewVoucherHeader from "./NewVoucerHeader"
import NewVoucherRows from "./NewVoucherRows"
import NewVoucherExtras from "./NewVoucherExtras"
import NewVoucherButtons from "./NewVoucherButtons"

const NewVoucher = () => {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item lg={12} xs={12}>
          <NewVoucherAttachment />
        </Grid>
        <Grid item lg={12} xs={12}>
          <NewVoucherHeader />
        </Grid>
        <Grid item lg={12} xs={12}>
          <NewVoucherRows />
        </Grid>
        <Grid item lg={12} xs={12}>
          <NewVoucherExtras />
        </Grid>
        <Grid item lg={12} xs={12}>
          <NewVoucherButtons />
        </Grid>
      </Grid>
    </Container>
  )
}

export default NewVoucher
