import {Model} from "./base/Model";
import { IAppState, IProductCard, IOrder, IPaymenOption } from "../types";

export class AppState extends Model<IAppState> {
  catalog: IProductCard[];
  preview: IProductCard;
  basket: string[];
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
  
}