import './scss/styles.scss';

import {WebLarekAPI} from "./components/WebLarekAPI";
import {API_URL} from "./utils/constants";
import {EventEmitter} from './components/base/events';
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {AppState} from "./components/AppState";
import {Page} from "./components/common/Page";
import {Modal} from "./components/common/Modal";
import {Model} from "./components/base/Model";
import {CatalogItem, CatalogChangeEvent, PreviewCard, BasketCard} from "./components/Card";
import {Basket} from "./components/Basket";
import { IProductCard } from './types';


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
// const preview = new PreviewCard(cloneTemplate(cardPreviewTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
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
  const preview = new PreviewCard(cloneTemplate(cardPreviewTemplate), isInOrder, {
    onClick: () => {
      events.emit('order:changedItem', item);
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
events.on('order:changedItem', (item: IProductCard )=> {
  appData.toggleOrderItems(item);
  page.counter = appData.order.items.length;
});


//Открыть корзину
events.on('basket:open', () => {
  const items: HTMLElement[] = appData.order.items.map(id => {
    const currentCard  = appData.catalog.filter(item => item.id === id)[0]; 
    const cardBasket = new BasketCard(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('order:changedItem', currentCard);
        events.emit('basket:open', currentCard)
      }
    }) 
    return cardBasket.render({
      title: currentCard.title,
      price: currentCard.price
    })
  })
  modal.render({
    content: basket.render({
      items: items,
      total: appData.getTotal()
    })
  });
});


//Заказ: открываем окно с формой доставки
events.on('orderDelivery:open',() => {
  // const orderDelivery = new PreviewCard(cloneTemplate(cardPreviewTemplate), isInOrder, {
  //   onClick: () => {
  //     events.emit('order:changedItem', item);
  //     events.emit('preview:open', item)
  //   }
  // });
})