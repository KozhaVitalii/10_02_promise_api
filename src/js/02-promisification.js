/*
 * Промисификация:
 * - Поблема доступа к результату промиса с колбеком
 * - Функция которая возвращает промис
 */

// У нас есть некая функция, заказ блюда. Условно заказ официанту, официант идёт и уточняет наличие блюда:
// const makeOrder = dish => {
//   const DELAY = 1000;
// // Соответственно пока официант уточняет, проходит какое то время:
//     setTimeout(() => {
//     // допустим здесь прописали какое то условие
//     }, DELAY);
//   };

// const x = makeOrder('пирожок'); // мы вызвали эту функцию, как получить результат этой функции во внешнем коде?
// console.log(x);

// Никак, если эта функция асинхронная(её результат лежит в теле setTimeout()), то получить её результат в функцию
// makeOrder без промисов невозможно.
// Как быть? Раньше просто использовали колбэки, следующим образом:

// const makeOrder = (dish, onSuccess, onError) => {
//     const DELAY = 1000;

//     const passed = Math.random() > 0.5; // условный пример
    
//     setTimeout(() => {
//         if (passed) {
//         onSuccess('Вот ваше блюдо')
//         } else {
//             onError('Извините закончились продукты')
//         }
//     }, DELAY);
//   };

// makeOrder('пирожок', onMakeOrderSuccess, onMakeOrderError);

// function onMakeOrderSuccess(result) {
//   console.log('onMakeOrderSuccess');
//   console.log(result);
// }

// function onMakeOrderError(error) {
//   console.log('onMakeOrderError');
//   console.log(error);
// }

// В данном примере через колбэк функции, логика такая: наш 'пирожок' подставляется на место dish, наша функция
// onMakeOrderSuccess подставляется на место onSuccess, а наша функция onMakeOrderError на место onError.
// В результате если условие в if true, то вызывается onSuccess(а именно её функция onMakeOrderSuccess) и в
// её result (function onMakeOrderSuccess(result)) приходит эта строка 'Вот ваше блюдо' и далее в консоль выводится,
// если false, то вызывается onError(её функция onMakeOrderError) и в её error(function onMakeOrderError(error))
// приходит строка 'Извините закончились продукты' и в консоль. Такой код работает, но в чем его проблема?: наша функция
// makeOrder вместо того чтобы просто делать заказ должна знать о каких внешних onSuccess и onError:
// const makeOrder = (dish, onSuccess, onError), она какие то доп проверки (if) внутри делает, т.е. эта функция слишком
// много знает о том окружении, которое будет её вызывать и это называется связанность кода. Считается что это не оч. хорошо.

// Нам необходимо, чтобы мы во внешнем коде могли получать строку 'Вот ваше блюдо' или 'Извините закончились продукты', т.е.
// если на нашем примере, то не внутри функции makeOrder, а в функциях onMakeOrderSuccess и onMakeOrderError
// Для этого и придумал промисы, чтобы избавится от колбэеков.

// Далее сделаем так, что наш makeOrder из себя будет возвращать промис:

// const makeOrder = (dish) => {
//     const DELAY = 1000;

// // Создаем промис и в его колбэк помещаем всю нашу логику и преобразуем наш if в логику написания промиса вместо onSuccess
// // указываем resolve, а вместо onError указываем reject:

//     const promise = new Promise((resolve, reject) => {

//         const passed = Math.random() > 0.5; // условный пример

//         setTimeout(() => {
//         if (passed) {
//             resolve('Вот ваше блюдо');
//             }
//             reject('Извините закончились продукты');
//         }, DELAY);
//     });
//   };

// Ок далее попробуем зачейнить наши then:
// makeOrder('пирожок').then(x => console.log(x)); // но увы в такой записи не работает, т.к. мы создали наш промис в
// функции const makeOrder, но мы из этой функии ничего не вернули.Откуда наш .then знает, что в функции makeOrder, есть
// промис ? Ок, для того чтобы на результате функции makeOrder зачейнить then, эта функция должна вернуть промис, поэтому нам
// в конце нашей функции необходимо добавить запись: return promise; Это и есть промиссифкация функций!

// const makeOrder = (dish) => {
//     const DELAY = 1000;

//     const promise = new Promise((resolve, reject) => {

//         const passed = Math.random() > 0.5; // условный пример

//         setTimeout(() => {
//             if (passed) {
//                 resolve('Вот ваше блюдо');
//             }
//             reject('Извините закончились продукты');
//         }, DELAY);
//     });
//     return promise;
// };

// Как это можно все почистить ? Мы можем return поставить вместо const promise (т.к. єто лишняя переменная) и это будет
// результат вызова конструктора Promise:

// const makeOrder = (dish) => {
//     const DELAY = 1000;

//     return new Promise((resolve, reject) => {

//         const passed = Math.random() > 0.5; // условный пример

//         setTimeout(() => {
//             if (passed) {
//                 resolve('Вот ваше блюдо');
//             }
//             reject('Извините закончились продукты');
//         }, DELAY);
//     });
// };


// Это и есть промиссифкация функций! Т.е. когда функция не говорит, дай мне что-то твоё и я вызову это у себя под
// капотом когда придёт время, а она говорит наоборот: вот тебе промис, я тебе обещаю что - то а ты к этому промису можешь
// подцепиться и в результате он, тот промис выполнится либо успешно либо не успешно.

// В итоге результатом нашей функции makeOrder будет промис:

// const p = makeOrder('пирожок'); // вот теперь результатом этой функции будет промис
// console.log(p); // видим в консоле что это промис, который пока ещё в состоянии пендинг, но согласно условию через 1 сек
// он выполнится (const DELAY = 1000;)

// Вот теперь к этому промису можно прицепиться:
// p.then();
// и мы говорим, когда этот промисс выполниться успешно, вызови эту функцию onMakeOrderSuccess, а если не успешно
// вызови эту функцию onMakeOrderError:

// p.then(onMakeOrderSuccess).catch(onMakeOrderError);

// Также можно почистить ещё одну лишнюю переменную: const p = makeOrder('пирожок'); На место вызова этой функции
// makeOrder('пирожок') вернется промис, поэтому мы можем написать вот так:

// makeOrder('пирожок').then(onMakeOrderSuccess).catch(onMakeOrderError);

// function onMakeOrderSuccess(result) {
//   console.log('onMakeOrderSuccess');
//   console.log(result);
// }

// function onMakeOrderError(error) {
//   console.log('onMakeOrderError');
//   console.log(error);
// }

// Наша функция makeOrder больше не знает о том коде, который её вызывает и это не её дело, её задача отдать во вне,
// только результат выполнения промиса, а далее что хотите то и делайте с этим. Это и называется промисификация функций.

// Главное помнить что результат вызова нашего промиса пришедшего из нашей функции makeOrder, есть только в вызове либо
// этой функции onMakeOrderSuccess либо в этой: onMakeOrderError

// Перепишем начисто:

// const makeOrder = dish => {
//   const DELAY = 1000;

//   return new Promise((resolve, reject) => {
//     const passed = Math.random() > 0.5;

//     setTimeout(() => {
//       if (passed) {
//         resolve(`✅ Вот ваш заказ: ${dish}`);
//       }

//       reject('❌ Упс, у нас закончились продукты');
//     }, DELAY);
//   });
// };

// makeOrder('пирожок').then(onMakeOrderSuccess).catch(onMakeOrderError);

// function onMakeOrderSuccess(result) {
//   console.log('onMakeOrderSuccess');
//   console.log(result);
// }

// function onMakeOrderError(error) {
//   console.log('onMakeOrderError');
//   console.log(error);
// }

// Это была промисификация асинхронных функций

/*
 * Промисификация «синхронных» функций
 * - Promise.resolve()
 * - Promise.reject()
 */

// Бывает необходимость промисифицировать и синхронные функции (без отложенного вызова):

// К примеру такую:
// const makeOrder = (dish, onSuccess, onError) => {
//     const passed = Math.random() > 0.5;
//       if (passed) {
//         onSuccess(`✅ Вот ваш заказ: ${dish}`);
//       }
//       onError('❌ Упс, у нас закончились продукты');
//   };

// Самый простой вариант, это прописать так же как и для ассинхронной но без сеттаймаута:

// const makeOrder = (dish, onSuccess, onError) => {
//     return new Promise((resolve, reject) => {
//     const passed = Math.random() > 0.5;
//     if (passed) {
//         resolve(`✅ Вот ваш заказ: ${dish}`);
//     }
//         reject('❌ Упс, у нас закончились продукты');
// });
// };

// makeOrder('пирожок').then(onMakeOrderSuccess).catch(onMakeOrderError);

// function onMakeOrderSuccess(result) {
//   console.log('onMakeOrderSuccess');
//   console.log(result);
// }

// function onMakeOrderError(error) {
//   console.log('onMakeOrderError');
//   console.log(error);
// }

// Это все громоздко и снова передаем какие то колбэки, для этого есть статический метод Promise.resolve

// Эти две записи дают одинаоквый результат:
// 1.
// return Promise.resolve(`✅ Вот ваш заказ: ${dish}`);
// // 2.
// return new Promise(resolve) => {
//     resolve(`✅ Вот ваш заказ: ${dish}`);
// }
// Запись 1 = записи 2

// Таким образом мы по сути меняем:
// makeOrder('пирожок', onMakeOrderSuccess); // здесь мы ссылаемся на внешнюю функцию
// на
// makeOrder('пирожок').then(onMakeOrderSuccess); // здесь нам не надо знать какой либо внешний код мы отдали результат и
// делайте что хотите

// const makeOrder = dish => {
//   return Promise.resolve(`✅ Вот ваш заказ: ${dish}`);
// };

// makeOrder('пирожок').then(onMakeOrderSuccess);

// function onMakeOrderSuccess(result) {
//   console.log('onMakeOrderSuccess');
//   console.log(result);
// }

// function onMakeOrderError(error) {
//   console.log('onMakeOrderError');
//   console.log(error);
// }

// Теперь разберем 100% живой пример чтобы лучше понять промисы:

/*
 * Покемоны с https://pokeapi.co/
 */

// В браузер встроена функция fetch() в которую вставляешь адрес сервера и эта функция на свое место возвращает промис, т.е.
// обещает если все будет хорошо .then() то вернет тебе то что ты просишь (пакемон) и если законсолит то будет вся информация
// про наш пакеон:

// fetch(`https://pokeapi.co/api/v2/pokemon/1`)
//     .then(r => r.json())
//     .then(pokemon => {
//         console.log(pokemon);
//     })
//     .catch(error => console.log(error));

// Данные о покемоне будут только внутри колбека, которые есть в then

// Напишем функцию которую можно будет использовать многократно, суть её будет такая, кидаем в неё id покемона, а она нам по
// этому id выполняет fetch к серверу:

// Просто перенесем наш код, внуть переменной fetchPokemonById:

// const fetchPokemonById = id => {
//   fetch(`https://pokeapi.co/api/v2/pokemon/1`)
//     .then(r => r.json())
//     .then(pokemon => {
//         console.log(pokemon);
//     })
//     .catch(error => console.log(error));
// };

// и в адресе вместо "1" укажим ссылку на переменную id:

// const fetchPokemonById = id => {
//   fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
//     .then(r => r.json())
//     .then(pokemon => {
//         console.log(pokemon);
//     })
//     .catch(error => console.log(error));
// };

// и тепер говорим:
// fetchPokemonById(1); // получаем всё инфо для покимона с id 1
// fetchPokemonById(2); // получаем всё инфо для покимона с id 2

// Проблема такой записи функции в том, что она обрабатывает ошибки, хотя её задача просто получить и передать значение от
// сервера. Можем переписать, вынеся функции во внешний код (для начала):

// const fetchPokemonById = (id, onSuccess, onError) => {
//   fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
//     .then(r => r.json())
//     .then(pokemon => {
//         onSuccess(pokemon);
//     })
//       .catch(error => {
//           console.log('Это в блоке catch');
//           onError(error);
//       });
// };

// fetchPokemonById(1, onFetchSuccess, onFetchError); // получаем всё инфо для покимона с id 1
// fetchPokemonById(2); // получаем всё инфо для покимона с id 2

// function onFetchSuccess(pokemon) {
//     console.log('onFetchSuccess -> onFetchSuccess');
//     console.log(pokemon);
// }

// function onFetchError(error) {
//     console.log('onFetchError -> onFetchError');
//     console.log(error);
// }

// Да, в такой записи мы вынесли функции во вне, но наша функция снова зависит от внешнего кода, так не должно быть, поэтому
// необходимо выполнить промисификацию, т.е. вот так: fetchPokemonById(1).then(onFetchSuccess).catch(onFetchError);

// для этого просто выбрасываем все лишнее из нашей функции и ретерним наш промис: 

const fetchPokemonById = id => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json());
};

// т.е. эта запись возвращает промис: return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json());
// а когда мы эту функцию далее вызываем: fetchPokemonById(1) на её место возвращается промис, к которому мы цепляем then
// чтобы получить успешный результат либо инфо об ошибке: 

fetchPokemonById(1).then(onFetchSuccess).catch(onFetchError);
fetchPokemonById(2).then(onFetchSuccess).catch(onFetchError);
fetchPokemonById(3).then(onFetchSuccess).catch(onFetchError);

// В результате у нас максимально чистая функция которая просто фетчит и приносит данные

// Метод fetch возвращает промис без предварительного объявления промиса, т.е. new Promise(resolve, reject) при использовании
// fetch объявлять не нужно
// fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json()) заменяет new Promise()
// fetch под капотом приблизительно написантак:
// function fetch (url) {
//     return new Promise(...)
// } 
// Это просто функция, которая принимает url и возвращает промис и далее из этой функции фетч мы через return возвращаем
// промис во внешний код (т.е. вызываем функцию которая возвращает промис на который уже цепляем then),как в примере  
// fetchPokemonById(1).then(onFetchSuccess).catch(onFetchError);

function onFetchSuccess(pokemon) {
  console.log('onFetchSuccess -> onFetchSuccess');
  console.log(pokemon);
}

function onFetchError(error) {
  console.log('onFetchError -> onFetchError');
  console.log('Это в блоке catch');
  console.log(error);
}

// makePromise
// const makePromise = () => {
//   return new Promise((resolve, reject) => {
//     const passed = Math.random() > 0.5;

//     setTimeout(() => {
//       if (passed) {
//         resolve('✅ Куку это resolve');
//       }

//       reject('❌ все пропало это reject');
//     }, 2000);
//   });
// };

// makePromise()
//   .then(result => console.log(result))
//   .catch(error => console.log(error));
