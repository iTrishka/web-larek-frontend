export interface IAppState {
  catalog: IProductCard[];
  basket: IBasket[];
  preview: IProductCard;
  order: IOrder;
  loading: boolean;
};

export interface IProductCard {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
};

export type ICatalogItem = Omit<IProductCard, 'description' | 'id'>;
export type IBasketCard = Pick<IProductCard, 'title' | 'price'>[];

export type IBasket= {
  items: IProductCard[];
  total: number;
};

export type IPaymenOption  = 'cash' | 'card';

export interface IOrder {
  payment: IPaymenOption;
  address: string;
  phone: string;
  email: string;  
  total: number;
  items: string[];
};

export type IOrderDelivery = Pick<IOrder, 'payment' | 'address'>;

export type IOrderContacts = Pick<IOrder, 'phone' | 'email'>;

export interface IOrderResponse{
  id: string;
  total: number;
};

export interface IPage {
  counterBasket: number;
  catalog: ICatalogItem[];
  locked: boolean;
};
