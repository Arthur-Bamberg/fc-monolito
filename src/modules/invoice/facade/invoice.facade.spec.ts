import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemModel } from "../repository/invoice-item.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should generate an invoice", async () => {
    const facade = InvoiceFacadeFactory.create()

    const input = {
      name: "Cliente XPTO",
      document: "12345678900",
      street: "Rua A",
      number: "123",
      complement: "Sala 5",
      city: "Cidade B",
      state: "Estado C",
      zipCode: "99999-000",
      items: [
        { id: "i1", name: "Item 1", price: 100 },
        { id: "i2", name: "Item 2", price: 200 },
      ],
    }

    const output = await facade.generate(input)

    expect(output).toBeDefined()
    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.document).toBe(input.document)
    expect(output.street).toBe(input.street)
    expect(output.number).toBe(input.number)
    expect(output.complement).toBe(input.complement)
    expect(output.city).toBe(input.city)
    expect(output.state).toBe(input.state)
    expect(output.zipCode).toBe(input.zipCode)
    expect(output.items.length).toBe(2)
    expect(output.total).toBe(300)
  })

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create()

    const input = {
      name: "Cliente XPTO",
      document: "12345678900",
      street: "Rua A",
      number: "123",
      complement: "Sala 5",
      city: "Cidade B",
      state: "Estado C",
      zipCode: "99999-000",
      items: [
        { id: "i1", name: "Item 1", price: 100 },
        { id: "i2", name: "Item 2", price: 200 },
      ],
    }

    const generated = await facade.generate(input)
    const found = await facade.find({ id: generated.id })

    expect(found).toBeDefined()
    expect(found.id).toBe(generated.id)
    expect(found.name).toBe(input.name)
    expect(found.document).toBe(input.document)
    expect(found.address.street).toBe(input.street)
    expect(found.address.number).toBe(input.number)
    expect(found.address.complement).toBe(input.complement)
    expect(found.address.city).toBe(input.city)
    expect(found.address.state).toBe(input.state)
    expect(found.address.zipCode).toBe(input.zipCode)
    expect(found.items.length).toBe(2)
    expect(found.total).toBe(300)
    expect(found.createdAt).toBeInstanceOf(Date)
  })
})
