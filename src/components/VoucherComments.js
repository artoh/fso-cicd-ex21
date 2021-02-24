import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { connect } from "react-redux"

import { addComment } from "../services/cloudService"
import { refresh } from "../reducers/cloudReducer"

import Paper from "@material-ui/core/Paper"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Avatar from "@material-ui/core/Avatar"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"

import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"

import DayJS from "react-dayjs"
import { useSnackbar } from "notistack"

const VoucherComment = ({ comment }) => {
  return (
    <div>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            {comment.nimi
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <div style={{ whiteSpace: "pre-line" }}>{comment.teksti}</div>
          }
          secondary={
            <span>
              {comment.nimi}{" "}
              <DayJS format="DD.MM.YYYY hh.mm" date={comment.aika} />
            </span>
          }
        />
      </ListItem>
    </div>
  )
}

const VoucherComments = (props) => {
  const { t } = useTranslation("voucherComments")
  const [newComment, setNewComment] = useState("")
  const { enqueueSnackbar } = useSnackbar()

  if (
    (!props.comments || props.comments.length === 0) &&
    !props.rights.includes("Tk")
  ) {
    return null
  }

  const saveComment = async () => {
    try {
      console.log("Uusi kommentti")
      await addComment(props.docId, newComment)
      console.log("lisätty")
      setNewComment("")
      await props.refresh()
    } catch (e) {
      console.log(e.stack)
      enqueueSnackbar(t("failed"), { variant: "error" })
    }
  }

  return (
    <Paper>
      <Container text>
        <List>
          {props.comments &&
            props.comments.map((item) => (
              <VoucherComment comment={item} key={item.id} />
            ))}
        </List>
        {props.rights.includes("Tk") && (
          <div>
            <Grid container alignItems="center" spacing={1}>
              <Grid item sm={10}>
                <TextField
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                  placeholder={t("placeholder")}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Grid>
              <Grid item sm={2}>
                <Button
                  fullWidth
                  disabled={newComment.length === 0}
                  variant="contained"
                  color="primary"
                  onClick={() => saveComment()}
                >
                  {t("button")}
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </Container>
    </Paper>
  )
}

const mapStateToButtonProps = (state) => {
  return {
    rights: state.cloud && state.cloud.current && state.cloud.current.rights,
  }
}

export default connect(mapStateToButtonProps, { refresh })(VoucherComments)
