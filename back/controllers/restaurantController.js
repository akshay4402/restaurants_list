var mongoose = require('mongoose');
const restaurants = mongoose.model('resData');


exports.list = async function (req, res) {
  try {
    console.log('list');
  } catch(e) {
    console.log(e);
  }
}

exports.add = async function (req, res) {
  try {
    console.log('res')
    console.log(req.body);
    res.json('success')
  } catch(e) {
    console.log(e);
  }
}