// У карточки продукта 3 варианта отображения c разным набором свойств(в галерее, карточке товара, корзине).
export interface IProductCard {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
};

export type IPaymenOption  = 'cash' | 'card';

export interface IProfile {
  payment: IPaymenOption;
  address: string;
  phone: string;
  email: string;
}

export type ICatalogItem = Omit<IProductCard, 'description'>;

export type ICart= {
  item: Pick<IProductCard, 'id' | 'title' | 'price'>[]
  total: number
};

export type IOrder = IProfile & {
  total: number;
  items: string[]
};

export interface IPage {
  amountItems: number;
  catalog: ICatalogItem;
  loading: boolean
}


