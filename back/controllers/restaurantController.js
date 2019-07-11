var mongoose = require('mongoose');
const restaurants = mongoose.model('resData');


exports.list = async function (req, res) {
  try {
    let query = [];
    query.push({
      $sort: {
          _id: -1
      }
  });
    let restaurantval = await restaurants.aggregate(query);
    res.json(restaurantval)
  } catch(e) {
    console.log(e);
  }
}

exports.add = async function (req, res) {
  try {
    if(req.body && req.body.edit ) {
      console.log(req.body)
      console.log(req.body._id)
      await restaurants.update({ _id : req.body._id }, { $set: {
        'address': req.body.address,
        'name': req.body.name,
        'type' : req.body.type,
        'stars': req.body.stars,
        'vegOrNon' : req.body.vegOrNon,
        'updated_at': new Date()
      }});
      res.json('success');
    } else {
      req.body.created_at = new Date();
      req.body.updated_at = new Date();
      req.body._id = new mongoose.Types.ObjectId();
      await restaurants.create(req.body)
      res.json('success')
    }

  } catch(e) {
    console.log(e);
  }
}



exports.editVal = async function (req, res) {
  try {
    let resVal = await restaurants.find({_id : req.body.id});
    res.json(resVal)
  } catch(e) {
    console.log(e);
  }
}


exports.delete = async function (req, res) {
  try {
    if(req.body) {
    await restaurants.remove({ _id : req.body.id});
    }
    res.json('success')
  } catch(e) {
    console.log(e);
  }
}