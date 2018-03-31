import '../assets/sass/master.scss';

const aerisApi = 'https://api.aerisapi.com/';
const accessId = 'client_id=YsjKOEJGkXYxkt6igH2Cs&';
const secretKey = 'client_secret=srfJyu0NWh1lB4fLRn91xk28MrpTMgYUxHPzIfyr';

function getCurrentWeather(location) {
  const query = `observations/${location}?`;

  fetch(aerisApi + query + accessId + secretKey, { mode: 'cors' })
    .then(function onResolve(response) {
      return response.json();
    })
    .then(function onResolve(response) {
      const observations = getObervations(response.response);
      updateCurrentWeather(observations);
    })
    .catch(function onError(error) {
      console.error(`Could not connect to aeris api: ${error}`);
    });
}

function getObervations(response) {
  return {
    icon: `../assets/images/AerisIcons/${response.ob.icon}`,
    weather: response.ob.weather,
    tempC: response.ob.tempC,
    tempF: response.ob.tempF
  };
}

function updateCurrentWeather(observations) {
  let currentWeatherContainer = document.getElementById('current-weather');
  emptyContainer(currentWeatherContainer);

  addIcon(currentWeatherContainer, observations.icon);
  addTemp(currentWeatherContainer, observations.tempC);
  addUnitToggle(currentWeatherContainer);
  addWeather(currentWeatherContainer, observations.weather);
}

function addIcon(currentWeatherContainer, icon) {
  const iconElement = document.createElement('img');
  iconElement.classList.add('icon');
  iconElement.src = icon;
  iconElement.alt = 'weather icon';
  currentWeatherContainer.append(iconElement);
}

function addTemp(currentWeatherContainer, temp) {
  const tempElement = document.createElement('div');
  tempElement.classList.add('tempC');
  tempElement.classList.add('temp');
  tempElement.textContent = temp;
  currentWeatherContainer.append(tempElement);
}

function addUnitToggle(currentWeatherContainer) {
  const units = document.createElement('button');
  units.classList.add('units');
  units.textContent = '°C';
  units.addEventListener('click', toggleUnits);
  currentWeatherContainer.append(units);
}


function toggleUnits() {
  let temp = document.querySelector('.temp');
  if (this.textContent === '°C') {
    this.textContent = '°F';
    temp.textContent = Math.round((Number.parseFloat(temp.textContent)*(9/5)) + 32);
  }
  else {
    this.textContent = '°C';
    temp.textContent = Math.round((Number.parseFloat(temp.textContent) -32)*(5/9));
  }
}

function addWeather(currentWeatherContainer, weather) {
  const weatherElement = document.createElement('div');
  weatherElement.classList.add('weather');
  weatherElement.textContent = weather;
  currentWeatherContainer.append(weatherElement);
}

function emptyContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('submit-current-weather');
  btn.addEventListener('click', () =>
    getCurrentWeather(document.getElementById('location').value)
  );

  getCurrentWeather('kitchener,on');
});
