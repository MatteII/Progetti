import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

// ====================[ GET LOCATION, WEATHER ]======================= //

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({ coords }) {
        getWeather(
                coords.latitude,
                coords.longitude,
                Intl.DateTimeFormat().resolvedOptions().timeZone
        )
        .then(renderWeather)
        .catch(e => {
                console.error(e)
                alert('Errore nel caricamento dati!')
        })
}

function positionError() {
        alert("Errore nel trovare la posizione. Per favore, attivare l'accesso alla posizione.")
}

// ====================[ RENDER WEATHER ]======================= //

function renderWeather({ current, daily, hourly }) {
        renderCurrentWeather(current)
        renderDailyWeather(daily)
        renderHourlyWeather(hourly)
        document.getElementById("body").classList.remove("blurred")
        document.getElementById("loader").classList.remove("blurred")
}

// ====================[ HELPER FUNCTIONS ]======================= //

function setValue(selector, value, { parent = document } = {}) {
        parent.querySelector(`[data-${selector}]`).textContent = value
}
function setValueHour(selector, value, { parent = document } = {}) {
        parent.querySelector(`[data-${selector}]`).textContent = value+':00'
}

function getIconUrl(iconCode) {
        return `icons/${ICON_MAP.get(iconCode)}.svg`
}

// ====================[ CURRENT WEATHER ]======================= //

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
        currentIcon.src = getIconUrl(current.iconCode)
        setValue("current-temp", current.currentTemp)
        setValue("current-high", current.highTemp)
        setValue("current-low", current.lowTemp)
        setValue("current-fl-high", current.highFeelsLike)
        setValue("current-fl-low", current.lowFeelsLike)
        setValue("current-wind", current.windSpeed)
        setValue("current-precip", current.precip)
}

// ====================[ DAILY WEATHER ]======================= //

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday : "long" })
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
        dailySection.innerHTML = ''
        daily.forEach(day => {
                const element = dayCardTemplate.content.cloneNode(true)
                setValue("temp", day.maxTemp, { parent: element })
                setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
                element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
                dailySection.append(element)
        });
}

// ====================[ HOURLY WEATHER ]======================= //

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour : "numeric" })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
        hourlySection.innerHTML = ''
        hourly.forEach(hour => {
                const element = hourRowTemplate.content.cloneNode(true)
                setValue("temp", hour.temp, { parent: element })
                setValue("fl-temp", hour.feelsLike, { parent: element })
                setValue("wind", hour.windSpeed, { parent: element })
                setValue("precip", hour.precip, { parent: element })
                setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
                setValueHour("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })
                element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
                hourlySection.append(element)
        });
}