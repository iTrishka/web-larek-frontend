import {Model} from "./base/Model";
import { IAppState, IProductCard, IOrder, FormErrors, IOrderDelivery, IOrderContacts } from "../types";

export class AppState extends Model<IAppState> {
  catalog: IProductCard[];
  loading: boolean;
  order: IOrder = {
    payment: '',
    address: '',
    phone: '',
    email: '', 
    total: 0,
    items: []
  };
  formErrors: FormErrors = {};


  setCatalog(items: IProductCard[]) {
    console.log("items", items)
    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  clearBasket() {
    this.catalog.forEach(item => {
        item.inBasket = false;
    });
  }

  clearOrder() {
    this.order.payment = '';
    this.order.address = '';
    this.order.phone = '';
    this.order.email = '';
    this.order.total = 0;
    this.order.items = [];
  }

  toggleBasketState(item: IProductCard) {
    if(item.price){ 
      item.inBasket = !item.inBasket
    } 
  }

  getAmountItemInBasket(): number {
    const itemInBasket = this.catalog.filter(item => item.inBasket === true)
    return itemInBasket.length
  }

  getTotalPrice(): number {
    let sum = 0;
    const itemsInBasket = this.catalog.filter(item => item.inBasket === true)
    sum = itemsInBasket.reduce((a, c) => a + c.price, 0)
    return sum
  }

  setOrderDeliveryField(field: keyof IOrderDelivery, value: string) {
    this.order[field] = value;
    if (this.validateOrderDelivery()) {
        this.events.emit('order:ready', this.order);
    }
  }

  setOrderContactsField(field: keyof IOrderContacts, value: string) {
    this.order[field] = value;
    if (this.validateOrderContacts()) {
        this.events.emit('order:ready', this.order);
    }
  }

  validateOrderDelivery() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.phone = 'Необходимо указать адрес';
    }
    // if (!this.order.payment) {
    //   errors.phone = 'Необходимо указать способ оплаты';
    // }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateOrderContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.email) {
      errors.phone = 'Необходимо указать email';
    }
    this.formErrors = errors;
    this.events.emit('formContactsErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }


  
}