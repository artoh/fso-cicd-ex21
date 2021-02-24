import dayjs from "dayjs"

import Defines from "../defines"

export const makeDocument = (voucher, attachemnts, status, accounts) => {
  const old = {}
  if (voucher.old) {
    for (const [key, value] of Object.entries(voucher.old)) {
      if (key !== "liitteet" && key !== "loki" && key !== "viennit") {
        old[key] = value
      }
    }
  }

  const document = {
    ...old,
    pvm: dayjs(voucher.date).format("YYYY-MM-DD"),
    tyyppi: voucher.type,
    tila: status,
    otsikko: voucher.subject.length > 0 ? voucher.subject : undefined,
    info: voucher.info.length > 0 ? voucher.info : undefined,
    laskupvm: dayjs(voucher.invoicedate).format("YYYY-MM-DD"),
    erapvm: voucher.duedate
      ? dayjs(voucher.duedate).format("YYYY-MM-DD")
      : undefined,
    viite: voucher.ref.length > 0 ? voucher.ref : undefined,
    kierto: voucher.cycle > 0 ? voucher.cycle : undefined,
    huomio: voucher.mark === true ? true : undefined,
    liita: attachemnts.map((a) => parseInt(a.id)),
  }

  if (voucher.invoicenr.length > 0) {
    document.lasku = { numero: voucher.invoicenr }
  }
  if (voucher.comment.length > 0) {
    document.kommentti = { teksti: voucher.comment }
  }
  if (voucher.partner.length > 0) {
    document.kumppani = { nimi: voucher.partner }
  }

  const rowSum = voucher.rows.reduce(
    (pre, cur) => pre + parseFloat(cur.euro),
    0.0
  )

  const contraAccount = accounts.find(
    (a) => a.numero === voucher.contraAccount && !a.tyyppi.startsWith("H")
  )

  const contraEntry = {
    pvm: dayjs(voucher.date).format("YYYY-MM-DD"),
    tili: voucher.contraAccount,
    selite: voucher.subject.length > 0 ? voucher.subject : undefined,
    tyyppi:
      voucher.type === Defines.VoucherType.Income
        ? Defines.VoucherType.Income + Defines.EntryType.Contrabooking
        : Defines.VoucherType.Outcome + Defines.EntryType.Contrabooking,
  }

  if (contraAccount && contraAccount.erittely) contraEntry.era = { id: -1 }
  if (voucher.partner.length > 0)
    contraEntry.kumppani = { nimi: voucher.partner }

  if ((voucher.type === Defines.VoucherType.Income) ^ (rowSum > 0.0)) {
    contraEntry.kredit = Math.abs(rowSum).toFixed(2)
  } else {
    contraEntry.debet = Math.abs(rowSum).toFixed(2)
  }

  const entries = [contraEntry]

  voucher.rows.forEach((row) => {
    const entry = {
      pvm: dayjs(voucher.date).format("YYYY-MM-DD"),
      tili: row.account,
      kohdennus: row.sector,
      selite:
        row.subject.length > 0
          ? row.subject
          : voucher.subject.length > 0
          ? voucher.subject
          : undefined,
      tyyppi:
        voucher.type === Defines.VoucherType.Income
          ? Defines.VoucherType.Income + Defines.EntryType.Booking
          : Defines.VoucherType.Outcome + Defines.EntryType.Booking,
    }
    if (voucher.partner.length > 0) entry.kumppani = { nimi: voucher.partner }
    const rowEuro = parseFloat(row.euro)
    if ((voucher.type === Defines.VoucherType.Income) ^ (rowEuro > 0.0)) {
      entry.debet = Math.abs(rowEuro).toFixed(2)
    } else {
      entry.kredit = Math.abs(rowEuro).toFixed(2)
    }
    entries.push(entry)
  })

  document.viennit = entries

  return document
}

export const isEditable = (doc) => {
  if (doc.viennit.length < 2) return false
  const contra = doc.viennit[0]

  if (
    doc.tyyppi === Defines.VoucherType.Outcome ||
    doc.tyyppi === Defines.VoucherType.Expences
  ) {
    if (
      contra.tyyppi !==
      Defines.VoucherType.Outcome + Defines.EntryType.Contrabooking
    )
      return false
  } else if (doc.tyyppi === Defines.VoucherType.Income) {
    if (
      contra.tyyppi !==
      Defines.VoucherType.Income + Defines.EntryType.Contrabooking
    )
      return false
  } else {
    return false
  }

  doc.viennit.forEach((v, index) => {
    if (index > 0) {
      if (
        (doc.tyyppi === Defines.VoucherType.Outcome ||
          doc.tyyppi === Defines.VoucherType.Expences) &&
        v.tyyppi !== Defines.VoucherType.Outcome + Defines.EntryType.Booking
      )
        return false
      if (
        doc.tyyppi === Defines.VoucherType.Income &&
        v.tyyppi !== Defines.VoucherType.Income + Defines.EntryType.Booking
      )
        return false
    }
    if (v.jaksoalkaa || v.jaksoloppuu) return false
  })
  return true
}

export const loadDocument = (doc) => {
  const rows = []
  doc.viennit.forEach((v) => {
    if (v.tyyppi % 100 === Defines.EntryType.Booking) {
      const debet = v.debet ? parseFloat(v.debet) : 0.0
      const kredit = v.kredit ? parseFloat(v.kredit) : 0.0
      const euro =
        doc.tyyppi === Defines.VoucherType.Income
          ? kredit - debet
          : debet - kredit
      rows.push({
        subject: v.selite === doc.otsikko ? "" : v.selite,
        account: v.tili,
        sector: v.kohdennus,
        euro: euro.toFixed(2),
      })
    }
  })

  return {
    date: dayjs(doc.pvm).toDate(),
    cycle: doc.kierto ? doc.kierto : 0,
    type: doc.tyyppi,
    contraAccount: doc.viennit[0].tili,
    partner: doc.kumppani ? doc.kumppani.nimi : "",
    subject: doc.otsikko ? doc.otsikko : "",
    rows: rows,
    invoicedate: dayjs(doc.laskupvm).toDate(),
    duedate: doc.erapvm ? dayjs(doc.erapvm).toDate() : null,
    invoicenr: doc.lasku && doc.lasku.numero ? doc.lasku.numero : "",
    ref: doc.viite ? doc.viite : "",
    info: doc.info ? doc.info : "",
    mark: doc.huomio ? true : false,
    old: doc,
    comment: "",
  }
}
