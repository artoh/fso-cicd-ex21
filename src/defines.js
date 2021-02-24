const Defines = {
  ReducerActions: {
    Cloud: "CLOUD",
    ResetNew: "RESETNEW",
    SetNewField: "SETNEWFIELD",
    Attach: "ATTACH",
    RemoveAttachment: "REMOVEATTACHMENT",
    EditVoucher: "EDITVOUCHER",
  },
  VoucherType: {
    Outcome: 100,
    Expences: 110,
    Income: 200,
  },
  EntryType: {
    Booking: 1,
    Contrabooking: 2,
  },
  VoucherStatus: {
    Rejected: 10,
    Received: 20,
    Checked: 30,
    Accepted: 40,
    Draft: 50,
    Booked: 100,
  },
}

export default Defines
