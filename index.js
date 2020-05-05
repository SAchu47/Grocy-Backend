if(process.env.NODE_ENV !== 'production' )
    //console.log(process.env.NODE_ENV)
    require("dotenv").config()

const express = require('express');
const mongoose = require('mongoose');

const path = require('path')
const app = express();

// Make sure it comes back as json
app.use(express.json()); 

// Database Connection
if(process.env.NODE_ENV !== 'test')
    mongoose.connect(process.env.DATABASE_URL, { 
      useNewUrlParser: true,  
      useUnifiedTopology: true
    })
else
    mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,  
      useUnifiedTopology: true
    })

const db = mongoose.connection;
 
db.on('error', console.error.bind(console, 'DB Connection Error:'));
 
db.once('open', function() {
  console.log(`DB Connection Successful!, ${ process.env.NODE_ENV }`);
}); 

// API's
const userRoute = require('./api/routes/user')
const vendorRoute = require('./api/routes/vendor')
const productRoute = require('./api/routes/product')

app.use('/user', userRoute)
app.use('/vendor', vendorRoute)
app.use('/product', productRoute)
app.use(express.static('public'))

// Handler for 404 - Resource Not Found
app.use((req, res, next) => {
  res.status(404).send('Resource Not Found')
})

// Handler for 500 - Internal Server Error
app.use((err, req, res, next) => {
  console.error(err.stack)

  res.sendFile(path.join(__dirname, './public/500.html'))
})

// Server settings
const PORT = process.env.PORT || 5000
server = app.listen(PORT, () => console.info(`Server has started on ${PORT}`))

module.exports = server