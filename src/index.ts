import './scss/styles.scss';

import {WebLarekAPI} from "./components/WebLarekAPI";
import {API_URL} from "./utils/constants";
import {EventEmitter} from './components/base/events';
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {AppState} from "./components/AppState";
import {Page} from "./components/common/Page";
import {Modal} from "./components/common/Modal";
import {Model} from "./components/base/Model";
import {CatalogItem, CatalogChangeEvent} from "./components/Card";


const events = new EventEmitter();
const api = new WebLarekAPI(API_URL);


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
// const basket = new Basket(cloneTemplate(basketTemplate), events);
// const order = new Order(cloneTemplate(orderTemplate), events);

//___________ Бизнес-логика__________________//

// Получаем товары с сервера
api.getCardsList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
    console.error(err);
  });

// Изменились элементы каталога
events.on<CatalogChangeEvent>('event ', () => {
  page.catalog = appData.catalog.map(item => {
      const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit('card:modal', item)
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
events.on('order:open', () => {
  modal.render({
      content: order.render({
          phone: '',
          email: '',
          valid: false,
          errors: []
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









// api.getCardsList();
// api.sendOrder({
//   "payment": 'cash',
//   "address": '1 hhh',
//   "phone": 'ddd',
//   "email": 'aa',
//   "total": 2200,
//   "items": [
//     "854cef69-976d-4c2a-a18c-2aa45046c390",
//     "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
//   ]
// });


// Изменились элементы каталога
// events.on<CatalogChangeEvent>('items:changed', () => {
//   page.catalog = appData.catalog.map(item => {
//       const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
//           onClick: () => events.emit('card:select', item)
//       });
//       return card.render({
//           title: item.title,
//           image: item.image,
//           description: item.about,
//           status: {
//               status: item.status,
//               label: item.statusLabel
//           },
//       });
//   });

//   page.counter = appData.getClosedLots().length;
// });
