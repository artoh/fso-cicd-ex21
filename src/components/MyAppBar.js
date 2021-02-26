import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Avatar from "@material-ui/core/Avatar"
import Badge from "@material-ui/core/Badge"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"

import { useTranslation } from "react-i18next/"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const MyAppBar = (props) => {
  const classes = useStyles()
  const { t } = useTranslation("appBar")
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {props.current ? props.current.name : t("webkitsas")}
          </Typography>

          {props.current && (
            <div>
              <div className={classes.menuButton}>
                <Button color="inherit" component={Link} to="/saldo">
                  {t("saldos")}
                </Button>
                {props.current.rights.includes("Ts") && (
                  <Button color="inherit" component={Link} to="/vouchers">
                    {t("vouchers")}
                  </Button>
                )}
                {props.current.rights.includes("Ts") && (
                  <Button color="inherit" component={Link} to="/entries">
                    {t("entries")}
                  </Button>
                )}
                <Badge
                  color="secondary"
                  badgeContent={props.tasks}
                  invisible={props.tasks === 0}
                >
                  <Button color="inherit" component={Link} to="/cycle">
                    {t("job")}
                  </Button>
                </Badge>
              </div>
            </div>
          )}
          {props.name && (
            <div className={classes.menuButton}>
              <IconButton
                aria-label="account of current user"
                arial-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                component={Link}
                to="/my"
              >
                <Avatar>
                  {props.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar>
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    name: state.cloud ? state.cloud.login.name : null,
    current: state.cloud ? state.cloud.current : null,
    tasks:
      state.cloud && state.cloud.worklist ? state.cloud.worklist.length : null,
  }
}

export default connect(mapStateToProps, {})(MyAppBar)
