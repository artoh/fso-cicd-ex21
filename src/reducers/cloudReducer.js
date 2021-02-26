import cloudService from "../services/cloudService"

const cloudReducer = (store = null, action) => {
  switch (action.type) {
  case "LOGOUT":
    return null
  case "LOGIN":
    return {
      login: action.login,
      current: null,
      init: null,
      updated: null,
      worklist: null,
      period: null,
      sector: null,
    }
  case "CLOUD":
    return {
      ...store,
      current: action.cloud,
      init: action.init,
      worklist: action.worklist,
      period: action.init.tilikaudet.length
        ? action.init.tilikaudet[action.init.tilikaudet.length - 1]
        : null,
      sector: -1,
      updated: Date.now(),
    }
  case "PERIOD":
    return {
      ...store,
      period: action.period,
    }
  case "SECTOR":
    return {
      ...store,
      sector: action.sector,
    }
  case "RELOAD":
    return {
      ...store,
      worklist: action.worklist,
      updated: Date.now(),
    }
  case "REFRESH":
    return {
      ...store,
      updated: Date.now(),
    }
  default:
    return store
  }
}

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await cloudService.login(email, password)
    dispatch({
      type: "LOGIN",
      login: response,
    })
    // If user have access to one cloud only,
    // select this cloud
    if (response.clouds.length === 1) {
      const cloud = response.clouds[0]
      const init = await cloudService.initCloud(cloud)
      const worklist = await cloudService.getWorklist()
      dispatch({
        type: "CLOUD",
        cloud: cloud,
        init: init,
        worklist: worklist,
      })
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    dispatch({
      type: "LOGOUT",
    })
  }
}

export const selectCloud = (cloud) => {
  return async (dispatch) => {
    const init = await cloudService.initCloud(cloud)
    const worklist = await cloudService.getWorklist()
    dispatch({
      type: "CLOUD",
      cloud: cloud,
      init: init,
      worklist: worklist,
    })
  }
}

export const selectPeriod = (period) => {
  return async (dispatch) => {
    console.log("Period", period)
    dispatch({
      type: "PERIOD",
      period: period,
    })
  }
}

export const selectSector = (sector) => {
  return async (dispatch) => {
    console.log("Sector", sector)
    dispatch({
      type: "SECTOR",
      sector: sector,
    })
  }
}

export const reload = () => {
  return async (dispatch) => {
    console.log("RELOAD ME")
    const worklist = await cloudService.getWorklist()
    dispatch({
      type: "RELOAD",
      worklist: worklist,
    })
  }
}

export const refresh = () => {
  return async (dispatch) =>
    dispatch({
      type: "REFRESH",
    })
}

export default cloudReducer
