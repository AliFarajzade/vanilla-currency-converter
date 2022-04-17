import countryList from './countryList.js';

// GLobal variables
const CURRENCY_API_KEY = 'b5acdc034cf7ece0bff3';
const COUNTRY_INFO_URL = 'https://restcountries.com/v3.1/alpha/';

// Selecting DOM elements
const selectBox = document.querySelectorAll('.select-box');
const toDropDown = document.getElementById('to');
const fromDropDown = document.getElementById('from');
const amountInput = document.getElementById('amount');
const btn = document.querySelector('button');
const resultElement = document.querySelector('.exchange-rate');
const swapIcon = document.querySelector('.icon');

// Generate country <select> for drop down.
const renderCountryDropDown = function () {
  for (const [currency, ISOName] of Object.entries(countryList)) {
    const markup = `
      <option value="${ISOName}">${currency}</option>
    `;
    selectBox.forEach(selectElement =>
      selectElement
        .querySelector('select')
        .insertAdjacentHTML('afterbegin', markup)
    );
  }
};

const getFlagSVG = async function (countryCode) {
  // Get flag data
  const response = await fetch(`${COUNTRY_INFO_URL}${countryCode}`);
  if (!response.ok) throw new Error('Could not the the flag from CDN.');
  const [data] = await response.json();
  return data?.flags?.svg;
};

// Get flag svg from API
const renderCountryFlag = async function (selectElement) {
  const element = selectElement.target ? selectElement.target : selectElement;
  const imageElement = element.previousElementSibling;
  const selectedOptionIndex = +element.selectedIndex;
  const countryCurreny = Array.from(element.options)[
    selectedOptionIndex
  ].value.toLowerCase();
  imageElement.src = await getFlagSVG(countryCurreny);
};

// Get convert ratio from API
const getRatio = async function (from, to) {
  const response = await fetch(
    `https://free.currconv.com/api/v7/convert?q=${from}_${to}&compact=ultra&apiKey=${CURRENCY_API_KEY}`
  );
  const data = await response.json();
  return +data[Object.keys(data)];
};

// Convert
const convertCurrency = async function () {
  const amount = +amountInput.value;
  const toValue = Array.from(toDropDown.options)[+toDropDown.selectedIndex]
    .innerText;
  const fromValue = Array.from(fromDropDown.options)[
    +fromDropDown.selectedIndex
  ].innerText;
  const ratio = await getRatio(fromValue, toValue);
  const result = `${amount} ${fromValue} = ${(amount * ratio).toFixed(
    2
  )} ${toValue}`;
  resultElement.textContent = result;
};

// Event listeners
// Apply the flag in country change
[toDropDown, fromDropDown].forEach(dropDown =>
  dropDown.addEventListener('change', renderCountryFlag)
);

// Convert the currency
btn.addEventListener('click', async function (evenrPeram) {
  evenrPeram.preventDefault();
  convertCurrency();
});

// Swap the currencies
swapIcon.addEventListener('click', function () {
  const toValue = toDropDown.selectedIndex;
  const fromValue = fromDropDown.selectedIndex;

  toDropDown.selectedIndex = fromValue;
  fromDropDown.selectedIndex = toValue;

  renderCountryFlag(toDropDown);
  renderCountryFlag(fromDropDown);
  convertCurrency();
});

// Initializer
const init = () => {
  renderCountryDropDown();
};

init();
