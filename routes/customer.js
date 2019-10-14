'use strict';

var _customer = require('../controller/customer');

module.exports = (app) => {
    // Create
    app.post('/customer', _customer.create);

    // Retrieve all
    app.get('/customers', _customer.findAll);

    // Retrieve single with id
    app.get('/customer/:id', _customer.findOne);

    // Update by id
    app.put('/customer/:id', _customer.update);

    // Delete by id
    app.delete('/customer/:id', _customer.delete);

    // Search 
    app.get('/customer/search/:text', _customer.search);
    
    // Pay
    app.put('/customer/pay/:id', _customer.pay);
    
    // Gift
    app.put('/customer/gift/:id', _customer.gift);
};
