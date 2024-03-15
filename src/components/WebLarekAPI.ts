import { Api, ApiListResponse } from './base/api';
import { IProductCard, IOrder, IOrderResponse } from '../types';

export interface IWebLarekAPI {
    getCardsList: () => Promise<IProductCard[]>;
    sendOrder: (order: IOrder) => Promise<IOrderResponse>;
};

export class WebLarekAPI extends Api implements IWebLarekAPI {

    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    };

    getCardsList(): Promise<IProductCard[]> {
        return this.get('/product/')
          .then((data: ApiListResponse<IProductCard>) => data.items)
    };

    sendOrder(order: IOrder): Promise<IOrderResponse>{
        return this.post('/order', order)
            .then((data: IOrderResponse) => data)
    };
};