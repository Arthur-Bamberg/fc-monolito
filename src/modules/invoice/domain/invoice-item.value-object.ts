import ValueObject from "../../@shared/domain/value-object/value-object.interface"
import Id from "../../@shared/domain/value-object/id.value-object"

export default class InvoiceItem implements ValueObject {
  private _id: Id
  private _name: string
  private _price: number

  constructor(props: { id?: Id; name: string; price: number }) {
    this._id = props.id || new Id()
    this._name = props.name
    this._price = props.price
  }

  get id(): Id {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get price(): number {
    return this._price
  }
}
