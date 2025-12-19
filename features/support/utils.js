function generateEmail() {
  const timestamp = Date.now();           // milliseconds
  const random = Math.floor(Math.random()*1000); // 0-999
  return `johnsmith${timestamp}${random}@gmail.com`;
}


module.exports = { generateEmail };
