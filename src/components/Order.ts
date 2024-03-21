import {Form} from "./common/Form";
import {IOrder} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import { IPaymenOption, IOrderDelivery, ICardActions } from "../types";
import {ensureElement} from "../utils/utils";
import { paymenOption } from "../utils/constants";



export class OrderDelivery extends Form<IOrder> {
  protected _button: HTMLElement;
  protected _buttonCash: HTMLElement;
  protected _buttonCard: HTMLElement;
  protected _currentPaymentBtn: HTMLElement;

  constructor(container: HTMLFormElement, events: IEvents, actions?: ICardActions) {
    super(container, events);

    this._button = this.container.querySelector('.order__button');
    this._buttonCash = this.container.querySelector('button[name="cash"]');
    this._buttonCard = this.container.querySelector('button[name="card"]');
  

    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }

    this._buttonCash.addEventListener('click', () => {
      this.events.emit('order:changePayment', ['cash']);
    });

    this._buttonCard.addEventListener('click', () => {
      this.events.emit('order:changePayment', ['card']);
    });
  }

  set payment(value: IPaymenOption) {
    if(value === paymenOption.CARD){
      this._buttonCard.classList.add("button_alt-active");
      this._buttonCash?.classList.remove("button_alt-active");
    }else{
      this._buttonCash.classList.add("button_alt-active");
      this._buttonCard?.classList.remove("button_alt-active");
    }
  }

  set address(value: string) {
      (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}


export class OrderContacts extends Form<IOrder>  {
  protected _button: HTMLElement; 

  constructor(container: HTMLFormElement, events: IEvents, actions?: ICardActions){
    super(container, events);
    this._button = this.container.querySelector('.button');

    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }
  
  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
}

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

}