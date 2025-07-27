import FindInvoiceUseCase from "./find-invoice.usecase"
import Address from "../../domain/value-object/address"
import InvoiceItem from "../../domain/invoice-item"
import Invoice from "../../domain/invoice.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"

const MockRepository = () => ({
  add: jest.fn(),
  find: jest.fn(),
})

describe("Find Invoice UseCase unit test", () => {
  it("should find an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Cliente XPTO",
      document: "12345678900",
      address: new Address("Rua A", "123", "Sala 5", "Cidade B", "Estado C", "99999-000"),
      items: [
        new InvoiceItem({ id: new Id("i1"), name: "Item 1", price: 100 }),
        new InvoiceItem({ id: new Id("i2"), name: "Item 2", price: 200 }),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const repository = MockRepository()
    repository.find.mockResolvedValue(invoice)

    const usecase = new FindInvoiceUseCase(repository)

    const result = await usecase.execute({ id: "1" })

    expect(repository.find).toHaveBeenCalledWith("1")
    expect(result.id).toBe("1")
    expect(result.name).toBe(invoice.name)
    expect(result.document).toBe(invoice.document)
    expect(result.items.length).toBe(2)
    expect(result.total).toBe(300)
  })
})
