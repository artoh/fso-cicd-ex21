import NumberFormat from "react-number-format"

const Euro = ({ value }) => {
  return (
    <NumberFormat
      value={parseFloat(value)}
      displayType="text"
      decimalSeparator=","
      thousandSeparator="&nbsp;"
      fixedDecimalScale={true}
      decimalScale={2}
      suffix="&nbsp;€"
    />
  )
}

export default Euro
