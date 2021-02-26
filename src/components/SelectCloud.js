import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { selectCloud } from "../reducers/cloudReducer"
import { useHistory } from "react-router-dom"

import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import Avatar from "@material-ui/core/Avatar"
import Container from "@material-ui/core/Container"
import Divider from "@material-ui/core/Divider"

import axios from "axios"

const CloudListItem = ({ cloud, onSelect }) => {
  const history = useHistory()
  const [image, setImage] = useState(null)

  const doSelect = async (cloud) => {
    await onSelect(cloud)
    history.push("/")
  }

  useEffect(() => {
    const url = new URL(cloud.url)
    const path = url.pathname + "/liitteet/0/logo"
    axios
      .get(path, {
        headers: {
          authorization: `bearer ${cloud.token}`,
        },
        responseType: "arraybuffer",
      })
      .then((response) => {
        const data = Buffer.from(response.data, "binary").toString("base64")
        setImage(data)
      })
      .catch(() => {})
  }, [cloud])

  return (
    <ListItem onClick={() => doSelect(cloud)}>
      <ListItemAvatar>
        <Avatar
          src={`data:image/png;base64,${image}`}
          alt={cloud.name}
          variant="rounded"
        />
      </ListItemAvatar>
      <ListItemText>{cloud.name}</ListItemText>
    </ListItem>
  )
}

const SelectCloud = (props) => {
  return (
    <Paper>
      <Container>
        <h3>Valitse kirjanpito</h3>
        <Divider />
        <List>
          {props.clouds &&
            props.clouds.map((cloud) => (
              <CloudListItem
                key={cloud.id}
                cloud={cloud}
                onSelect={props.selectCloud}
              />
            ))}
        </List>
      </Container>
    </Paper>
  )
}

const mapStateToProps = (state) => {
  return {
    clouds: state.cloud ? state.cloud.login.clouds : [],
  }
}

export default connect(mapStateToProps, { selectCloud })(SelectCloud)
