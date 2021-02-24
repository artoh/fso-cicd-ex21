import Defines from "../defines"

const attachmentReducer = (store = null, action) => {
  switch (action.type) {
    case Defines.ReducerActions.ResetNew:
    case Defines.ReducerActions.Cloud:
      return []
    case Defines.ReducerActions.Attach:
      return store.concat(action.data)
    case Defines.ReducerActions.RemoveAttachment:
      return store.filter((e) => e.id !== action.data)
    default:
      return store
  }
}

export const addAttachment = (object) => {
  return {
    type: Defines.ReducerActions.Attach,
    data: object,
  }
}

export const removeAttachment = (id) => {
  return {
    type: Defines.ReducerActions.RemoveAttachment,
    data: id,
  }
}

export default attachmentReducer
