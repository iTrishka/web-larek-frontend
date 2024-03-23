export const API_URL = `https://larek-api.nomoreparties.co/api/weblarek`;
export const CDN_URL = `https://larek-api.nomoreparties.co/content/weblarek`;

export const settings = {

};

export enum paymenOption {
  CASH = 'cash',
  CARD = 'card'
}

export enum Event {
  ITEMS_CHANGED = 'items:changed', //изменился сотав товаров
  PREVIEW_OPEN = 'preview:open', //открыть модальное окно с товаром
  BASKET_OPEN = 'basket:open', //открыть корзину
  BASKET_UPDATE = 'basket:change-items', //изменился состав корзины
  MODAL_OPEN = 'modal:open', //открыть модальное окно 
  MODAL_CLOSE = 'modal:close', //закрыть модальное окно
  FORM_DELIVERY_OPEN = 'orderDelivery:open', //открыть модальное окна с формой доставки
  FORM_CONTACTS_OPEN = 'orderContacts:open', //открыть модальное окна с формой контактов
  FORM_DELIVERY_ERROR = 'formDeliveryErrors:change', // изменилось состояние валидации формы доставки
  FORM_CONTACTS_ERROR = 'formContactsErrors:change',  // изменилось состояние валидации формы контактов
  ORDER_UPDATE_PAYMENT = 'order:changePayment', //обновить Способ оплаты в Заказе
  ORDER_UPDATE_ITEMS_TOTAL = 'order:addFromBasket', //обновить список товаров и цены в Заказе
  ORDER_SUBMIT = 'order:submit', // отправка формы заказа
  ORDER_READY = 'order:ready' //форма заполенена и провалидирована
}
