var mongoose = require('mongoose');

const resData = new mongoose.Schema ({
    _id: String, 
    name: String,
    address: {
        line1: String,
        line2: String,
        street: String,
        postalCode: String,
        city: String,
        state: String,
        country: String,
        telephone: String,
        fax: String,
        email: String,
        website: String,
    },
    type: String,
    vegOrNon: String,
    stars: String,
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model('resData', resData);
