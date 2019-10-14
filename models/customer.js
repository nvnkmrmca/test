const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    id: Number,
    number: String,
    fName: String,
	lName: String,
	mobileNo: String,
	email: String,
	agent: String,
	address: String,
	giftModelNumber: String,
	giftName: String,
	giftAmount: Number,
    isActive: Boolean,
	payment: [{
        amount: Number,
	    month: Number,
	    year: Number,
		isActive: Boolean,
		createdAt: Date
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);