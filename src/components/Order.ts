import { Form } from "./common/Form";
import { IOrderDeliveryForm, IOrderContactsForm } from "../types";
import { IEvents } from "./base/events";
import { IPaymenOption } from "../types";
import { paymenOption, Event } from "../utils/constants";

export interface IOrderActions {
  onClick: (event: MouseEvent) => void;
};

export class OrderDelivery extends Form<IOrderDeliveryForm> {
  protected _button: HTMLElement;
  protected _buttonCash: HTMLElement;
  protected _buttonCard: HTMLElement;
  protected _currentPaymentBtn: HTMLElement;

  constructor(container: HTMLFormElement, events: IEvents, actions?: IOrderActions) {
    super(container, events);

    this._button = this.container.querySelector('.order__button');
    this._buttonCash = this.container.querySelector('button[name="cash"]');
    this._buttonCard = this.container.querySelector('button[name="card"]');
  

    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    };

    this._buttonCash.addEventListener('click', () => {
      this.events.emit(Event.ORDER_UPDATE_PAYMENT, ['cash']);
    });

    this._buttonCard.addEventListener('click', () => {
      this.events.emit(Event.ORDER_UPDATE_PAYMENT, ['card']);
    });
  };

  set payment(value: IPaymenOption) {
    if(value === paymenOption.CARD){
      this._buttonCard.classList.add("button_alt-active");
      this._buttonCash?.classList.remove("button_alt-active");
    }else{
      this._buttonCash.classList.add("button_alt-active");
      this._buttonCard?.classList.remove("button_alt-active");
    };
  };
};


export class OrderContacts extends Form<IOrderContactsForm>  {
  protected _button: HTMLElement; 

  constructor(container: HTMLFormElement, events: IEvents, actions?: IOrderActions){
    super(container, events);
    this._button = this.container.querySelector('.button');

    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    };
  };
};