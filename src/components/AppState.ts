import {Model} from "./base/Model";
import { IProductCard, IOrder, IOrderDeliveryForm, IOrderContactsForm } from "../types";
import { Event } from "../utils/constants";

export interface IAppState {
  catalog: IProductCard[];
  order: IOrder;
  formErrors: TFormErrors;
};

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

export class AppState extends Model<IAppState> {
  catalog: IProductCard[];
  order: IOrder = {
    payment: '',
    address: '',
    phone: '',
    email: '', 
    total: 0,
    items: []
  };
  formErrors: TFormErrors = {};


  setCatalog(items: IProductCard[]) {
    this.catalog = items;
    this.emitChanges(Event.ITEMS_CHANGED, { catalog: this.catalog });
  };

  clearBasket() {
    this.catalog.forEach(item => {
        item.inBasket = false;
    });
  };

  clearOrder() {
    this.order.payment = '';
    this.order.address = '';
    this.order.phone = '';
    this.order.email = '';
    this.order.total = 0;
    this.order.items = [];
  };

  toggleBasketState(item: IProductCard) {
    if(item.price){ 
      item.inBasket = !item.inBasket
    };
  };

  getItemsInBasket(){
    return this.catalog.filter(item => item.inBasket === true)
  };

  getAmountItemInBasket(): number {
    const itemInBasket = this.catalog.filter(item => item.inBasket === true)
    return itemInBasket.length
  };

  getTotalPrice(): number {
    let sum = 0;
    sum = this.getItemsInBasket().reduce((a, c) => a + c.price, 0)
    return sum
  };

  setOrderDeliveryField(field: "address", value: string) {
    this.order[field] = value;
    this.validateOrderDelivery()
  };

  setOrderContactsField(field: keyof IOrderContactsForm, value: string) {
    this.order[field] = value;
    this.validateOrderContacts();
  };

  validateOrderDelivery() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit(Event.FORM_DELIVERY_ERROR, this.formErrors);
    return Object.keys(errors).length === 0;
  };

  validateOrderContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.email) {
      errors.phone = 'Необходимо указать email';
    }
    this.formErrors = errors;
    this.events.emit(Event.FORM_CONTACTS_ERROR, this.formErrors);
    return Object.keys(errors).length === 0;
  };
};