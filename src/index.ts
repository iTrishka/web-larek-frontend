import './scss/styles.scss';

import {WebLarekAPI} from "./components/WebLarekAPI";
import {API_URL, CDN_URL, paymenOption, Event} from "./utils/constants";
import {EventEmitter} from './components/base/events';
import {cloneTemplate, ensureElement} from "./utils/utils";
import {AppState} from "./components/AppState";
import {Page} from "./components/common/Page";
import {Modal} from "./components/common/Modal";
import {CatalogItem, PreviewCard, BasketCard} from "./components/Card";
import {Basket} from "./components/Basket";
import {Success} from "./components/Success";
import {OrderDelivery, OrderContacts} from "./components/Order";
import { IProductCard, IOrderResponse, IOrderDeliveryForm, IOrderContactsForm, IPaymenOption } from './types';


const events = new EventEmitter();
const api = new WebLarekAPI(API_URL, CDN_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const formOrderDeliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const formOrderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderDelivery = new OrderDelivery(cloneTemplate(formOrderDeliveryTemplate), events, {
  onClick: () => {
    events.emit(Event.FORM_CONTACTS_OPEN)
  }
});
const orderContacts = new OrderContacts(cloneTemplate(formOrderContactsTemplate), events, {
  onClick: () => {
    events.emit(Event.ORDER_UPDATE_ITEMS_TOTAL)
    events.emit(Event.ORDER_SUBMIT)
  }
});

// Получаем товары с сервера
api.getCardsList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
    console.error(err);
  });

// Изменились элементы каталога
events.on(Event.ITEMS_CHANGED, () => {
  page.catalog = appData.catalog.map(item => {
      const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit(Event.PREVIEW_OPEN, item)
      });
      return card.render({
        title: item.title,
        image: item.image,
        category: item.category,
        price: item.price        
      });
  });
});

// Открыть превью товара
events.on(Event.PREVIEW_OPEN, (item: IProductCard) => {
  const preview = new PreviewCard(cloneTemplate(cardPreviewTemplate), item.inBasket, {
    onClick: () => {
      events.emit(Event.BASKET_UPDATE, item);
      events.emit(Event.PREVIEW_OPEN, item)
    }
  });
  preview.changeButton();
  modal.render({
      content: preview.render({
        title: item.title,
        image: item.image,
        category: item.category,
        price: item.price
      })
  });
});

// Блокируем прокрутку страницы если открыта модалка
events.on(Event.MODAL_OPEN, () => {
  page.locked = true;
});

// ... и разблокируем
events.on(Event.MODAL_CLOSE, () => {
  page.locked = false;
});

// изменился состав корзины
events.on(Event.BASKET_UPDATE, (item: IProductCard )=> {
  appData.toggleBasketState(item);
  page.counter = appData.getAmountItemInBasket()
});

//Открыть корзину
events.on(Event.BASKET_OPEN, () => {
  const items = appData.getItemsInBasket().map(card => {
    const cardBasket = new BasketCard(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit(Event.BASKET_UPDATE, card);
        events.emit(Event.BASKET_OPEN, card)
      }
    })
    return cardBasket.render({
      title: card.title,
      price: card.price
    })
  });
  modal.render({
    content: basket.render({
      items: items,
      total: appData.getTotalPrice()
    })
  });
});

//Заказ: добавить товары и итоговую стомость в заказ
events.on(Event.ORDER_UPDATE_ITEMS_TOTAL, () => {
  appData.getItemsInBasket().map(item => {
    appData.order.items.push(item.id)
  })
  appData.order.total = appData.getTotalPrice();
});

//Заказ: открываем окно с формой доставки
events.on(Event.FORM_DELIVERY_OPEN,() => {
  appData.order.payment = paymenOption.CARD;
  modal.render({
    content: orderDelivery.render({
      payment: paymenOption.CARD,
      address: '',
      valid: false,
      errors: []
    })
  });
});

//Заказ: добавить способ оплаты в заказ
events.on(Event.ORDER_UPDATE_PAYMENT, (data: Array<string>) => {
  if(data[0] === "cash"){
    appData.order.payment = paymenOption.CASH
    orderDelivery.payment = paymenOption.CASH
  } else {
    appData.order.payment = paymenOption.CARD
    orderDelivery.payment = paymenOption.CARD
  };
}); 

// Изменилось состояние валидации формы
events.on(Event.FORM_DELIVERY_ERROR, (errors: Partial<IOrderDeliveryForm>) => {
  const { address } = errors;
  orderDelivery.valid = !address;
  orderDelivery.errors = Object.values({address}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: "address", value: string }) => {
  appData.setOrderDeliveryField(data.field, data.value);
});

//Заказ: открываем окно с формой контактов
events.on(Event.FORM_CONTACTS_OPEN,() => {
  modal.render({
    content: orderContacts.render({
      phone: '',
      email: '',
      valid: false,
      errors: []
    })
  });
});

// Изменилось состояние валидации формы
events.on(Event.FORM_CONTACTS_ERROR, (errors: Partial<IOrderContactsForm>) => {
  const { phone, email } = errors;
  orderContacts.valid = !phone && !email ;
  orderContacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей формы контактов
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderContactsForm, value: string }) => {
  appData.setOrderContactsField(data.field, data.value);
});

// Отправлена форма заказа
events.on(Event.ORDER_SUBMIT, () => {
  api.sendOrder(appData.order)
  .then((result: IOrderResponse) => {
    appData.clearBasket();
    appData.clearOrder();
    page.counter = appData.getAmountItemInBasket()
    const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
            modal.close();
        }
    });
    modal.render({
      content: success.render({
        description: result.total
      })
  });

  })
  .catch(err => {
      console.error(err);
  });
});