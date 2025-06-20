import "./style.css"
// weather API key  CXD4X7736VGC44UCU5HR5T2LB
const searchForm = document.querySelector("header form")
const locationInput = document.querySelector("#location")
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
    const { datetime, temp, conditions, feelslike, icon } = data.currentConditions
    let iconSrc
    import(`./weatherIcons/${icon}.svg`).then(src => {
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
        icon
    }
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
        icon:  icon,
    }
}

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const location = locationInput.value
    const myLocationWeather = await getLocationWeather(location)
    console.log(processWeatherNowData(myLocationWeather))
    console.log(processWeatherDayData(myLocationWeather, 0))
    console.log(processWeatherDayData(myLocationWeather, 1))
})

//console.log(myLocationWeather)
