import { Api, ApiListResponse } from './base/api';
import { IProductCard, IOrder, IOrderResponse } from '../types';

export interface IWebLarekAPI {
    getCardsList: () => Promise<IProductCard[]>;
    sendOrder: (order: IOrder) => Promise<IOrderResponse>;
};

export class WebLarekAPI extends Api implements IWebLarekAPI {
    readonly cdn: string;

    constructor(baseUrl: string, cdn: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    };

    getCardsList(): Promise<IProductCard[]> {
        return this.get('/product/')
          .then((data: ApiListResponse<IProductCard>) =>  data.items.map((item: IProductCard) => ({
            ...item,
            image: this.cdn + item.image,
            inBasket: false
        })))
    };

    sendOrder(order: IOrder): Promise<IOrderResponse>{
        return this.post('/order', order)
            .then((data: IOrderResponse) => data)
    };  
};