import React from "react"
import { connect } from "react-redux"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"

const NewFab = (props) => {
  const history = useHistory()
  const { t } = useTranslation("newFab")
  if (
    !props.rights.includes("Tl") &&
    !props.rights.includes("Tt") &&
    !props.rights.includes("Kl")
  )
    return null

  return (
    <div style={{ float: "right" }}>
      <Fab
        color="primary"
        variant="extended"
        aria-label="add"
        onClick={() => history.push("/new")}
      >
        <AddIcon /> {t("new")}
      </Fab>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    rights: state.cloud && state.cloud.current && state.cloud.current.rights,
  }
}

export default connect(mapStateToProps, {})(NewFab)
