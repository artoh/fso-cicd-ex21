import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"

import cloudReducer from "./reducers/cloudReducer"
import newVoucherReducer from "./reducers/newVoucherReducer"
import attachmentReducer from "./reducers/attachmentReducer"

const reducer = combineReducers({
  cloud: cloudReducer,
  newVoucher: newVoucherReducer,
  attachments: attachmentReducer,
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store
