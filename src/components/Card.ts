import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";

export interface ICardUI {
  title: string;
  image: string;
  category: string;
  price: number | null;
};

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
};

export class Card extends Component<ICardUI> {
  protected _title: HTMLElement;
  protected _description?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLImageElement;
  protected _price?: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement) {
    super(container);
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._price = ensureElement<HTMLImageElement>(`.${blockName}__price`, container);
  };

  set title(value: string) {
    this.setText(this._title, value);
  };

  get title(): string {
      return this._title.textContent || '';
  };

  set image(value: string) {
    this.setImage(this._image!, `${value}`, this.title)
  };

  set description(value: string) {
    this.setText(this._description, value);
  };
  
  set category(value: string) {
    this.setText(this._category!, value);
  };

  set price(value: number) {
    if(value){
      this.setText(this._price!, `${value} синапсов`);
    } else {
      this.setText(this._price!, `Бесплатно`);
    };
  };
};

export class CatalogItem extends Card {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container);
    this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
    this._category = ensureElement<HTMLImageElement>(`.card__category`, container);

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    };
  };
};

interface IPreviewCardUI extends ICardUI {
  description: string;
};

export class PreviewCard extends Card implements IPreviewCardUI{
  protected _description: HTMLElement;
  protected _button: HTMLElement;
  protected _inBasket: boolean;

  constructor(container: HTMLElement, protected inBasket: boolean, actions?: ICardActions) {
    super('card', container);
    this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
    this._category = ensureElement<HTMLImageElement>(`.card__category`, container);
    this._description = ensureElement<HTMLElement>(`.card__text`, container);
    this._button = this.container.querySelector('.card__button');

    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    };

    this._inBasket = inBasket
  };

  changeButton(){
    if(this._inBasket){
      this.setText(this._button!, "Удалить из корзины");
    } else {
      this.setText(this._button!, "В козину");
    };
  };

  set price(value: number) {
    if(value){
      this.setText(this._price!, `${value} синапсов`);
    } else {
      this.setText(this._price!, `Бесплатно`);
      this.setDisabled(this._button, true)
    };
  };
};

export class BasketCard extends Card {
  protected _button?: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container);
    this._button = this.container.querySelector('.card__button');

    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    };
  };
};
