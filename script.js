// перменные
// для взятия данных с сервера
const server = true;
const server1 = true;

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September','October','November', 'December'];
const monthRu = ['Январь', 'Февраль', 'Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь', 'Декабрь'];
const monthRuDeclen = ['Января', 'Февраля', 'Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября', 'Декабря'];

const API_KEY = 'd4a30300-492f-4d57-b38e-195b3ffe0e04';
let currentYear; //= new Date().getFullYear();
let currentMonth; //= new Date().getMonth();
let currentMonthText;// = month[currentMonth].toUpperCase();
let currentMonthRu;// = monthRu[currentMonth];
const countFilmsOnPage = 20;
let currentPage = 1;



// переменные для элементов страницы
const appListEl = document.querySelector('.app__list');
const yearEl = document.querySelector('.year');
const monthEl = document.querySelector('.month');
const paginationsEl = document.querySelectorAll('.app__pagination');
const modalEl = document.querySelector('.modal')
const modalButtonEl = document.querySelector('.modal__button');
const inputEl = document.getElementById('input');

// устанавалием текущий месяц и год
// yearEl.textContent = currentYear;
// monthEl.textContent = currentMonthRu;


//------функции
//склонение числительных
const declOfNum = (number,titles) => {
    let cases = [2,0,1,1,1,2];
    return titles[(number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ]
}

function getNumberWithSpaces(num) {
    return num.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


async function showFilmPage(listOfFilms){
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
    paginationsEl.forEach(pag => pag.innerHTML = '')
    for(let i = 0; i < pages; i++) {
        
        paginationsEl.forEach(el => {
            el.innerHTML += `<li class="app__pagination-item">
                    <a href="#" class="app__pagination-link" data-id="${i+1}">${i+1}</a>
                </li>`;
                
                if(i === pages-1) {
                    
                    el.querySelector(`[data-id="${currentPage}"]`).classList.add('app__pagination-link--current');
                    
                }
        })
        
        
    }
}

async function showResults(pages, listOfFilms){
    //рисуем пагинацию
    // paginationsEl
    paginationsEl.innerHTML = '';
    showPagination(pages);

    //рисуем фильмы
    appListEl.innerHTML = '';
    await showFilmPage(listOfFilms);
}

// загружаем данные
const initApp = async (page = 1) => {
    let data;
    if(server) {
        console.log('server')
        console.log(currentYear, currentMonthText)
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
    
    console.log(data)
    return data;

}

async function getDescriptionFilm(listOfFilms, currentFilmId) {

    currentKinopoiskFilmId = listOfFilms[currentFilmId].kinopoiskId;        
    let dataOfFilm;
    if(server1) {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${currentKinopoiskFilmId}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'd4a30300-492f-4d57-b38e-195b3ffe0e04',
                'Content-Type': 'application/json',
            }
        })        
        dataOfFilm = await response.json();
        // console.log( dataOfFilm.description, dataOfFilm.ratingKinopoisk)
    }
    else {
        const response = await fetch('./dateOfMonth/response_inter_film.json')
        dataOfFilm = await response.json()
    }
        return {
            'description': dataOfFilm.description,
            'ratingKinopoisk': dataOfFilm.ratingKinopoisk
        }
}

async function getBudgetFilm(listOfFilms, currentFilmId) {
    currentKinopoiskFilmId = listOfFilms[currentFilmId].kinopoiskId; 
    let dataOfFilm;  
    if(server1){
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${currentKinopoiskFilmId}/box_office`, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'd4a30300-492f-4d57-b38e-195b3ffe0e04',
                'Content-Type': 'application/json',
            }
        })        
         dataOfFilm = await response.json();
    } else {
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

async function showFilms() {
    // let yourNumber = "125478521478";
    
    // console.log(getNumberWithSpaces(yourNumber))


    // получаем данные 
    const data = await initApp();
    const listOfFilms = data.items;
    const countOfFilms = data.total;
    const pages = Math.ceil(countOfFilms / countFilmsOnPage);

    // рисуем пагинацию и постеры фильмов по 20 штук на странице, передаем кол-во страниц и массив фильмов
    showResults(pages, listOfFilms);

    // при клике на пагинации меняем текущую страницу и выводим заново 
    paginationsEl.forEach(pag => {
        pag.addEventListener('click', event => {            
            currentPage = event.target.dataset.id;
            showResults(pages, listOfFilms);
        })
    }) 

    // клик по карточке фильма, открываем модальное окно
    appListEl.addEventListener('click', async (event) => {
        modalEl.innerHTML = 'Загрузка...'
        const currentFilmId = event.target.closest('[data-id]').dataset.id;
        const currentFilm = data.items[currentFilmId]; 
        modalEl.classList.remove('hidden');
        
        // const dataOfFilm = await getDescriptionFilm(listOfFilms, currentFilmId);

        // const budgetString = await getBudgetFilm(listOfFilms, currentFilmId);

        const results = await Promise.allSettled([
            getDescriptionFilm(listOfFilms, currentFilmId),
            getBudgetFilm(listOfFilms, currentFilmId)
        ]);
          
        const dataOfFilm = results[0].status === 'fulfilled' ? results[0].value : null;
        const budgetString = results[1].status === 'fulfilled' ? results[1].value : '';
        
        // let video;
        // if(server){
        //     currentKinopoiskFilmId = listOfFilms[currentFilmId].kinopoiskId; 
        //     const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${currentKinopoiskFilmId}/videos`, {
        //         method: 'GET',
        //         headers: {
        //             'X-API-KEY': 'd4a30300-492f-4d57-b38e-195b3ffe0e04',
        //             'Content-Type': 'application/json',
        //         }
        //     })        
        //     video = await response.json();
        // } else {
        //     const response = await fetch('./dateOfMonth/response_inter_video.json')
        //     video = await response.json()
        // }
        // console.log(video.items[0].url)
          

        modalEl.innerHTML = `<button class="modal__button" data-close="true">x</button>
                <p class="modal__name">Подробнее про фильм "${currentFilm.nameRu}"</p>
                <div class="modal__header">
                    <img class="modal__picture" src=${currentFilm.posterUrlPreview} alt="">
                    <div class="modal__desc-wrapper">                    
                        <p class="modal__rating-kinopoisk">Рейтинг: ${!dataOfFilm.ratingKinopoisk ? 'нет рейтинга': dataOfFilm.ratingKinopoisk}</p>
                        <p class="modal__genres">Жанры: ${currentFilm.genres.map(item =>item.genre).join(', ')}</p>
                        <p class="modal__film-length">Продолжительность: ${currentFilm.duration} ${declOfNum(currentFilm.duration, ['минута', 'минуты', 'минут'])}</p>
                        <p class="modal__description">Описание: ${dataOfFilm.description}</p>
                        <p class="modal__budget">${budgetString}</p>                                                
                        <a target="_blank" href="https://www.kinopoisk.ru/film/${currentFilm.kinopoiskId}" class="modal__button-kino">Подробнее на кинопоиске</a>
                    </div>
                </div>`

        console.log(data)
        
        
        

    });

    // клик по крестику на модальном окне , закрываем его
    modalEl.addEventListener('click', (event) => {
        // console.log(event.target.dataset.close)
        if(event.target.dataset.close) modalEl.classList.add('hidden');

    })


    

    

}

//------точка входа

inputEl.addEventListener('change', async (event) => {
        // console.log(event.target.value.slice(0,4))

        // console.log(event.target.value.slice(5,7))
        currentPage = 1;
        yearEl.textContent = event.target.value.slice(0,4);
        monthEl.textContent = monthRu[event.target.value.slice(5,7)-1];

        currentMonth = event.target.value.slice(5,7)-1;
        console.log(currentMonth, month[currentMonth])

        currentYear = event.target.value.slice(0,4);
        currentMonthText = month[event.target.value.slice(5,7)-1].toUpperCase();
        console.log(currentYear, currentMonthText)

        // currentMonthText = month[currentMonth].toUpperCase();
        currentMonthRu = monthRu[currentMonth];

        await showFilms();
    })




