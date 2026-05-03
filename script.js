// перменные
// для взятия данных с сервера
const server = true;
const server1 = true;
const server2 = true;
const server3 = true;

 
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September','October','November', 'December'];
const monthRu = ['Январь', 'Февраль', 'Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь', 'Декабрь'];
const monthRuDeclen = ['Января', 'Февраля', 'Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября', 'Декабря'];

const API_KEY = 'd4a30300-492f-4d57-b38e-195b3ffe0e04';
let currentYear; //= new Date().getFullYear();
let currentMonth; //= new Date().getMonth();
let currentMonthText;// = month[currentMonth].toUpperCase();
let currentMonthRu;// = monthRu[currentMonth];
const countFilmsOnPage = 10;
let currentPage = 1;
let currentItemPopularShows = 0;
let currentPagePopularShows = 1;

// переменные для элементов страницы
const appListEl = document.querySelector('.app__list');
const yearEl = document.querySelector('.year');
const monthEl = document.querySelector('.month');
const paginationEl = document.querySelector('.app__pagination');
// const paginationsEl = document.querySelectorAll('.app__pagination');
const modalEl = document.querySelector('.modal')
const modalButtonEl = document.querySelector('.modal__button');
const inputEl = document.getElementById('input');
const topShowsEl = document.querySelector('.top-shows__list');
const topShowsMoreEL = document.querySelector('.top-shows__more');
const topShowsListEl = document.querySelector('.top-shows__list');

let currentPaginationHandler = null;
let currentModalHandler = null;

//-------------------функции------------------

//склонение числительных
const declOfNum = (number,titles) => {
    let cases = [2,0,1,1,1,2];
    return titles[(number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ]
}
// отображение бюджетов чисел через пробел после 3 симовлов
function getNumberWithSpaces(num) {
    return num.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// рисуем фильмы на странице
 function showFilmPage(listOfFilms){
    const start = (currentPage-1)*countFilmsOnPage;
    const end = currentPage*countFilmsOnPage;
    for(let i = start; i < end; i++){
        if(!listOfFilms[i]) return;
        const film = listOfFilms[i];
        
        const dateString = film.premiereRu;
        const dateRow = new Date(dateString);
        const date = `${dateRow.getDate()} ${monthRuDeclen[dateRow.getMonth()]}`
        const duration = `${film.duration} ${declOfNum(film.duration, ['минута', 'минуты', 'минут'])}`;
        
        appListEl.innerHTML += `<li class="app__list-item" data-id='${i}'>
                    <article class="app__card movie-card">
                        <button class="movie-card__link">
                            <div class="movie-card__image-wrapper">
                                <img src=${film.posterUrlPreview} alt="#" loading="lazy" class="movie-card__image">
                                <div class="movie-card__hover">
                                    <div class="movie-card__rating">${film.countries.map(item=>item.country).join(', ')}</div>
                                    <div class="movie-card__genres">${film.genres.map(item =>item.genre).join(', ')}</div>
                                    <div class="movie-card__duration ${!film.duration ? 'movie-card__duration--hidden' : ''}">${duration} </div>
                                </div>
                            </div>
                            <h2 class="movie-card__title">${film.nameRu}</h2>
                            <div class="movie-card__date">${date}</div>
                        </button>
                    </article>
                </li>`
    }
}

 function showPagination(pages){
    
    paginationEl.innerHTML = ''
    for(let i = 0; i < pages; i++) {
        
        paginationEl.innerHTML += `<li class="app__pagination-item">
                    <a href="#" class="app__pagination-link" data-id="${i+1}">${i+1}</a>
                </li>`;
                
                if(i === pages-1) {
                    
                    paginationEl.querySelector(`[data-id="${currentPage}"]`).classList.add('app__pagination-link--current');
                    
                }
        
        
        
    }
    // console.log(currentPage)
    // paginationsEl.forEach(el => {
    //     el.querySelector(`[data-id="${currentPage}"]`).classList.add('app__pagination-link--current');
    // })
}

 function showResults(pages, listOfFilms){
    //рисуем пагинацию
    // paginationsEl
    paginationEl.innerHTML = '';
    // console.log('in show result',pages)
     showPagination(pages);

    //рисуем фильмы
    appListEl.innerHTML = '';
     showFilmPage(listOfFilms);
}

// загружаем данные - список фильмов по месяцу и году
const initApp = async (page = 1) => {
    let data;
    if(server) {
        console.log('server')
        // console.log(currentYear, currentMonthText)
        const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=${currentYear}&month=${currentMonthText}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'd4a30300-492f-4d57-b38e-195b3ffe0e04',
                'Content-Type': 'application/json',
            }
        });
         data = await response.json();
    } else {
        console.log('local file')
        const response = await fetch('./dateOfMonth/response_november14.json');
         data = await response.json()
    }
    
    // console.log(data)
    return data;

}

// загружаем данные - описание фильма
async function getDescriptionFilm(listOfFilms, currentFilmId) {

    currentKinopoiskFilmId = listOfFilms[currentFilmId].kinopoiskId;        
    let dataOfFilm;
    if(server1) {
        console.log('server')
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${currentKinopoiskFilmId}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'd4a30300-492f-4d57-b38e-195b3ffe0e04',
                'Content-Type': 'application/json',
            }
        })        
        dataOfFilm = await response.json();
        
    }
    else {
        console.log('local file')
        const response = await fetch('./dateOfMonth/response_inter_film.json')
        dataOfFilm = await response.json()
    }
        return {
            'description': dataOfFilm.description,
            'ratingKinopoisk': dataOfFilm.ratingKinopoisk
        }
}

// загруажем данные - бюджет фильма
async function getBudgetFilm(listOfFilms, currentFilmId) {
    currentKinopoiskFilmId = listOfFilms[currentFilmId].kinopoiskId; 
    let dataOfFilm;  
    if(server1){
        console.log('server')
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${currentKinopoiskFilmId}/box_office`, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'd4a30300-492f-4d57-b38e-195b3ffe0e04',
                'Content-Type': 'application/json',
            }
        })        
         dataOfFilm = await response.json();
    } else {
        console.log('local file')
        const response = await fetch('./dateOfMonth/response_inter_boxoffice.json')
        dataOfFilm = await response.json()
    }

        return dataOfFilm.items.map(item => {
            let type;

            if(item.type === "WORLD") { type = 'Сборы в мире'};
            if(item.type === "RUS") { type = 'Сборы в России'};
            if(item.type === "USA") { type = 'Сборы в Америке'};
            if(item.type === "BUDGET") { type = 'Бюджет фильма'};
            
            return `${type}: ${getNumberWithSpaces(item.amount)} ${item.symbol} (${getNumberWithSpaces(item.amount * 75)} р)<br>`;
        }).join('');

                       
}

// загруажем данные - похожие фильмы
async function getLinkedFilms(listOfFilms, currentFilmId) {
    currentKinopoiskFilmId = listOfFilms[currentFilmId].kinopoiskId; 
    let dataOfFilm;  
    if(server2){
        console.log('server')
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${currentKinopoiskFilmId}/relations`, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'd4a30300-492f-4d57-b38e-195b3ffe0e04',
                'Content-Type': 'application/json',
            }
        })        
         dataOfFilm = await response.json();
    } else {
        console.log('local file')
        const response = await fetch('./dateOfMonth/response_inter_boxoffice.json')
        dataOfFilm = await response.json()
    }

        // console.log(dataOfFilm)
        return dataOfFilm;

                       
}

// загруажем данные - топ 250 сериалов
async function getTopShows() {    

    let dataOfFilm;  
    if(server3){
        console.log('server')
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_TV_SHOWS&page=${currentPagePopularShows}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'd4a30300-492f-4d57-b38e-195b3ffe0e04',
                'Content-Type': 'application/json',
            }
        })        
         dataOfFilm = await response.json();
    } else {
        console.log('local file')
        const response = await fetch('./dateOfMonth/response_top-shows.json')
        dataOfFilm = await response.json()
    }

        console.log(dataOfFilm)
        return dataOfFilm;

                       
}

// https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_TV_SHOWS&page=1



function paintModalWindow(currentFilm, dataOfFilm, budgetString,date, linkedFilms) {
    let linkedFilmString;
    if(linkedFilms){
        linkedFilmString = linkedFilms.items.map(film => {
            if(!film.nameRu || !film.posterUrlPreview) return;
            return `<li class="modal__linked-item">
                        <img class="modal__linked-img" src=${film.posterUrlPreview}>  
                        <p>${film.nameRu}</p>
                                          
                    </li>`
        }).join('');
    }
    else {
        linkedFilmString = 'Нет данных';
    }
    
    // пишем модальное окно
    modalEl.innerHTML = `<button class="modal__button" data-close="true">x</button>
    <p class="modal__name">"${currentFilm.nameRu}"</p>
    <div class="modal__header">
        <img class="modal__picture" src=${currentFilm.posterUrlPreview} alt="">
        <div class="modal__desc-wrapper">                    
            <p class="modal__rating-kinopoisk">Рейтинг: ${!dataOfFilm.ratingKinopoisk ? 'нет рейтинга': dataOfFilm.ratingKinopoisk}</p>
            <p class="modal__date">Дата выхода: ${date}</p>
            <p class="modal__genres">Жанры: ${currentFilm.genres.map(item =>item.genre).join(', ')}</p>
            <p class="modal__country">Страны: ${currentFilm.countries.map(item=>item.country).join(', ')}</p>
            <p class="modal__film-length">Продолжительность: ${currentFilm.duration} ${declOfNum(currentFilm.duration, ['минута', 'минуты', 'минут'])}</p>
            <p class="modal__description">Описание: ${dataOfFilm.description}</p>
            <p class="modal__budget">${budgetString}</p>                                                
            <a target="_blank" href="https://www.kinopoisk.ru/film/${currentFilm.kinopoiskId}" class="modal__button-kino">Подробнее на кинопоиске</a>
            <button class="modal__linked-head">Похожие фильмы</button>
            <ul class='modal__linked-films hidden'>${linkedFilmString}</ul>
        </div>
    </div>
    `
    
}

//показываем модальное окно по клику
function showModalWindow(data,listOfFilms){
        return async (event) => {
            modalEl.innerHTML = 'Загрузка...'
            const currentFilmId = event.target.closest('[data-id]').dataset.id;
            const currentFilm = data.items[currentFilmId]; 
            modalEl.classList.remove('hidden');

            // взять данные с сервера - бюджеты и описание 
            const results = await Promise.allSettled([
                getDescriptionFilm(listOfFilms, currentFilmId),
                getBudgetFilm(listOfFilms, currentFilmId),
                getLinkedFilms(listOfFilms, currentFilmId)
            ]);          
            const dataOfFilm = results[0].status === 'fulfilled' ? results[0].value : null;
            const budgetString = results[1].status === 'fulfilled' ? results[1].value : '';
            const linkedFilms = results[2].status === 'fulfilled' ? results[2].value : '';
            
            // обработка даты выхода фильма
            const dateString = currentFilm.premiereRu;
            const dateRow = new Date(dateString);
            const date = `${dateRow.getDate()} ${monthRuDeclen[dateRow.getMonth()]} ${dateRow.getFullYear()}`

            //рисуем модальное окно по данным выше
            paintModalWindow(currentFilm, dataOfFilm, budgetString, date, linkedFilms);
            
            
            const modalLinkedHeadEl = document.querySelector('.modal__linked-head');
            modalLinkedHeadEl.addEventListener('click', () => {
                // console.log(modalLinkedHeadEl.nextElementSibling)
                modalLinkedHeadEl.nextElementSibling.classList.toggle('hidden');
            })
        }

}

function handlePaginationClick(pages,listOfFilms) {
    return (event) => {
        currentPage = event.target.dataset.id;            
        showResults(pages, listOfFilms);
    }
}

// показываем фильмы 
async function showFilms() {
    if (currentPaginationHandler) {
        paginationEl.removeEventListener('click', currentPaginationHandler);
      }
      if (currentModalHandler) {
        appListEl.removeEventListener('click', currentModalHandler);
      }

    // получаем данные по фильмам на введенный месяц и год
    let data = await initApp();
    let listOfFilms = data.items;
    let countOfFilms = data.total;
    let pages = Math.ceil(countOfFilms / countFilmsOnPage);
    // console.log('in showfilms',pages)

    // рисуем пагинацию и постеры фильмов по 20 штук на странице, передаем кол-во страниц и массив фильмов
    showResults(pages, listOfFilms);

    // при клике на пагинации меняем текущую страницу и выводим заново 
    currentPaginationHandler = handlePaginationClick(pages, listOfFilms);
    paginationEl.addEventListener('click', currentPaginationHandler)
    

    // клик по карточке фильма, открываем модальное окно
    currentModalHandler = showModalWindow(data, listOfFilms);
    appListEl.addEventListener('click', currentModalHandler);

    // клик по крестику на модальном окне , закрываем его
    modalEl.addEventListener('click', (event) => {        
        if(event.target.dataset.close) modalEl.classList.add('hidden');
    })

    
}

let topShowsArr = [];
let topShowsString = '';
let allPagesPopularShows = 1;

async function showTopShows() {
    topShowsEl.innerHTML = '';
    let start = currentItemPopularShows;
    currentPagePopularShows = (currentItemPopularShows + 10) / 10;    
    let end = currentPagePopularShows * countFilmsOnPage;
    

    console.log(currentPagePopularShows)
    if(currentPagePopularShows % 2 === 1 && currentPagePopularShows <= allPagesPopularShows){
        let topShowsArrNewData = await getTopShows();  
        allPagesPopularShows = topShowsArrNewData.totalPages;
        for(let film of topShowsArrNewData.items) {
            topShowsArr.push(film);
        }
        
    }
    
    console.log(topShowsArr);

    for(let i = start; i < end; i++) {
        let show = topShowsArr[i];
        topShowsString += `<li class="top-shows__item" data-id='${i}'>
                            <button class="top-shows__film-more">
                                <div class="top-shows__wrapper">
                                    <img class="top-shows__image" src=${show.posterUrlPreview}>
                                    <div class="top-shows__hover">
                                        <div class="top-shows__raiting">${show.ratingKinopoisk}</div>
                                        <div class="top-shows__countries">${show.countries.map(c=>c.country).join(', ')}</div>
                                        <div class="top-shows__genres">${show.genres.map(g=>g.genre).join(', ')}</div>
                                        
                                    </div>
                                    
                                </div>
                                
                                <div class="top-shows__text">${show.nameRu}</div>
                                <div class="top-shows__date">${show.year}</div>
                                
                                
                            </button>
                          </li>`;


        currentItemPopularShows++;
    }
    topShowsEl.innerHTML += topShowsString;
    
}

//------точка входа

// выводим кинопремьеры текущего месяца
currentYear= new Date().getFullYear();
currentMonth = new Date().getMonth();
currentMonthText = month[currentMonth].toUpperCase();
currentMonthRu = monthRu[currentMonth];
yearEl.textContent = new Date().getFullYear()
monthEl.textContent = monthRu[currentMonth];
showFilms();

// выводим список топ сериалов
showTopShows();

// подробнее о сериале 
topShowsListEl.addEventListener('click', (event) => {
    console.log(event.target.closest('[data-id]').dataset.id)
    const currentIdShow = event.target.closest('[data-id]').dataset.id;
    console.log(topShowsArr[currentIdShow].nameRu);
    const currentFilm = topShowsArr[currentIdShow];

    modalEl.classList.remove('hidden')
    paintModalWindow(currentFilm, currentFilm, "", currentFilm.year, undefined);
    // клик по крестику на модальном окне , закрываем его
    modalEl.addEventListener('click', (event) => {        
        if(event.target.dataset.close) modalEl.classList.add('hidden');
    })

})

topShowsMoreEL.addEventListener('click', ()=>{
    showTopShows();
})

// обрабатываем ввод месяца и года
inputEl.addEventListener('change', async (event) => {
        // назначаем переменные полученные в инпуте
        currentPage = 1;
        yearEl.textContent = event.target.value.slice(0,4);
        monthEl.textContent = monthRu[event.target.value.slice(5,7)-1];
        currentMonth = event.target.value.slice(5,7)-1;
        currentYear = event.target.value.slice(0,4);
        currentMonthText = month[event.target.value.slice(5,7)-1].toUpperCase();
        currentMonthRu = monthRu[currentMonth];

        // запускаем показ фильмов с введенными данными
        await showFilms();

        
        
    })













