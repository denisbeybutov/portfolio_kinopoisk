// перменные
// для взятия данных с сервера
const server = false;

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September','October','November', 'December'];
const monthRu = ['Январь', 'Февраль', 'Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь', 'Декабрь'];
const monthRuDeclen = ['Января', 'Февраля', 'Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября', 'Декабря'];

const API_KEY = 'd4a30300-492f-4d57-b38e-195b3ffe0e04';
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentMonthText = month[currentMonth].toUpperCase();
const currentMonthRu = monthRu[currentMonth];
const countFilmsOnPage = 20;
let currentPage = 1;

// console.log(currentYear, currentMonthText, currentMonthRu)

// переменные для элементов страницы
const appListEl = document.querySelector('.app__list');
const yearEl = document.querySelector('.year');
const monthEl = document.querySelector('.month');
const paginationsEl = document.querySelectorAll('.app__pagination');
const modalEl = document.querySelector('.modal')
const modalButtonEl = document.querySelector('.modal__button');

// устанавалием текущий месяц и год
yearEl.textContent = currentYear;
monthEl.textContent = currentMonthRu;


//------функции
//склонение числительных
const declOfNum = (number,titles) => {
    let cases = [2,0,1,1,1,2];
    return titles[(number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ]
}



async function showFilmPage(listOfFilms){
    const start = (currentPage-1)*countFilmsOnPage;
    const end = currentPage*countFilmsOnPage;
    for(let i = start; i < end; i++){
        if(!listOfFilms[i]) return;
        const film = listOfFilms[i];
        // console.log(i)
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
        // console.log(i+1)
        paginationsEl.forEach(el => {
            el.innerHTML += `<li class="app__pagination-item">
                    <a href="#" class="app__pagination-link" data-id="${i+1}">${i+1}</a>
                </li>`;
                
                if(i === pages-1) {
                    // console.log(el.querySelector(`[data-id="${currentPage}"]`));
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
        const response = await fetch('responseFilms.json');
         data = await response.json()
    }
    
    return data;

}

async function showFilms() {
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
        console.log(event.target.closest('[data-id]').dataset.id)
        const currentFilmId = event.target.closest('[data-id]').dataset.id;
        modalEl.classList.remove('hidden');
        // console.log(listOfFilms[currentFilmId].kinopoiskId);
        console.log(data)
        // currentKinopoiskFilmId = listOfFilms[currentFilmId].kinopoiskId;        
        // const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${currentKinopoiskFilmId}`, {
        //     method: 'GET',
        //     headers: {
        //         'X-API-KEY': 'd4a30300-492f-4d57-b38e-195b3ffe0e04',
        //         'Content-Type': 'application/json',
        //     }
        // })        
        // const dataOfFilm = await response.json();
        // console.log(data.nameRu, data.posterUrlPreview, data.description, data.ratingKinopoisk, data.filmLength, data.genres.map(g => g.genre).join(', '))
        
        

    });

    // клик по крестику на модальном окне , закрываем его
    modalButtonEl.addEventListener('click', () => {
        modalEl.classList.add('hidden');
    })


    

}

//------точка входа
showFilms();



