import {Model} from "./base/Model";
import { IAppState, IProductCard, IOrder, IBasket, IPaymenOption } from "../types";

export class AppState extends Model<IAppState> {
  catalog: IProductCard[];
  loading: boolean;
  order: IOrder = {
    payment: 'cash',
    address: '',
    phone: '',
    email: '', 
    total: 0,
    items: []
  }

  setCatalog(items: IProductCard[]) {
    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  toggleOrderItems(item: IProductCard) {
    if(!this.order.items.includes(item.id) && item.price){
      this.order.items.push(item.id)
    } else {
      this.order.items = this.order.items.filter((id)=> id !== item.id)
    }
  }

  getTotal(): number {
    let sum = 0;
    this.order.items.map(id => {
      sum =  sum + this.catalog.find(it => it.id === id).price;
    })
    return sum
  }
}