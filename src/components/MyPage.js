import React from "react"

import UserInfo from "./UserInfo"
import SelectCloud from "./SelectCloud"
import Container from "@material-ui/core/Container"

const MyPage = () => {
  return (
    <Container>
      <UserInfo />
      <p />
      <SelectCloud />
    </Container>
  )
}

export default MyPage
