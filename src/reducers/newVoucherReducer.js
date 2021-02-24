import Defines from "../defines"
import { loadDocument } from "../utils/makeDocument"

const newVoucherReducer = (store = null, action) => {
  switch (action.type) {
    case Defines.ReducerActions.ResetNew:
    case Defines.ReducerActions.Cloud:
      return {
        date: new Date(),
        cycle: 0,
        type: 100,
        contraAccount: 1910,
        partner: "",
        subject: "",
        rows: [{ subject: "", account: 4000, sector: 0, euro: "0.0" }],
        invoicedate: new Date(),
        duedate: null,
        invoicenr: "",
        ref: "",
        info: "",
        comment: "",
        mark: false,
        old: {},
      }
    case Defines.ReducerActions.SetNewField:
      return { ...store, ...action.data }
    case Defines.ReducerActions.EditVoucher:
      return action.data
    default:
      return store
  }
}

export const resetNewVoucher = () => {
  return {
    type: Defines.ReducerActions.ResetNew,
  }
}

export const setField = (field, value) => {
  const object = {}
  object[field] = value
  return {
    type: Defines.ReducerActions.SetNewField,
    data: object,
  }
}

export const editVoucher = (data) => {
  return {
    type: Defines.ReducerActions.EditVoucher,
    data: loadDocument(data),
  }
}

export default newVoucherReducer
