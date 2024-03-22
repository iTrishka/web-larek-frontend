import { paymenOption } from "../utils/constants";

export interface IProductCard {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
  inBasket: boolean;
};

export interface IOrder { 
  payment: IPaymenOption | '';
  address: string;
  phone: string;
  email: string;
  total: number;
  items: string[];
};

export type IPaymenOption  = paymenOption | '';

export type IOrderDeliveryForm = Pick<IOrder, 'payment' | 'address'>;

export type IOrderContactsForm = Pick<IOrder, 'phone' | 'email'>;

export interface IOrderResponse{
  id: string;
  total: number;
};


