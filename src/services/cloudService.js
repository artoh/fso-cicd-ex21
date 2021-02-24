import axios from "axios"
import dataurl from "dataurl"

let cloudToken
let cloudUrl

export const getConfig = () => {
  return { headers: { authorization: `bearer ${cloudToken}` } }
}

export const getUrl = (path) => {
  return cloudUrl + path
}

export const putVoucher = async (data) => {
  const response = await axios.put(
    getUrl("/tositteet/" + data.id),
    data,
    getConfig()
  )
  return response.data
}

export const addComment = async (docId, comment) => {
  const response = await axios.post(
    getUrl("/tositteet/" + docId),
    {
      teksti: comment,
    },
    getConfig()
  )
  return response.status
}

const login = async (email, password) => {
  console.log("login with email", email)
  const response = await axios.post("/api/login", {
    email: email,
    password: password,
    version: "WebKitsas",
    os: window.navigator.platform,
  })
  console.log(response.data)
  return response.data
}

const initCloud = async (cloud) => {
  console.log("Init cloud", cloud.url)
  cloudToken = cloud.token

  const url = new URL(cloud.url)
  cloudUrl = url.pathname

  const response = await axios.get(getUrl("/init"), getConfig())
  return response.data
}

const getWorklist = async () => {
  const response = await axios.get(getUrl("/kierrot/tyolista"), getConfig())
  return response.data
}

export const getPartnerNames = async () => {
  const response = await axios.get(getUrl("/kumppanit"), getConfig())
  const names = response.data.map((e) => e.nimi)
  return names
}

export const attach = async (object) => {
  const parsed = dataurl.parse(object.data)
  console.log(parsed)
  const file = parsed.data
  const filename = object.file.name.replace(/[\w]/gu, "")
  const mimetype = object.file.type
  const config = {
    headers: {
      ...getConfig().headers,
      "Content-Type": mimetype,
      Filename: filename,
    },
    timeout: 30000,
  }
  const response = await axios.post(
    getUrl(mimetype === "application/pdf" ? "/liitteet?ocr=json" : "/liitteet"),
    file,
    config
  )
  return response
}

export const saveDocument = async (document) => {
  if (document.id) {
    return await axios.put(
      getUrl("/tositteet/" + document.id),
      document,
      getConfig()
    )
  } else {
    return await axios.post(getUrl("/tositteet"), document, getConfig())
  }
}

const toExport = { login, initCloud, getWorklist }
export default toExport
