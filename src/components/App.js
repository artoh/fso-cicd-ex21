import React from "react"
import { connect } from "react-redux"
import { withTranslation } from "react-i18next"

import LoginForm from "./LoginForm"
import MyPage from "./MyPage"
import SaldoView from "./SaldoView"
import CycleList from "./CycleList"
import NewVoucher from "./NewVoucher"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"

import VoucherList from "./VoucherList"
import Voucher from "./Voucher"
import EntryList from "./EntryList"

import MyAppBar from "./MyAppBar"

class App extends React.Component {
  render() {
    return (
      <Router>
        <MyAppBar />
        <p />
        <Switch>
          <Route path="/login">
            <LoginForm />
          </Route>
          {!this.props.name && <Redirect to="/login" />}
          <Route path="/my" component={MyPage} />
          {!this.props.current && <Redirect to="/my" />}
          <Route path="/saldo">
            <SaldoView />
          </Route>
          <Route path="/vouchers/:id">
            <Voucher />
          </Route>
          <Route path="/vouchers">
            <VoucherList />
          </Route>
          <Route path="/cycle">
            <CycleList />
          </Route>
          <Route path="/entries/:account">
            <EntryList />
          </Route>
          <Route path="/entries">
            <EntryList />
          </Route>
          <Route path="/new">
            <NewVoucher />
          </Route>
          <Route path="/edit">
            <NewVoucher />
          </Route>
          <Route path="/">
            <Redirect to="/saldo" />
          </Route>
        </Switch>
        <p align="center">WebKitsas &copy; Kitsas Oy 2021</p>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    name: state.cloud ? state.cloud.login.name : null,
    current: state.cloud ? state.cloud.current : null,
    tasks:
      state.cloud && state.cloud.worklist ? state.cloud.worklist.length : null,
  }
}

export default withTranslation("app")(connect(mapStateToProps, {})(App))
