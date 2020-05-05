const mongoose = require("mongoose");
const User = require('../api/models/User');

//Require the dev-dependencies
const server = require('../index')

describe('users', () => {
  beforeEach((done) => { 
      //Before each test we empty the database
      User.remove({}, (err) => { 
        done();           
      });        
  });
});