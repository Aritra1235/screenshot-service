
const { v4: uuidv4 } = require('uuid');


const outputPath = __dirname+'\\outputs\\' + uuidv4() + '.png'

console.log(outputPath)