"use strict";

const Customer = require('../models/customer');
var Request = require("request");


// Create and Save a new record
exports.create = (req, res) => {
    // Validate request
    if(!req.body.fName || !req.body.mobileNo) {
        return res.status(400).send({
            message: 'Please fill all the required fields.'
        });
    }

    // Create new object
    const customer = new Customer({
      // id: req.body.id || 0,
      number: req.body.number || '',
      fName: req.body.fName || '',
      lName: req.body.lName || '',
      mobileNo: req.body.mobileNo || '',
      email: req.body.email || '',
      agent: req.body.agent || '',
      address: req.body.address || '',
      giftModelNumber: req.body.giftModelNumber || '',
      giftName: req.body.giftName || '',
      giftAmount: req.body.giftAmount || 0,
      isActive: true,
      payment: []
    });

    // Save record in the database
    customer.save()
    .then(result => {
        res.send(result._id);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating a record."
        });
    });
};

// Retrieve and return all records from the database.
exports.findAll = (req, res) => {
    Customer.find()
    .then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data."
        });
    });
};

// Find a single record with an id
exports.findOne = (req, res) => {
    Customer.findById(req.params.id)
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });            
        }
        res.send(result);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving record with id " + req.params.id
        });
    });
};

// Update a record identified by id in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.fName || !req.body.mobileNo) {
        return res.status(400).send({
            message: 'Please fill all the required fields.'
        });
    }

    // Find record and update it with the request body
    Customer.findByIdAndUpdate(req.params.id, {
        number: req.body.number || '',
        fName: req.body.fName || '',
        lName: req.body.lName || '',
        mobileNo: req.body.mobileNo || '',
        email: req.body.email || '',
        agent: req.body.agent || '',
        address: req.body.address || '',
        // giftModelNumber: req.body.giftModelNumber || '',
        // giftName: req.body.giftName || '',
        // giftAmount: req.body.giftAmount || 0
    }, {new: true})
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });
        }
        res.send(result._id);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating record with id " + req.params.id
        });
    });
};

// Delete a record with the specified id in the request
exports.delete = (req, res) => {
    Customer.findByIdAndRemove(req.params.id)
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });
        }
        res.send({message: "Record deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete record with id " + req.params.id
        });
    });
};

// Search records by text.
exports.search = (req, res) => {
    Customer.find({fName: new RegExp(req.params.text, 'i')})
    .then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving records."
        });
    });
};

exports.pay = (req, res) => {
    // Validate request
    if(!req.params.id || !req.body.amount) {
        return res.status(400).send({
            message: 'Please fill all the required fields.'
        });
    }

    // Find a single record with an id
    Customer.findById(req.params.id)
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });            
        }
        
        var _payment = result.payment;
        var _currentDate = new Date();
        if(!_payment) {
            _payment = [];
        }
        _payment.push({
            amount: req.body.amount,
	        month: _currentDate.getMonth() + 1,
	        year: _currentDate.getFullYear(),
		    isActive: true,
		    createdAt: _currentDate
        });

        // Find record and update it with the request body
        Customer.findByIdAndUpdate(req.params.id, {
            payment: _payment
        }, {new: true})
        .then(iresult => {
            if(!iresult) {
                return res.status(404).send({
                    message: "Record not found with customerId " + req.params.id
                });
            }

            // send sms
            // sms.sendSMS(result.mobileNo, 'Your payment of amount Rs' + req.body.amount + ' for Mega gift scheme in Andavar Furnitures and Electronics for Customer Number ' + result.number + ' is paid successfully on ' + _currentDate.getDate() + '/' + (_currentDate.getMonth() + 1) + '/' + _currentDate.getFullYear() + '.');

            var _to = result.mobileNo, _msg = 'Your payment of amount Rs' + req.body.amount + ' for Mega gift scheme in Andavar Furnitures and Electronics for Customer Number ' + result.number + ' is paid successfully on ' + _currentDate.getDate() + '/' + (_currentDate.getMonth() + 1) + '/' + _currentDate.getFullYear() + '.';
            
            // var url = 'http://www.way2sms.com/api/v1/sendCampaign?apikey=QSES9H6F8E2WI94GNPDDK5SNVGMCS3DK&secret=Y4WHG6WSY6LXFJIG&usetype=stage&senderid=NVN-SMS&phone=' + _to + '&message=' + _msg;

            var _apiKey = '50YXQL4SWR6EO3DQFD4UPOOVO5FBM2FN', _secreteKey = 'UPD6M6PAZJXH68A7';
            var url = 'http://www.way2sms.com/api/v1/sendCampaign?apikey=' + _apiKey + '&secret=' + _secreteKey + '&usetype=prod&senderid=AFAEGS&phone=' + _to + '&message=' + _msg;

console.log('TO:::', _to);
console.log('URL:::', url);
            Request.get(url, (error, response, body) => {
    if(body && body.code && body.code == '200') {
        res.send({status: true, smsStatus: true});
    }
    // console.log('resp::: ', response);
    console.log('body::: ', body);
    res.send({status: true, smsStatus: false});
});
            
            
            /*
            fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: null,
              })
              .then(response => { return response.json(); })
              .then((response) => {
                    if(response){
                        if (response.code == "200"){
                            console.log('sms sent Success: ' + response);
                            
                    res.send({status: true});
                        }else{
                            console.log('sms sent fail: ' + response);
                        }
                  }else{
                    console.log("Some problem occurs. Please contact administrator.");
                  }
                }).catch((error) => {
                    console.log('error', error);
                });
        
            


            way2sms.login('9035624187', 'Naveen@123').then(cookie => {
                console.log('cookie: ', cookie);
                way2sms.send(cookie, result.mobileNo, _msg).then(result => {
                    console.log('sms sent: ', result);
                    res.send({status: true});
                }).then(ex => {
        
                });
            }, reason => {
                console.log('sms not sent: reason -> ', reason);
            }).catch(ex => {
                console.log('sms not sent: error -> ', ex);
            });

            */



            // res.send({status: true});
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Record not found with customerId " + req.params.id
                });                
            }
            return res.status(500).send({
                message: "Error updating record with customerId " + req.params.id
            });
        });

    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving record with id " + req.params.id
        });
    });
};

exports.gift = (req, res) => {
    // Validate request
    if(!req.params.id || !req.body.modelNumber || !req.body.name || !req.body.amount) {
        return res.status(400).send({
            message: 'Please fill all the required fields.'
        });
    }

    // Find record and update it with the request body
    Customer.findByIdAndUpdate(req.params.id, {
      giftModelNumber: req.body.modelNumber || '',
      giftName: req.body.name || '',
      giftAmount: req.body.amount || 0
    }, {new: true})
    .then(result => {
        if(!result) {
            return res.status(404).send({
                message: "Record not found with customerId " + req.params.id
            });
        }
        res.send({status: true});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Record not found with customerId " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating record with customerId " + req.params.id
        });
    });
};