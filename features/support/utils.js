function generateEmail() {
  const timestamp = Date.now();           
  const random = Math.floor(Math.random()*1000); 
  return `johnsmith${timestamp}${random}@gmail.com`;
}


module.exports = { generateEmail };
