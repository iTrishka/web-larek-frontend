interface IAppState {
  catalog: {
    total: number;
    items: IProductCard[];
  };
  preview: IProductCard;
  order: IOrder;
  loading: boolean;
}

export interface IProductCard {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
};

export type ICatalogItem = Omit<IProductCard, 'description'>;

export type IBasket= {
  item: Pick<IProductCard, 'id' | 'title' | 'price'>[]
  total: number
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

export interface IPage {
  counterBasket: number;
  catalog: ICatalogItem[];
  locked: boolean;
};


