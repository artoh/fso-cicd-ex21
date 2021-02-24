import { makeDocument, isEditable, loadDocument } from "./makeDocument"

const accounts = [
  {
    numero: 1700,
    tyyppi: "AO",
    nimi: {
      fi: "Myyntisaamiset",
      sv: "Försäljningsfordringar",
      en: "Accounts receivable",
    },
    erittely: 2,
    laajuus: 1,
  },
  {
    numero: 1910,
    tyyppi: "ARP",
    nimi: {
      fi: "Pankkitili",
      sv: "Bankkonto",
      en: "Bank account",
    },
    laajuus: 1,
  },
  {
    numero: 2960,
    tyyppi: "BO",
    nimi: {
      fi: "Ostovelat",
      sv: "Leverantörsskulder",
      en: "Trade creditors",
    },
    erittely: 2,
    laajuus: 1,
  },
]

const simpleOutcomeVoucher = {
  date: "2021-02-10T06:38:32.486Z",
  cycle: 0,
  type: 100,
  contraAccount: 1910,
  partner: "Some Seller",
  subject: "Test One",
  rows: [
    {
      subject: "",
      account: 4000,
      sector: 0,
      euro: "25.00",
    },
  ],
  duedate: null,
  invoicenr: "",
  ref: "",
  info: "Some info",
  comment: "Some comment",
  mark: false,
  old: {},
}

const simpleIncomeVoucher = {
  date: "2021-02-10T06:38:32.486Z",
  cycle: 0,
  type: 200,
  contraAccount: 1910,
  partner: "Customer",
  subject: "Test Two",
  rows: [
    {
      subject: "",
      account: 3000,
      sector: 1,
      euro: "50.00",
    },
  ],
  duedate: null,
  invoicenr: "",
  ref: "",
  info: "Some info",
  comment: "Some comment",
  mark: true,
  old: {},
}

const simpleDocument = {
  id: 123,
  tunniste: 55,
  sarja: "ML",
  pvm: "2021-02-03",
  tyyppi: 100,
  kumppani: { id: 6, nimi: "Kalle" },
  otsikko: "Subject",
  info: "Some info",
  laskupvm: "2021-02-03",
  viennit: [
    {
      tyyppi: 102,
      pvm: "2021-02-03",
      tili: 1910,
      kredit: "25.00",
      selite: "Subject",
    },
    {
      tyyppi: 101,
      pvm: "2021-02-03",
      tili: 4000,
      kohdennus: 0,
      debet: "25.00",
      selite: "Subject",
    },
  ],
}

describe("Make document", () => {
  test("Simple outcome", () => {
    const doc = makeDocument(simpleOutcomeVoucher, [], 100, accounts)
    const o = JSON.parse(JSON.stringify(doc))

    expect(o.pvm).toEqual("2021-02-10")
    expect(o.tyyppi).toEqual(100)
    expect(o.kierto).not.toBeDefined()
    expect(o.kumppani.nimi).toEqual("Some Seller")
    expect(o.viennit[0].tili).toEqual(1910)
    expect(o.viennit[0].era).not.toBeDefined()

    expect(o.viennit[0].tyyppi).toEqual(102)
    expect(o.viennit[0].kredit).toEqual("25.00")
    expect(o.viennit[0].debet).not.toBeDefined()

    expect(o.viennit[1].tyyppi).toEqual(101)
    expect(o.viennit[1].debet).toEqual("25.00")
    expect(o.viennit[1].kredit).not.toBeDefined()
  })

  test("Simple income", () => {
    const doc = makeDocument(simpleIncomeVoucher, [], 100, accounts)
    const o = JSON.parse(JSON.stringify(doc))

    expect(o.tyyppi).toEqual(200)
    expect(o.viennit[0].tili).toEqual(1910)
    expect(o.viennit[0].era).not.toBeDefined()

    expect(o.viennit[0].tyyppi).toEqual(202)
    expect(o.viennit[0].debet).toEqual("50.00")
    expect(o.viennit[0].kredit).not.toBeDefined()

    expect(o.viennit[1].tyyppi).toEqual(201)
    expect(o.viennit[1].kredit).toEqual("50.00")
    expect(o.viennit[1].debet).not.toBeDefined()
  })
})

describe("Test if document is editable", () => {
  test("Simple outcome", () => {
    const doc = makeDocument(simpleOutcomeVoucher, [], 100, accounts)
    expect(isEditable(doc)).toBeTruthy()
  })
})

describe("Load document", () => {
  test("Simple document", () => {
    expect(isEditable(simpleDocument)).toBeTruthy()
    const v = loadDocument(simpleDocument)

    expect(v.cycle).toEqual(0)
    expect(v.type).toEqual(100)
    expect(v.contraAccount).toEqual(1910)
    expect(v.partner).toEqual("Kalle")
    expect(v.subject).toEqual("Subject")
    expect(v.rows.length).toEqual(1)
    expect(v.rows[0].account).toEqual(4000)
    expect(v.rows[0].sector).toEqual(0)
    expect(v.rows[0].euro).toEqual("25.00")
    expect(v.old.tunniste).toEqual(55)
    expect(v.old.id).toEqual(123)
  })
  test("Id after load and make", () => {
    const v = loadDocument(simpleDocument)
    const d = makeDocument(v, [], 100, accounts)
    expect(d.id).toEqual(123)
    expect(d.tunniste).toEqual(55)
    expect(d.sarja).toEqual("ML")
  })
})
