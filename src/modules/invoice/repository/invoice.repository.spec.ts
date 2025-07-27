import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object"
import Invoice from "../domain/invoice.entity"
import { InvoiceModel } from "./invoice.model"
import { InvoiceItemModel } from "./invoice-item.model"
import Address from "../../@shared/domain/value-object/address"
import InvoiceItem from "../domain/invoice-item.value-object"
import InvoiceRepository from "./invoice.repository"

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    })

    await sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create an invoice with items", async () => {
    const invoiceId = new Id("1")

    const address = new Address(
      "Rua A",
      "123",
      "Sala 5",
      "Cidade B",
      "Estado C",
      "99999-000",
    )

    const items = [
      new InvoiceItem({ id: new Id("i1"), name: "Item 1", price: 50 }),
      new InvoiceItem({ id: new Id("i2"), name: "Item 2", price: 150 }),
    ]

    const invoice = new Invoice({
      id: invoiceId,
      name: "Cliente XPTO",
      document: "12345678900",
      address,
      items,
    })

    const invoiceRepository = new InvoiceRepository()
    await invoiceRepository.add(invoice)

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoiceId.id },
      include: [{ model: InvoiceItemModel }],
    })

    expect(invoiceDb.id).toEqual("1")
    expect(invoiceDb.name).toEqual("Cliente XPTO")
    expect(invoiceDb.document).toEqual("12345678900")
    expect(invoiceDb.InvoiceItems.length).toBe(2)
    expect(invoiceDb.InvoiceItems[0].name).toEqual("Item 1")
    expect(invoiceDb.InvoiceItems[0].price).toEqual(50)
    expect(invoiceDb.InvoiceItems[1].name).toEqual("Item 2")
    expect(invoiceDb.InvoiceItems[1].price).toEqual(150)
  })

  it("should find an invoice", async () => {
    await InvoiceModel.create(
      {
        id: "1",
        name: "Cliente XPTO",
        document: "12345678900",
        street: "Rua A",
        number: "123",
        complement: "Sala 5",
        city: "Cidade B",
        state: "Estado C",
        zipCode: "99999-000",
        createdAt: new Date(),
        updatedAt: new Date(),
        InvoiceItems: [
          {
            id: "i1",
            name: "Item 1",
            price: 50,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "i2",
            name: "Item 2",
            price: 150,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    )

    const invoiceRepository = new InvoiceRepository()
    const invoice = await invoiceRepository.find("1")

    expect(invoice.id.id).toEqual("1")
    expect(invoice.name).toEqual("Cliente XPTO")
    expect(invoice.document).toEqual("12345678900")
    expect(invoice.address.city).toEqual("Cidade B")
    expect(invoice.items.length).toBe(2)
    expect(invoice.items[0].name).toEqual("Item 1")
    expect(invoice.items[0].price).toEqual(50)
    expect(invoice.items[1].name).toEqual("Item 2")
    expect(invoice.items[1].price).toEqual(150)
  })
})
