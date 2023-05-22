import '../css/common.css';


// У нас есть список коней, которые будут бегать на иподроме:
const horses = [
  'Secretariat',
  'Eclipse',
  'West Australian',
  'Flying Fox',
  'Seabiscuit',
];

// Наши базовые функции на основе которых выполняется весь последующий функцонал (код):
// получаем наш промис:
function run(horse) {
  return new Promise(resolve => {
    const time = getRandomTime(2000, 3500);

    setTimeout(() => {
      resolve({ horse, time });
    }, time);
  });
}

// получаем случайное число для времени забега:
function getRandomTime(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}




// для начала сделаем функцию, которая будет запускать одного коня, т.е. функция один конь побежал/
// В функцию бум передават имя лошади, и из этой функции мы будем возвращать промис
// function run (horse) {
//   return new Promise((resolve, reject) => {
//     // запишем переменную в которую передадим рандомное время, для того чтобы указать сколько времени будет бежать лошадь:
//     const time = getRandomTime(2000, 3500)
//     // далее укажем сет таймаут для того чтобы отложить время добегания нашей лошади до финиша, тоже время, что и в time
//     setTimeout(() => {
//   // внутри пропишем резолв, в котором хотим чтобы возвращалось имя лошадии время за которое она пробежала:
//     resolve({horse, time})
//     }, time);
//   })
// }

// и далее промис который мы получим из функции run будем обрабатывать через then:
// run('Манго')
//   .then(x => console.log(x))
//   .catch(e => console.log(e));

// В итоге наша функция run принимает имя лошади run (horse) и возвращает новый промис return new Promise(с условием внутри),
// который говорит лошадь сейчас побежит, а результат забега мы узнаем в своем коде, подцепившись к этому промису через наши
// then.
// Она стартует: return new Promise((resolve, reject)
// и за это время: const time = getRandomTime(2000, 3500)
// она прибегает: resolve({hourse, time})
// Результатом прибегания лошади будет объект {hourse, time}, с её именем и результатом её забега:
// вот здесь: run('Манго').then(x => console.log(x)), при этом catch не обязательно т.к. ошибки не будет, можно просто
// .then(x => console.log(x))

// Пропишем функцию которая будет возвращать рандомное минимальное и максимальное время, используем её для того
// чтобы разнообразить результат нашего промиса, просто чтобы получит рандомное время за которое лошадь будет бегать:

// function getRandomTime(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// Соответственно мы можем объявить что наш заезд начался и наша пока ещё единственная лошадь побежала:
// console.log(
//   '%c Заезд начался, ставки не принимаются',
//   'color: brown; font-size: 14px;',
// );

// Получаем результат промиса:
// run('Манго').then(x => console.log(x))

// наша функция с запуском лошади и получением результата в промисе:
// function run (horse) {
//   return new Promise((resolve, reject) => {
//      const time = getRandomTime(2000, 3500)
//      setTimeout(() => {
//     resolve({horse, time})
//     }, time);
//   })
// }
// Синхронный код: сналача выводится сообщение о начале заезда, а потом результат промиса с использованием сет таймаута

// Теперь нам необходимо запустить всех лошадей (т.е. весь наш массив). Как быть?

// Что мы можем делать с промисами ? Если нам нужно отследить результат выполнения сразу целой коллекции промисов, мы можем
// создать массив промисов:

// const promises = horses.map(horse => run(horse)); // что мы здесь делаем? Проходимся по массиву лошадей (horses), создаем
// новый массив horses.map, при этом для каждой лошади мы выполняем функцию run: horse => run(horse), которая для каждой
// лошади возвращает промис, в результате чего мы получаем массив промисов: promises.
// Эту запись horse => run(horse) можно сократить до run, т.к.мы передаем колбэк run, а значит каждая наша лошадь из массива
// при выполнении функции пойдёт в этот параметр function run (horse)
// const promises = horses.map(run);

// Ок, массив промисов получили, но как нам теперь обработать эту целую коллекцию промисов? Для этого у нас есть два
// статических метода: Promise.race([]) и Promise.all([])

// Promise.race([]) это статический метод на конструкторе Promise для ожидания первого выполнившегося промиса.
// Метод Promise.race([]) принимает массив промисов:

// Promise.race([horses]); // передаем в него коллекцию промисов наших лошадей. Как он работает? Он ждет выполнение
// самого быстрого промиса и возвращает его через then. Т.е. если у нас к примеру есть промисы: 1, 2, 3, 4, 5 и к примеру
// промис 2 выполнился быстрее всех(к примеру за 1 сек), то наш Promise.race([]) вернет чере then только значение этого самого
// быстрого промиса: Promise.race([promises]).then(x => console.log(x));

// Т.е.с помощью этого метода в нашей задаче мы можем получить самую быструю лошадь:

// console.log(
//   '%c Заезд начался, ставки не принимаются',
//   'color: brown; font-size: 14px;',
// );

// const promises = horses.map(run);
// console.log(promises); // получаем массив промисов

// Promise.race(promises).then(x => console.log(x));

// Результат промиса это буквално вот эта часть (объект): {horse, time} в записи resolve({horse, time}), поэтому мы можем
// его деструктуризировать в нашем then и поставить какую то дополнительную информацию в консоль лог:

// Promise.race(promises).then(({ horse, time }) => {
//   console.log(
//     `%c Победил ${horse}, финишировав за ${time} времени`,
//     'color: green; font-size: 14px;',
//   );
// });


// function run (horse) {
//   return new Promise((resolve, reject) => {
//      const time = getRandomTime(2000, 3500)
//      setTimeout(() => {
//     resolve({horse, time})
//     }, time);
//   })
// }

// Окей мы получили самую быструю лошадь, а как получить результаты забега для всех лошадей? Для этого есть метод
// Promise.all([]), он дожидается выполнения абсолютно всех промисов в массиве и на свое место возвращает промис значением
// которого будет результат выполнения всех промисов в массиве.
// Работает просто, указываем в него наш массив промисов:

// Promise.all(promises).then(x => console.log(x)); // все лошади

// Promise.all(promises).then(() => {
//   console.log(
//     `%c Заезд окончен, принимаются ставки`,
//     'color: blue; font-size: 14px;',
//   );
// });

// Ок с этим разобрались, теперь осталось нарисовать все красиво в браузере:

// В html у нас есть такая разметка:

//  <button class="js-start-race">Следующий заезд</button> // кнопка которой мы запускаем следующий заезд
//     <hr />
//     <p class="js-winner"></p>  // в этом абзаце мы отображаем нашу выигравшую лошадь
//     <p class="js-progress"></p> // в этом абзаце мы отображаем текущий статус заезда
//     <hr />

// И ниже таблица в которой мы отображаем резултаты заездов и лошадей побелителей:
//     <table class="js-results-table">
//       <thead>
//         <tr>
//           <th>Заезд</th> // номер заезда
//           <th>Победитель</th> // победител
//           <th>Время</th> // время
//         </tr>
//       </thead>
//       <tbody></tbody>
//     </table>


// let raceCounter = 0; // создадим переменную в которую будем записывать кол-во наших заездов, счетчик заездов по дефолту = 0

// 1. Cоздаем рефы с нашей разметкой:
const refs = {
  startBtn: document.querySelector('.js-start-race'), // ссылка на кнопку запуск заезда
  winnerField: document.querySelector('.js-winner'), // ссылка на победителя
  progressField: document.querySelector('.js-progress'), // ссылка на статус заезда
  tableBody: document.querySelector('.js-results-table > tbody'), // ссылка на тело таблицы
};

// 2. Далее по нажатию на кнопку, мы запускаем забег лошадей, соответственно вешаем слушатель событий и функцию обработчик:
// refs.startBtn.addEventListener('click', () => {
//   const promises = horses.map(run); // после запуска кнопки, наш массив промисов сформировался, далее можем обработать
//   // результат используя метод Promise.race()

//    refs.winnerField.textContent = ''; // перед запуском каждого заезда очищаем поле с нашим победителем
//   // при запуске заезда запишем сообщение в поле progressField:
//   refs.progressField.textContent = 'Заезд начался, ставки не принимаются';

// // 3. Запускаем Promise.race и получаем результат самой быстрой лошади, только вместо того чтобы выводить в консоль, выведем
// // в поле winnerField:
//   Promise.race(promises).then(({ horse, time }) => {
// // выведем в разметку в поле winnerField нашего победителя:
//   refs.winnerField.textContent = `Победил ${horse}, финишировав за ${time} времени`;

// //  вместо консоли:  
// // console.log(
//   //   `%c Победил ${horse}, финишировав за ${time} времени`,
//   //   'color: green; font-size: 14px;',
//   // );
//   });
  
// // 4. Теперь ждем когда доедут остальные и с помощью метода Promise.all получим результаты всех наших промисов и ещё
// // запишем сообщение об окончании заезда в наше поле прогресс заезда winnerField а не в консоль:

//   Promise.all(promises).then(() => {
//     refs.progressField.textContent = `Заезд окончен, принимаются ставки`;
    
//     // console.log(
//     // `%c Заезд окончен, принимаются ставки`,
//     // 'color: blue; font-size: 14px;',
// });
// });

// в нашей функции много дублирования, поэтому запишем дополнительные функии:

// функция которая будет выводить инфо о победителе:
function updateWinnerField(message) {
  refs.winnerField.textContent = message;
}

// функция которая будет выводить инфо о статусе заезда:
function updateProgressField(message) {
  refs.progressField.textContent = message;
}

// и перепишем нашу функцию заменив дублирующую запись refs.winnerField.textContent функцией updateWinnerField в которую
// мы вынесли эту запись и функцией updateProgressField в которую мы вынесли запись refs.progressField.textContent.
// кроме того добавили новую функцию в котрой будем обновлять нашу таблицу победителей 
// Благодаря тому что м вынесли наши записи в отдельные функции код нашей функции стал значительно чище:
// refs.startBtn.addEventListener('click', () => {
//   const promises = horses.map(run); 

//   updateWinnerField(''); 
//   updateProgressField('Заезд начался, ставки не принимаются');

//   Promise.race(promises).then(({ horse, time }) => {
//   updateWinnerField(`Победил ${horse}, финишировав за ${time} времени`);
  
//     updateResultsTable({horse, time});
  
//   });
  
//   Promise.all(promises).then(() => {
//     updateProgressField('Заезд окончен, принимаются ставки');
//   });
// });

// Осталось в нашу таблицу после каждого заезда добавить своего победителя:
// Пишем дополнительную функцию, которая будет обновлять таблицу:
// В нашу функцию function updateResultsTable() в () будет приходить победитель winner, который будет состоять из
// имени и времени забега { horse, time}

// function updateResultsTable({ horse, time }) {
//   // создадим шаблонную строку в которую будем записывать наших победитлей:
//   const tr = `<tr><td>0</td><td>${horse}</td><td>${time}</td></tr>`;
//   // добавим нашу запись в таблицу:
//   refs.tableBody.insertAdjacentHTML('beforeend', tr);
// }

// Наша функция все ещё нагромождена большим количеством кода, вынесем ещё часть кода во внешние функции:
function determineWinner(horsesP) {
  Promise.race(horsesP).then(({ horse, time }) => {
    updateWinnerField(`🎉 Победил ${horse}, финишировав за ${time}
    времени`);
    updateResultsTable({ horse, time, raceCounter });
  });
}

// Ничего не поменялось, просто вынесли определение нашего победителя в отдельную функцию и в нашей основной функции
// просто на неё ссылаемся:
// refs.startBtn.addEventListener('click', () => {
//   const promises = horses.map(run); 

//   updateWinnerField(''); 
//   updateProgressField('Заезд начался, ставки не принимаются');

//   determineWinner(promises);
  
//   Promise.all(promises).then(() => {
//     updateProgressField('Заезд окончен, принимаются ставки');
//   });
// });

// ну и оставшийся код тоже вынесем в отдельную функцию:
function waitForAll(horsesP) {
  Promise.all(horsesP).then(() => {
    updateProgressField('📝 Заезд окончен, принимаются ставки.');
  });
}

// В итоге наша функция с минимальным кол-вом кода:
// refs.startBtn.addEventListener('click', () => {
//   const promises = horses.map(run); 

//   updateWinnerField(''); 
//   updateProgressField('Заезд начался, ставки не принимаются');
//   determineWinner(promises);
//   waitForAll(promises);
// });

// Остается только добавить переменную для подсчета заездов:

let raceCounter = 0; // создадим переменную в которую будем записывать кол-во наших заездов, счетчик заездов по дефолту = 0

// добавить в нашу функцию обновления таблицы доп поле raceCounter

function updateResultsTable({ horse, time, raceCounter }) {
  const tr = `<tr><td>${raceCounter}</td><td>${horse}</td><td>${time}</td></tr>`;
  refs.tableBody.insertAdjacentHTML('beforeend', tr);
}

// и поместить переменную raceCounter в нашу основную функцию, чтобы при каждом клике(запуске заезда), наше кол - во
// заездов увеличивалось на +1:

// В итоге наша функция преобретает финальный вид, которую мы используем как обработчик при слушателе событий:
refs.startBtn.addEventListener('click', onStart);
  
function onStart() {
  raceCounter += 1; // по сути это кол-во кликов на кнопку
  const promises = horses.map(run);

  updateWinnerField('');
  updateProgressField('Заезд начался, ставки не принимаются');
  determineWinner(promises);
  waitForAll(promises);
};



// Оригинал кода:

// import '../css/common.css';

// const horses = [
//   'Secretariat',
//   'Eclipse',
//   'West Australian',
//   'Flying Fox',
//   'Seabiscuit',
// ];

// let raceCounter = 0;
// const refs = {
//   startBtn: document.querySelector('.js-start-race'),
//   winnerField: document.querySelector('.js-winner'),
//   progressField: document.querySelector('.js-progress'),
//   tableBody: document.querySelector('.js-results-table > tbody'),
// };

// refs.startBtn.addEventListener('click', onStart);

// function onStart() {
//   raceCounter += 1;
//   const promises = horses.map(run);

//   updateWinnerField('');
//   updateProgressField('🤖 Заезд начался, ставки не принимаются!');
//   determineWinner(promises);
//   waitForAll(promises);
// }

// function determineWinner(horsesP) {
//   Promise.race(horsesP).then(({ horse, time }) => {
//     updateWinnerField(`🎉 Победил ${horse}, финишировав за ${time}
//     времени`);
//     updateResultsTable({ horse, time, raceCounter });
//   });
// }

// function waitForAll(horsesP) {
//   Promise.all(horsesP).then(() => {
//     updateProgressField('📝 Заезд окончен, принимаются ставки.');
//   });
// }

// function updateWinnerField(message) {
//   refs.winnerField.textContent = message;
// }

// function updateProgressField(message) {
//   refs.progressField.textContent = message;
// }

// function updateResultsTable({ horse, time, raceCounter }) {
//   const tr = `<tr><td>${raceCounter}</td><td>${horse}</td><td>${time}</td></tr>`;
//   refs.tableBody.insertAdjacentHTML('beforeend', tr);
// }

// /*
//  * Promise.race([]) для ожидания первого выполнившегося промиса
//  */

// /*
//  * Promise.all([]) для ожидания всех промисов
//  */

// function run(horse) {
//   return new Promise(resolve => {
//     const time = getRandomTime(2000, 3500);

//     setTimeout(() => {
//       resolve({ horse, time });
//     }, time);
//   });
// }

// function getRandomTime(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }