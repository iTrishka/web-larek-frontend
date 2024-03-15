import {Component} from "./base/Component";
import { ensureElement } from "../utils/utils";

import { IProductCard, ICatalogItem } from "../types";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export type CatalogChangeEvent = {
  catalog: ICatalogItem[]
};

// export interface ICard {
//   title: string;
//   description?: string | string[];
//   image: string;
// }


export class Card extends Component<ICatalogItem> {
  protected _title: HTMLElement;
  protected _description?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLImageElement;
  protected _price?: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
    this._category = ensureElement<HTMLImageElement>(`.${blockName}__category`, container);
    this._price = ensureElement<HTMLImageElement>(`.${blockName}__price`, container);
  };

  set title(value: string) {
    this.setText(this._title, value);
  };

  get title(): string {
      return this._title.textContent || '';
  };

  set image(value: string) {
    this.setImage(this._image!, value, this.title)
  };

  set description(value: string) {
    this.setText(this._description, value);
  };
  
  set category(value: string) {
    this.setText(this._category!, value);
  };

  set price(value: string) {
    if(value){
      this.setText(this._price!, `${value} синапсов`);
    } else {
      this.setText(this._price!, `Бесплатно`);
    }
  };

}

export class CatalogItem extends Card implements ICatalogItem{
  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
  }
}