const express = require("express")
const app = express()
const proxy = require("express-http-proxy")

// Heroku dynamically sets a port
const PORT = process.env.PORT || 5050

app.use(express.static("dist"))

app.get("/health", (req, res) => {
  res.send("ok")
})

// We have backend with some micro services
// running at our own server, so we have
// here only a proxy
app.use("/", proxy("https://pilvi.kitsas.fi"))

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})
