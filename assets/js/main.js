// Настройки
const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'

const apiKey = 'bd0e2d71-301c-4673-9b55-e15b797aac62'

const options = {
    method: 'GET',
    headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
    },
}

// DOM элементы
const filmsWrapper = document.querySelector('.films')
const loader = document.querySelector('.loader-wrapper')
const loadMore = document.querySelector('.show-more')

let page = 1

loadMore.addEventListener('click', function (){
    fetchAndRenderFilms()
})

// Получение и вывод первых TOP 250 фильмов
async function fetchAndRenderFilms () {

    try {
        //Show preloader
        loader.classList.remove('none')

        // Fetch film data
        const data = await fetchData(url + `top?page=${page}`, options)

        // Проверка на доп. стр. и отображение кнопки
        if (data.pagesCount > 1) {
            page++
            loadMore.classList.remove('none')
        }

        //Hide preloader
        loader.classList.add('none')

        //Render films on page
        renderFilms(data.films)

        //Скрываем кнопку если больше нет фильмов
        if (page > data.pagesCount) {
            loadMore.classList.add('none')
        }

    } catch (err) {
        console.log(err)
    }
}

// Api запрос
async function fetchData(url, options) {
    const response = await fetch(url, options)
    const data = await response.json()
    return data
}

// Рендер массива фильмов в контейнере слева
function renderFilms(films) {
    for (film of films) {

        const div = document.createElement("div")
        div.classList.add('card')
        div.setAttribute('id', film.filmId)

        div.addEventListener('click', openFilmDetails)

        const card = `
                               <img class = "card__img" src=${film.posterUrlPreview} alt="film">
                               <h3 class="card-title">${film.nameRu}</h3>
                               <p class="card__year">${film.year}</p>
                               <p class="card__rate">Рейтинг: ${film.rating}</p>
                        `
        div.insertAdjacentHTML("afterbegin", card)
        filmsWrapper.insertAdjacentElement("beforeend", div)
    }
}

// Рендер и Api запрос
async function openFilmDetails(e) {

    //Получаем id фидьма
    const id = e.currentTarget.id

    // Получаем данные о фильме
    const data = await fetchData(url + id, options)

    // Отображаем детали фильма в container-right
    renderFilmData(data)

}

// Форматирование времени
function formatFilmLength(value) {

    let length = ''

    const hours = Math.floor(value / 60)
    const minutes = value % 60

    if (hours > 0) {
        length += hours + ' ч. '
    }

    if (minutes > 0) {
        length += minutes + ' мин.'
    }

    return length
}

// Форматирование страны
function formatCountry(countries) {

    let countryString = ''

    for (country of countries) {
        countryString += country.country
        if (countries.indexOf(country) +1 < countries.length) {
            countryString += ', '
        }
    }

    return countryString
}

// Рендер деталей фильма в контейнере справа
function renderFilmData(film) {

    // Проверка на новый фильм и его удаление
    if (document.querySelector('.container-right')) {
        document.querySelector('.container-right').remove()
    }

    const containerRight = document.createElement('div')
    containerRight.classList.add('container-right')
    document.body.insertAdjacentElement("beforeend", containerRight)

    const btnClose = document.createElement('button')
    btnClose.classList.add('btn-close')
    btnClose.innerHTML = '<img src="./assets/img/cross.svg" alt="close" width="24">'
    containerRight.insertAdjacentElement("afterbegin", btnClose)

    btnClose.addEventListener('click', function (){
        containerRight.remove()
    })

    const filmDetails = `
        <div class="film">
            <div class="film__title">${film.nameRu}</div>
            <div class="film__image">
                <img src=${film.posterUrl} alt=${film.nameRu}>
            </div>
            <div class="film__desc">
                <p class="film-details">Год: ${film.year}</p>
                <p class="film-details">Рейтинг: ${film.ratingKinopoisk}</p>
                <p class="film-details">Продолжительность: ${formatFilmLength(film.filmLength)}</p>
                <p class="film-details">Страна: ${formatCountry(film.countries)}</p>
                <p class="film-text">${film.description}</p>
            </div>
        </div>
    `

    containerRight.insertAdjacentHTML('beforeend', filmDetails)
}

fetchAndRenderFilms ()