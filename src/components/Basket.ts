import {Component} from "./base/Component";
import {createElement, ensureElement, formatNumber} from "../utils/utils";
import {EventEmitter} from './base/events';
import { Event } from "../utils/constants";

export type IBasketUI= {
  items: HTMLElement[] | [];
  total: number;
  disableButton: void;
};

export class Basket extends Component<IBasketUI> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLElement>('.button', this.container);

    if (this._button) {
        this._button.addEventListener('click', () => {
            events.emit(Event.FORM_DELIVERY_OPEN);
        });
    };
  };

  disableButton(value: string){
    this._button.setAttribute("disabled", value)
  };

  set items(items: HTMLElement[]) {
    if (items.length) {
        this._list.replaceChildren(...items);
        this._button.removeAttribute("disabled")
    } else {
        this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
            textContent: 'Добавьте товары'
            
        }));
        this.disableButton("true")
    };
  };

  set total(total: number) {
    this.setText(this._total, `${formatNumber(total)} синапсов`);
  };
};