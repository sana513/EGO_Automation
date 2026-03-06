function generateEmail() {
  const timestamp = Date.now();           
  const random = Math.floor(Math.random()*1000); 
  return `johnsmith${timestamp}${random}@gmail.com`;
}

function generateGuestEmail() {
  const timestamp = Date.now();
  return `test.guest.${timestamp}@example.com`;
}

function getRandomElement(array) {
  if (!array || array.length === 0) {
    throw new Error('Cannot get random element from empty array');
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function isUKLocale(url) {
  return /\/(uk|eu)|\.co\.uk/.test(url);
}

function isLocaleInList(locale, localeList) {
  return localeList.includes(locale);
}

function generateRandomDOB() {
  const dayVal = Math.floor(Math.random() * 28) + 1;
  const day = dayVal < 10 ? `0${dayVal}` : dayVal.toString();
  
  const months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];
  const month = months[Math.floor(Math.random() * months.length)];
  
  const year = (Math.floor(Math.random() * (2000 - 1950 + 1)) + 1950).toString();
  
  return { day, month, year };
}

module.exports = { 
  generateEmail, 
  generateGuestEmail,
  getRandomElement,
  getRandomIndex,
  shuffleArray,
  isUKLocale,
  isLocaleInList,
  generateRandomDOB
};
