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
  inBasket: boolean;
};

export type ICatalogItem = Omit<IProductCard, 'description' | 'id'>;
export type IBasketCard = Pick<IProductCard, 'title' | 'price'>[];

export type IBasket= {
  items: IProductCard[];
  total: number;
};

export type IPaymenOption  = 'cash' | 'card' | '';

export interface IOrderForm {
  payment: IPaymenOption;
  address: string;
  phone: string;
  email: string;  
};

export interface IOrder extends IOrderForm{ 
  total: number;
  items: string[];
};

export interface IOrderDelivery {
  // payment: IPaymenOption;
  address: string;
}

export interface IOrderContacts {
  phone: string;
  email: string; 
}

export type IOrderContactsw = Pick<IOrder, 'phone' | 'email'>;

export interface IOrderResponse{
  id: string;
  total: number;
};

export interface IPage {
  counterBasket: number;
  catalog: ICatalogItem[];
  locked: boolean;
};

export type FormErrors = Partial<Record<keyof IOrder, string>>;


export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}