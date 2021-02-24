// eslint-disable-next-line
import React from "react"
import { withStyles } from "@material-ui/core/styles"
import { green, yellow, blue } from "@material-ui/core/colors"

import Button from "@material-ui/core/Button"

export const GreenButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
    "&:disabled": {
      backgroundColor: green[200],
    },
  },
}))(Button)

export const YellowButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(yellow[500]),
    backgroundColor: yellow[500],
    "&:hover": {
      backgroundColor: yellow[700],
    },
    "&:disabled": {
      backgroundColor: yellow[200],
    },
  },
}))(Button)

export const BlueButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    "&:hover": {
      backgroundColor: blue[700],
    },
    "&:disabled": {
      backgroundColor: blue[200],
    },
  },
}))(Button)
