import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => ({
  add: jest.fn(),
  find: jest.fn(),
})

describe("Generate Invoice UseCase unit test", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

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

    const output = await usecase.execute(input)

    expect(repository.add).toHaveBeenCalled()
    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.document).toBe(input.document)
    expect(output.items.length).toBe(2)
    expect(output.total).toBe(300)
  })
})
