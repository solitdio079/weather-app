import "./style.css"
import { format } from "date-fns"
// weather API key  CXD4X7736VGC44UCU5HR5T2LB
const searchForm = document.querySelector("header form")
const locationInput = document.querySelector("#location")
const contentdiv = document.querySelector(".content")
const dayTemp = document.querySelector(".day-temp")

const celciusTemp = document.querySelector("#temp-celcius")
const farhenheitTemp = document.querySelector("#temp-farhenheit")

const loading = document.querySelector(".loading")

let degreeCelcius = true

async function getLocationWeather(location) {
    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=CXD4X7736VGC44UCU5HR5T2LB`
        )
        if (!response.ok) {
            throw new Error(response.status)
        }
        return await response.json()
    } catch (error) {
        console.log(error.message)
    }
}

function processWeatherNowData(data) {
    const { datetime, temp, conditions, feelslike, icon } =
        data.currentConditions
    let iconSrc
    import(`./weatherIcons/${icon}.svg`).then((src) => {
        console.log(src)
        iconSrc = src.default
        console.log(iconSrc)
    })
    //

    return {
        datetime,
        temp,
        conditions,
        feelslike,
        icon,
    }
}

function displayNowWeatherCelcius(nowWeather) {
    contentdiv.innerHTML = ``
    const weatherDiv = document.createElement("div")
    weatherDiv.classList.add("weather-card")
    // card header
    const cardHeader = document.createElement("div")
    cardHeader.classList.add("card-header")
    const headerH5 = document.createElement("h5")
    headerH5.textContent = `Current Weather in ${locationInput.value}`
    const headerSmall = document.createElement("small")
    headerSmall.textContent = format(new Date(), "p")

    cardHeader.appendChild(headerH5)
    cardHeader.appendChild(headerSmall)

    // card body
    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body")
    const cardMain = document.createElement("div")
    cardMain.classList.add("main")

    const mainTemp = document.createElement("div")
    mainTemp.classList.add("main-temp")

    const tempSpan = document.createElement("span")
    tempSpan.classList.add("temp")
    const tempH1 = document.createElement("h1")
    tempH1.textContent = degreeCelcius
        ? `${Math.floor((nowWeather.temp - 32) * (5 / 9))}°C`
        : `${Math.floor(nowWeather.temp)}°F`

    const tempIcon = document.createElement("img")
    tempIcon.style.width = "100px"
    tempIcon.style.height = "100px"
    import(`./weatherIcons/${nowWeather.icon}.svg`).then((src) => {
        //console.log(src)
        tempIcon.src = src.default
    })

    const tempDescription = document.createElement("div")
    tempDescription.classList.add("description")
    tempDescription.textContent = nowWeather.conditions

    tempSpan.appendChild(tempIcon)
    tempSpan.appendChild(tempH1)
    mainTemp.appendChild(tempSpan)
    mainTemp.appendChild(tempDescription)

    const mainFeels = document.createElement("div")
    mainFeels.classList.add("main-feels")
    const mainFeelsParagraph = document.createElement("p")
    mainFeelsParagraph.textContent = degreeCelcius
        ? `Real Feels" ${Math.floor((nowWeather.feelslike - 32) * (5 / 9))}°C`
        : `Real Feels" ${Math.floor(nowWeather.feelslike)}°F`

    mainFeels.appendChild(mainFeelsParagraph)

    cardMain.appendChild(mainTemp)
    cardMain.appendChild(mainFeels)

    cardBody.appendChild(cardMain)
    weatherDiv.appendChild(cardHeader)
    weatherDiv.appendChild(cardBody)

    contentdiv.appendChild(weatherDiv)
}

function displayDayWeather(dayWeather) {
    const dayUl = document.createElement("ul")
    for (const key in dayWeather) {
        const liEl = document.createElement("li")
        const listItem = document.createElement("div")
        listItem.classList.add("list-item")
        const h5 = document.createElement("h5")
        h5.textContent = key
        const paragrapth = document.createElement("p")

        const dateValue =
            typeof dayWeather[key] === "string"
                ? dayWeather[key].includes("-")
                : null
        //console.log(dateValue)
        if (dateValue && !isNaN(+dayWeather[key].split("-")[0])) {
            dayWeather[key] = format(new Date(dayWeather[key]), "PP")
        }

        let tempString

        if (typeof dayWeather[key] === "number") {
            tempString = degreeCelcius
                ? `${Math.floor((dayWeather[key] - 32) * (5 / 9))}°C`
                : `${Math.floor(dayWeather[key])}°F`
        }

        paragrapth.textContent = tempString || dayWeather[key]

        listItem.appendChild(h5)
        listItem.appendChild(paragrapth)

        liEl.appendChild(listItem)
        dayUl.appendChild(liEl)
    }
    dayTemp.appendChild(dayUl)
}

function processWeatherDayData(data, dayIndex) {
    const {
        datetime,
        temp,
        tempmin,
        tempmax,
        feelslike,
        feelslikemin,
        feelslikemax,
        description,
        conditions,
        icon,
    } = data.days[dayIndex]

    return {
        datetime,
        temp,
        tempmin,
        tempmax,
        feelslike,
        feelslikemin,
        feelslikemax,
        description,
        conditions,
        icon: icon,
    }
}

async function displayWeather(){
    const location = locationInput.value
    if (locationInput.value === "") return
    loading.classList.toggle("hidden")
    const myLocationWeather = await getLocationWeather(location)
    loading.classList.toggle("hidden")
    if(myLocationWeather) {
        displayNowWeatherCelcius(processWeatherNowData(myLocationWeather))
        displayDayWeather(processWeatherDayData(myLocationWeather, 0))
        displayDayWeather(processWeatherDayData(myLocationWeather, 1))
    }else{
        alert("Invalid location")
    }
   
   
}

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    await displayWeather()
})
celciusTemp.addEventListener("click", async () => {
    celciusTemp.classList.toggle("btn-hovered")
    farhenheitTemp.classList.toggle("btn-hovered")
    degreeCelcius = true

    contentdiv.innerHTML = ``
    dayTemp.innerHTML = ``

    await displayWeather()
})
farhenheitTemp.addEventListener("click", async () => {
    farhenheitTemp.classList.toggle("btn-hovered")
    celciusTemp.classList.toggle("btn-hovered")

    degreeCelcius = false
    contentdiv.innerHTML = ``
    dayTemp.innerHTML = ``
    await displayWeather()
})
//console.log(myLocationWeather)
