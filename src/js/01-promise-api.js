/*
 * Создание промиса
 *  - Класс Promise
 *  - resolve
 *  - reject
 *  - Promise.prototype.then(onResolve, onReject)
 */

const { reject } = require("lodash")

// Промис - эо объект у которого есть несколько состояний. Pending - в ожидании своего исполнения, fulfilled - выполнено
// с каким то результатом, rejected - отклонено с какой-то ошибкой. Промис это относительно современный способ работы с
// асинхронным кодом

// Чтобы создать промис у нас есть конструктор Promise() в который мы передаем функцию обратного вызова (колбэк), т.е.
// вот так Promise(() => { }), в этой функции ВСЕГДА объявляются два параметра(resolve, reject), где resolve это fulfilled,
// а reject это rejected. К примеру:
// const promise = new Promise((resolve, reject) => {
//   resolve(5);
// }); // это значит что наш промис выполнился успешно и значением этого выполнения будет "5"

// const promise = new Promise((resolve, reject) => {
//   reject(5);
// }); // это значит что наш промис выполнился с ошибкой и значением этого выполнения будет "5"


// Напишем ещё такой пример:
// const promise = new Promise((resolve, reject) => {
//   const canFulfill = Math.random() > 0.5;

 
//   if (canFulfill) {
//     resolve('Промис выполнился успешно, с результатом (исполнен, fulfilled)');
//   }

//     reject('Промис выполнился с ошибкой (отклонён, rejected)');
//   });


// console.log(promise); // видим что в зависимости от результата состояние промиса может быть Pending, если мы
// закоментим наш if, fulfilled если наш if будет true и rejected, если if будет false. В итоге, то что мы передадим
// в наш resolve() и reject(), то и получим в результате во внешний код.

// Как получить результат промиса во внешнем коде? Обернем наш промис дополнительно в setTimeout():

// п.1. Промис:
const promise = new Promise((resolve, reject) => {
  const canFulfill = Math.random() > 0.5;

  setTimeout(() => {
    if (canFulfill) {
      resolve('Промис выполнился успешно, с результатом (исполнен, fulfilled)');
    }

    reject('Промис выполнился с ошибкой (отклонён, rejected)');
  }, 1000);
});

// console.log(promise); // в результате видим что после того как обернули в setTimeout(), наш промис будет в состоянии
// pending

// На прототипе промиса есть метод then - promise.then это просто функция в которую мы передаем колбек:

// promise.then(result => {
//   console.log(result);
// });
// Этой записью мы говорим: если наш промис выполниться успешно(promise.than), т.е.в состояние fulfilled перейдёт, то
// выполни вот эту функцию: result => {console.log(result);}, выполнится асинхронно, в нашем случае через 1000 мсек.
// Это по сути планировка, т.е.мы говорим: когда этот промис выполниться или успешно или не успешно сделай что - то, в случае
// если успешно, выполниться колбек который мы передаем в then.

// У then такая подпись then(onSuccess, onError) - т.е.это значит что мы можем передать в него две функции (аргументами внутри
// then), в нашем примере выше мы передали только одну.Первая функция будет отвечать за обработку успешного результата, а вторая
// за обработку ошибки:

// п.2. Планировщик для нашего промиса:
// promise.then(
//   result => {
//     console.log(`✅ ${result}`);
//   },
//   error => {
//     console.log(`❌ ${error}`);
//   },
// );

// В итоге в п.1 мы создали промис, а в п.2 мы создали планировку, в которой сказали, если промис выполнится успешно, когда это
// произойдёт, выполни функцию result, а если не успешно, то выполни функцию error.И самое интересное, если промис выполнится
// успешно, то его строка, которую мы создавали в условии промиса для успешного сценария: resolve('Промис выполнился успешно,
// с результатом(исполнен, fulfilled)'); подставится на место   result => {console.log(result);}, т.е. в консоль выведется
// текстовое сообщение для успешного выполнения.А если не успешно, то то что мы указали в reject в теле промиса reject('Промис
// выполнился с ошибкой(отклонён, rejected)'); подставится в планировщик на место второго параметра error => {console.log(error);},
// и выведется в консоль текст для сценария ошибки. В шаем планировщике мы назвал наши колбеки result и error, это условные
// названия(для примера), можем как угодно их назвать, хоть х и у, главное понимать что в первый параметр приходит из промиса
// функция которую мы указывали для выполнения в случае успешного сценария, а во второй параметр передается функция для выполнения
// если ошибка.
// Можно даже реализовать так, что наши функции будут вне планировщика и передать в планировщик на место первого и второго
// аргумента и тоже будет работать:

promise.then(onFulfilled, onRejected);

function onFulfilled(result) {
  console.log('onFulfilled -> onFulfilled');
  console.log(`✅ ${result}`);
}

function onRejected(error) {
  console.log('onRejected -> onRejected');
  console.log(`❌ ${error}`);
}

// Выполнился промис или не выполнился решает запись в теле промиса: const canFulfill = Math.random() > 0.5; и далее в
// зависимости от условия if (canFulfill), будет подставляться в планировщик либо успех либо ошибка

// Очень важно, что результат промиса можно получить только внутри наших колбеков, которые мы указываем в планировщике
// на месте аргументов 1 и 2: promise.then(onFulfilled, onRejected); Вне этих колбэков этих данных нету, эти колбэки
// вызываются отложенно(асинхронно), согласно нашему setTimeout, когда наш промис перейдёт в какое - то другое состояние
// кроме ожидания. РЕЗУЛЬТАТ ВЫПОЛНЕНИЯ ПРОМИСА ЕСТЬ ТОЛЬКО В КОЛБЭКЕ, который мы передаем в then(наш планировщик), и больше
// ни где т.к. это асинхронный код

// Далее:

// /*
//  * Цепочки промисов (chaining)
//  * Promise.prototype.catch(error)
//  * Promise.prototype.finally()
//  */

// const promise = new Promise((resolve, reject) => {
//   const canFulfill = Math.random() > 0.5;

//   setTimeout(() => {
//     if (canFulfill) {
//       resolve('Промис выполнился успешно, с результатом (исполнен, fulfilled)');
//     }

//     reject('Промис выполнился с ошибкой (отклонён, rejected)');
//   }, 1000);
// });

// В промисах концепция чейнинга очень похожа на чейнинг методов объекта, где мы к примеру говорили Object.map().filter():

// promise
//   .then(result => {
//     console.log(result);
//   })
//   .then(x => {
//     console.log(x);
//   })

// В такой записи сначала выполнится функция result, по результатам своего выполнения, этот первый then на своё место возвращает ещё один промис,
// и на основе этого промиса выполнится ещё один then с его функцией х, который в результате возвращает undefined, т.к. в нашем примере из функции
// result мы ничего не возвращаем, то возвращается undefined, а то что возвращается из функции result(а именно undefined), его then считает результатом
// выполнения своего промиса, соответсвенно функцией х получит undefined.
// Если к примеру из функции result возвращать 5, то в колбек функцию х, который передает следующий then пойдет эта 5:

// promise
//   .then(result => {
//     console.log(result);
//     return 5;
//   })
//   .then(x => {
//     console.log(x);
//   })

// Ещё раз: первый then на свое место возвращает промис, этот промис выполняется успешно с тем значением, которое из этой функции(колбэек функции первого then)
// мы возвращаем.

// Если добавим ещё один then, то при тако записи promise первого и второго then успешный, но третий then уже получит undefined, 

  // promise
  // .then(result => {
  //   console.log(result);
  //   return 5;
  // })
  // .then(x => {
  //   console.log(x);
  // })
  // .then(y => {
  //   console.log(y);
  // })

// но если во второй then мы в return передадим значение, то и третий then его получит:

  // promise
  // .then(result => {
  //   console.log(result);
  //   return 5;
  //   return result; // если передадим к примеру result, то это и будет результатом then в следующем promise 
  // })
  // .then(x => {
  //   console.log(x);
  //   return 10;
  // })
  // .then(y => {
  //   console.log(y);
  // })

// Идея такая: то что возвращает onSucces в then, то и будет результатом resolve в следующем then. Или возврат
// колбэк функции предыдущего then будет результатом для следующего then

// Распишем ещё раз по шагам: 

// Создали промис в котором прописали условие и далее отложенные функции для успешного выполнения (resolve) и ошибки (reject):
// const promise = new Promise((resolve, reject) => {
//   const canFulfill = Math.random() > 0.5;

//   setTimeout(() => {
//     if (canFulfill) {
//       resolve('Промис выполнился успешно, с результатом (исполнен, fulfilled)');
//     }

//     reject('Промис выполнился с ошибкой (отклонён, rejected)');
//   }, 1000);
// });

// Далее, если согласно условия const canFulfill = Math.random() > 0.5;, в нашем if (canFulfill) true, то выполняется условие
// resolve('Промис выполнился успешно, с результатом (исполнен, fulfilled)'); если же false, то выполнится условие
// reject('Промис выполнился с ошибкой (отклонён, rejected)');

// Если наш if выполнился успешно, то срабатывает запись resolve('Промис выполнился успешно, с результатом (исполнен, 
// fulfilled)'), которая подставляется в then на место result (т.е. на место первого параметра, напомню что первым параметром
// мы указываем успех, а вторым ошибка), соответственно ниже в коде в наш promise на место первого then мы получим:
// запись из resolve: 'Промис выполнился успешно, с результатом (исполнен, fulfilled)

  // promise
  // .then(result => {
  //   console.log(result);
  //   return 5;
  //   return result; // если передадим к примеру result, то это и будет результатом then в следующем promise 
  // })
  // .then(x => {
  //   console.log(x);
  //   return 10;
  // })
  // .then(y => {
  //   console.log(y);
  // })

// Согласно нашим запися Цепочка(чейнинг промисов) будет выполнятся так: если наш промис выполнится успешно, то 
// в наш первый then передается то, что мы указали в return (в нашем случае 5 или result(для резалта мы прописали
// запись: "Промис выполнился успешно, с результатом (исполнен, fulfilled)")), такой результат и выведется в консоль,
// если наш промис отработает с ошибкой, т.е.не выполнится в нашем if условие: const canFulfill = Math.random() > 0.5;
// то результатом будет наш reject('Промис выполнился с ошибкой (отклонён, rejected)'); и следующий then уже не отработает,
// но если успешно, то во второй then передастся значение колбек функции первого then(чтобы сократит запись просто скажем
// что это наша "5"), и далее помис передает значение в третий then и в зависимости от true или false нашего промиса и так
// по всем then в нашей цепочке промисов.Примерно по аналогии с цепочкой методов объекта: Object.map().filter(), т.е.наш
// .filter() будет работать с тем значением, которое передаст ему результат работы метода .map()
  
// then сам по себе ничего не возвращает. Возвращает именно та колбэк функция, которая находится внутри then
// Сам по себе then в такой записи.then() возвращает промис и его значением будет, то что мы возвращаем из функции,
// которую мы в этот then передаем  

// Что если нам необходимо обработат ошибку?

// promise
//   .then(onFulfilled, onRejected)
//   .then(
//     x => {
//       console.log(x);
//       return 10;
//     },
//     error => console.log(error),
//   )
//   .then(
//     y => console.log(y),
//     error => console.log(error),
//   );

// Т.е. на каждом шаге (нашем then), мы вторым колбэком (параметром), обрабатываем ошибку. И если на каком нибуд из then
// вылезет ошибка то, нам необходимо её передать во второй параметр следующего then.Т.е.нам необходимо для каждого then
// каждый раз указывать, если хорошо и если плохо (т.е. два параметра). Чтобы все это упростит, для этого у промисов есть
// блок catch. Для этого в then мы всегда передаем только успешную обработку промиса (т.е. колбэк функцию только для 
// успешной обработки промиса), а в самом конце цепочки мы один раз указываем.catch и эта штука будет каждый раз за нас
// отлавливат ошибку во всей нашей цепочке: .catch(error => console.log(error)) 
// Т.е.если наш промис отклонился то не один then в нашей цепочке не выполниться, и отработает наш catch который мы указываем 
// в конце цепочки, т.е.в нашем примере выдаст сообщение которое мы указывали для reject: 'Промис выполнился с 
// ошибкой(отклонён, rejected)'. 
// В итоге если в нашей цепочке где то оказывается ошибка, все ломается и улетает в catch, где мы её и увидем (это удобно)

promise
  .then(onFulfilled)
  .then(x => {
    console.log(x);

    return 10;
  })
  .then(y => {
    console.log(y);
  })
  .catch(error => console.log(error));

// Если мы хотим по результатам работы нашего промиса в любом случае возвращать какой нибудь результат, в конце нашей
// цепочки указываем .finally(), внутри которого мы тоже передаем колбэек, но без какого либо параметра, т.к. наш файнали
// будет выполняться всегда: .finally(() => console.log('Я буду выполнен в любом случае'));

// promise
//   .then(onFulfilled)
//   .then(x => {
//     console.log(x);

//     return 10;
//   })
//   .then(y => {
//     console.log(y);
//   })
//   .catch(error => console.log(error))
//   .finally(() => console.log('Я буду выполнен в любом случае'));

