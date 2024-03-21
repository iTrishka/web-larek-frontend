import './scss/styles.scss';

import {WebLarekAPI} from "./components/WebLarekAPI";
import {API_URL, CDN_URL, paymenOption} from "./utils/constants";
import {EventEmitter} from './components/base/events';
import {cloneTemplate, ensureElement} from "./utils/utils";
import {AppState} from "./components/AppState";
import {Page} from "./components/common/Page";
import {Modal} from "./components/common/Modal";
import {CatalogItem, CatalogChangeEvent, PreviewCard, BasketCard} from "./components/Card";
import {Basket} from "./components/Basket";
import {Success} from "./components/Success";
import {OrderDelivery, OrderContacts} from "./components/Order";
import { IProductCard, IOrderForm, IOrderDelivery, IOrderContacts, IPaymenOption } from './types';


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
// const preview = new PreviewCard(cloneTemplate(cardPreviewTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderDelivery = new OrderDelivery(cloneTemplate(formOrderDeliveryTemplate), events, {
  onClick: () => {
    events.emit('orderContacts:open')
    events.emit('order:addFromBasket')
  }
});
const orderContacts = new OrderContacts(cloneTemplate(formOrderContactsTemplate), events, {
  onClick: () => events.emit('order:submit')
} );
// const order = new Order(cloneTemplate(orderTemplate), events);

//___________ Бизнес-логика__________________//

// Получаем товары с сервера
api.getCardsList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
    console.error(err);
  });

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
      const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit('preview:open', item)
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
events.on('preview:open', (item: IProductCard) => {
  const isInOrder = appData.order.items.includes(item.id) ? true : false; 
  const preview = new PreviewCard(cloneTemplate(cardPreviewTemplate), item.inBasket, {
    onClick: () => {
      events.emit('basket:change-items', item);
      events.emit('preview:open', item)
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
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});

// изменился состав корзины
events.on('basket:change-items', (item: IProductCard )=> {
  appData.toggleBasketState(item);
  page.counter = appData.getAmountItemInBasket()
});


//Открыть корзину
events.on('basket:open', () => {
  const itemsInBasket = appData.catalog.filter(item => item.inBasket === true)
  const items = itemsInBasket.map(card => {
    const cardBasket = new BasketCard(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('basket:change-items', card);
        events.emit('basket:open', card)
        console.log(appData.catalog)
      }
    }) 
    return cardBasket.render({
      title: card.title,
      price: card.price
    })
  })
  modal.render({
    content: basket.render({
      items: items,
      total: appData.getTotalPrice()
    })
  });
});



//Заказ: добавить товары и итоговую стомость в заказ
events.on('order:addFromBasket', () => {
  const itemsInBasket = appData.catalog.filter(item => item.inBasket === true)
  itemsInBasket.map(item => {
    appData.order.items.push(item.id)
  })
  appData.order.total = appData.getTotalPrice();
})

//Заказ: открываем окно с формой доставки
events.on('orderDelivery:open',() => {
  appData.order.payment = paymenOption.CARD;
  modal.render({
    content: orderDelivery.render({
      payment: paymenOption.CARD,
      address: '',
      valid: false,
      errors: []
    })
});
})

//Заказ: добавить способ оплаты в заказ
events.on('order:changePayment', (data: Array<string>) => {
  if(data[0] === "cash"){
    appData.order.payment = paymenOption.CASH
    orderDelivery.payment = paymenOption.CASH
  } else {
    appData.order.payment = paymenOption.CARD
    orderDelivery.payment = paymenOption.CARD
  }
  console.log(appData.order.payment)
}) 

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderDelivery>) => {
  const { address } = errors;
  orderDelivery.valid = !address;
  orderDelivery.errors = Object.values({address}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderDelivery, value: string }) => {
  
  appData.setOrderDeliveryField(data.field, data.value);
});

//Заказ: открываем окно с формой контактов
events.on('orderContacts:open',() => {
  modal.render({
    content: orderContacts.render({
      phone: '',
      email: '',
      valid: false,
      errors: []
    })
});

})


// Изменилось состояние валидации формы
events.on('formContactsErrors:change', (errors: Partial<IOrderContacts>) => {
  const { phone, email } = errors;
  console.log(!phone , !email)
  orderContacts.valid = !phone && !email ;
  orderContacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^contacts\..*:change/, (data: { field: keyof IOrderContacts, value: string }) => {
  appData.setOrderContactsField(data.field, data.value);
});

// Отправлена форма заказа
events.on('order:submit', () => {
  console.log(appData.order)
  api.sendOrder(appData.order)
  .then((result) => {
    console.log(result)
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