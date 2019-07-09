var mongoose = require('mongoose');
const SearchResults = mongoose.model('SearchResults');
const AirlineFile = mongoose.model('uploaded_file');
const User = mongoose.model('User');
var randomString = require('random-string');
const airlineData = mongoose.model('airlineData');
var xls = require('excel');
var airlineFormat = ['S No', 'Airline name', 'Airline code', 'First name', 'Last name', 'Email']
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var sendgrid = require('sendgrid')(process.env.MAIL_KEY);
const jwt = require('jwt-simple');
const JwtStrategy = require('passport-jwt').Strategy;;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var Cryptr = require('cryptr'),
  cryptr = new Cryptr('snickers');
const personalSettings = mongoose.model('personalSettings');
const organaizationSettings = mongoose.model('organaizationSettings');
const forwarderAgentData = mongoose.model('forwarderAgentData');
var _ = require('underscore');
const axios = require('axios');


exports.saveRow = async function (req, res) {
  try {
    let sendUserEmail = 'info@numaxcloud.com';
    let senduser_Id = '';
    let settingsValue;
    let oragnisationDisplayName = '';
    let oragnisationQuote = 'Advice us best quote for below,';
    let emailPreferences;
    let idSub = jwt.decode(req.headers.authorization.split(' ')[1], process.env.SECRET);
    await personalSettings.findOne({ 'user.id': idSub.sub }, function (err, company) {
      settingsValue = company;
    });
    await organaizationSettings.find({}, function (err, company) {
      if (company && company[0].quotation && company[0].quotation.airline_email) {
        oragnisationDisplayName = company[0].quotation.airline_email.display_name ? company[0].quotation.airline_email.display_name : "";
        oragnisationQuote = company[0].quotation.airline_email.quote ? company[0].quotation.airline_email.quote : "Advice us best quote for below,";
      }
      if (company && company[0] && company[0].email_preferences && company[0].email_preferences.rate_request) {
        emailPreferences = company[0].email_preferences.rate_request;
      }
    });
    let user = await User.findById(idSub.sub);
    if (null !== user && user.email) {
      sendUserEmail = user.email;
      senduser_Id = user._id;
    }
    const dbVal = await SearchResults.findOne({
      _id: req.body.param
    });
    let dbRes = dbVal['results'];
    let tArray = [];
    let mailStatus = false;
    let emailListArray = req.body.airlines;
    let allEmailListArray = req.body.all;
    let airlinesMailBody = [];

    let forwarderemailListArray = req.body.forwarder;
    let allforwarderEmailListArray = req.body.allforwarder;

    // Forwarer Agent begins
    let faEmailsArray = [];
    let faStatusArray = [];
    for (let selectedFA of forwarderemailListArray) {
      let curForwarderAgent = await forwarderAgentData.find({
        'organization.name': selectedFA.organization.name
      });
      let faStatusObj = {
        _id: curForwarderAgent[0].organization._id,
        name: curForwarderAgent[0].organization.name,
        status: {
          contacted: true
        },
        date_details: {
          contacted: new Date()
        }
      };
      faStatusArray.push(faStatusObj);
      let ccListFA = [];
      let bccListFA = [];
      let toListFA = [];
      let commentMsgFA;
      for (let cfa of curForwarderAgent) {

        for (let email of cfa.forwarder_agent.email) {
          if (!toListFA.includes(email)) {
            toListFA.push(email);
          }
        }
        if (selectedFA && selectedFA.cc && selectedFA.cc.length > 0) {
          ccListFA = selectedFA.cc;
        }
        if (allforwarderEmailListArray && allforwarderEmailListArray.cc && allforwarderEmailListArray.cc.length > 0) {
          for (const allcc of allforwarderEmailListArray.cc) {
            if (!ccListFA.includes(allcc)) {
              ccListFA.push(allcc);
            }
          }
        }
        if (selectedFA && selectedFA.bcc && selectedFA.bcc.length > 0) {
          bccListFA = selectedFA.bcc;
        }
        if (allforwarderEmailListArray && allforwarderEmailListArray.bcc && allforwarderEmailListArray.bcc.length > 0) {
          for (const allbcc of allforwarderEmailListArray.bcc) {
            if (!bccListFA.includes(allbcc)) {
              bccListFA.push(allbcc);
            }
          }
        }

        if (selectedFA.comments) {
          commentMsgFA = selectedFA.comments;
        } else {
          commentMsgFA = allforwarderEmailListArray.comments;
        }
      }

      let faEmailsObj = {
        to: emailObjFormatter(toListFA),
        cc: emailObjFormatter(ccListFA),
        bcc: emailObjFormatter(bccListFA),
        comments: commentMsgFA,
        sent_dt: new Date(),
        from: {
          _id: senduser_Id,
          name: sendUserEmail
        },
        forwarder_agent: {
          _id: curForwarderAgent[0].organization._id,
          name: curForwarderAgent[0].organization.name
        }
      };
      faEmailsArray.push(faEmailsObj);

      for (i = 0; i < req.body.data.length; i++) {
        if (!airlinesMailBody.includes(req.body.data[i].airline.name)) {
          airlinesMailBody.push(req.body.data[i].airline.name);
        }
      }
      let mailBodyContent = prepareEmailContent(dbRes[0].origin.id, dbRes[0].destination.id, dbVal['volume_weight'],
        dbVal['weight'], dbRes[0].tariff_mode.adj_name, commentMsgFA, settingsValue, oragnisationDisplayName, oragnisationQuote, airlinesMailBody, '');
      let sub = "Airline Rates " + dbRes[0].origin.id + " - " + dbRes[0].destination.id + " | " + dbRes[0].tariff_mode.adj_name +
        " #" + dbVal['quotation_no'];
   /*   if ((null === settingsValue) || (!settingsValue.emailSettings) || (Object.keys(settingsValue.emailSettings).length === 0) || (settingsValue && settingsValue.emailSettings && settingsValue.emailSettings.type === '') || (settingsValue && settingsValue.emailSettings && settingsValue.emailSettings.type === 'webapi')) {
        ccListFA.push(sendUserEmail);
        sendAirlineEmail(toListFA, sub, mailBodyContent, sendUserEmail, ccListFA, bccListFA);
      } else {
        if (settingsValue.user_email_cc && settingsValue.emailSettings && settingsValue.emailSettings.username &&
          !ccListFA.includes(settingsValue.emailSettings.username)) {
          ccListFA.push(settingsValue.emailSettings.username);
        }
        mailStatus = await customSmtp(settingsValue.emailSettings, toListFA, sub, mailBodyContent, sendUserEmail, ccListFA, bccListFA);
      } */

      if (emailPreferences && emailPreferences === 'custom_email') {
        if (settingsValue.user_email_cc && settingsValue.emailSettings && settingsValue.emailSettings.username &&
          !ccListFA.includes(settingsValue.emailSettings.username)) {
          ccListFA.push(settingsValue.emailSettings.username);
        }
        mailStatus = await customSmtp(settingsValue.emailSettings, toListFA, sub, mailBodyContent, sendUserEmail, ccListFA, bccListFA);
      } else if (emailPreferences && emailPreferences === 'numax_email') {
        ccListFA.push(sendUserEmail);
        mailStatus = await numaxsmtp(toListFA, sub, mailBodyContent, sendUserEmail, ccListFA, bccListFA);
      }


    }
    // Forwarder Agent Ends
    let qt_find = dbRes.findIndex(x => x.rates.sell.total);
    if (qt_find > -1) {
      dbVal['quotation']['modified_by'] = {
        id: user._id,
        name: user.name
      }
      dbVal['quotation_dt']['modified'] = new Date().yyyymmdd()
    } else {
      dbVal['quotation']['prepared_by'] = {
        id: user._id,
        name: user.name
      }
      dbVal['quotation_dt']['prepared'] = new Date().yyyymmdd()
    }
    for (i = 0; i < dbRes.length; i++) {
      let k = req.body.data.findIndex(x => x._id === dbRes[i]['_id']);
      if (k > -1) {
        // Airline Changes Begins
        let ccList = [];
        let bccList = [];
        let toList = [];
        let commentMsg;
        let emainIx = emailListArray.findIndex(x => x.id === dbRes[i].airline.id);
        if (emainIx !== -1) {
          if (emailListArray[emainIx].cc && emailListArray[emainIx].cc.length > 0) {
            ccList = emailListArray[emainIx].cc;
          }
          if (allEmailListArray && allEmailListArray.cc && allEmailListArray.cc.length > 0) {
            for (const allcc of allEmailListArray.cc) {
              if (!ccList.includes(allcc)) {
                ccList.push(allcc);
              }
            }
          }

          if (emailListArray[emainIx].bcc && emailListArray[emainIx].bcc.length > 0) {
            bccList = emailListArray[emainIx].bcc;
          }
          if (allEmailListArray && allEmailListArray.bcc && allEmailListArray.bcc.length > 0) {
            for (const allbcc of allEmailListArray.bcc) {
              if (!bccList.includes(allbcc)) {
                bccList.push(allbcc);
              }
            }
          }
          if (emailListArray[emainIx].comments) {
            commentMsg = emailListArray[emainIx].comments;
          } else {
            commentMsg = allEmailListArray.comments;
          }
        }

        // Airline changes End
        let ix = tArray.findIndex(x => x.origin === dbRes[i].origin.id && x.destination === dbRes[i].destination.id &&
          x.tmode === dbRes[i].tariff_mode.adj_name && x.airline === dbRes[i].airline.id);
        if (ix === -1) {
          let tObj = {
            origin: dbRes[i].origin.id,
            destination: dbRes[i].destination.id,
            tmode: dbRes[i].tariff_mode.adj_name,
            airline: dbRes[i].airline.id
          }
          tArray.push(tObj);

          let mailBodyContent = prepareEmailContent(dbRes[i].origin.id, dbRes[i].destination.id, dbVal['volume_weight'],
            dbVal['weight'], dbRes[i].tariff_mode.adj_name, commentMsg, settingsValue, oragnisationDisplayName, oragnisationQuote, [], dbRes[i].airline.name);
          let query = { 'airline.code': dbRes[i].airline.id };
          query['$or'] = [{ 'origin': { $exists: false } }, { 'origin': { $elemMatch: { code: dbRes[i].origin.id } } }, { 'origin': { $eq: [] } }]
          const adata = await airlineData.find(query); // 
          for (let arr of adata) {
            for (let email of arr.airline_agent.email) {
              if (!toList.includes(email)) {
                toList.push(email);
              }
            }
          }

          if (toList.length > 0) {
            let sub = "Airline Rates " + dbRes[i].origin.id + " - " + dbRes[i].destination.id + " | " + dbRes[i].tariff_mode.adj_name +
              " #" + dbVal['quotation_no'];
         /*   if ((null === settingsValue) || (!settingsValue.emailSettings) || (Object.keys(settingsValue.emailSettings).length === 0) || (settingsValue && settingsValue.emailSettings && settingsValue.emailSettings.type === '') || (settingsValue && settingsValue.emailSettings && settingsValue.emailSettings.type === 'webapi')) {
              ccList.push(sendUserEmail);
            //  sendAirlineEmail(toList, sub, mailBodyContent, sendUserEmail, ccList, bccList);
            mailStatus = await numaxsmtp(toList, sub, mailBodyContent, sendUserEmail, ccList, bccList);
            } else {
              if (settingsValue.user_email_cc && settingsValue.emailSettings && settingsValue.emailSettings.username &&
                !ccList.includes(settingsValue.emailSettings.username)) {
                ccList.push(settingsValue.emailSettings.username);
              }
              mailStatus = await customSmtp(settingsValue.emailSettings, toList, sub, mailBodyContent, sendUserEmail, ccList, bccList);

            } */
            console.log(emailPreferences);
            if (emailPreferences && emailPreferences === 'custom_email') {
              if (settingsValue.user_email_cc && settingsValue.emailSettings && settingsValue.emailSettings.username &&
                !ccList.includes(settingsValue.emailSettings.username)) {
                ccList.push(settingsValue.emailSettings.username);
              }
              mailStatus = await customSmtp(settingsValue.emailSettings, toList, sub, mailBodyContent, sendUserEmail, ccList, bccList);
            } else if (emailPreferences && emailPreferences === 'numax_email') {
              ccList.push(sendUserEmail);
            //  sendAirlineEmail(toList, sub, mailBodyContent, sendUserEmail, ccList, bccList);
            mailStatus = await numaxsmtp(toList, sub, mailBodyContent, sendUserEmail, ccList, bccList);
            }
          }
        } else {
          let query = { 'airline.code': dbRes[i].airline.id };
          query['$or'] = [{ 'origin': { $exists: false } }, { 'origin': { $elemMatch: { code: dbRes[i].origin.id } } }, { 'origin': { $eq: [] } }]
          const adata = await airlineData.find(query);
          for (let arr of adata) {
            for (let email of arr.airline_agent.email) {
              if (!toList.includes(email)) {
                toList.push(email);
              }
            }
          }
          if ((null === settingsValue) || (!settingsValue.emailSettings) || (Object.keys(settingsValue.emailSettings).length === 0) || (settingsValue && settingsValue.emailSettings && settingsValue.emailSettings.type === '') || (settingsValue && settingsValue.emailSettings && settingsValue.emailSettings.type === 'webapi')) {
            ccList.push(sendUserEmail);
          } else {
            if (settingsValue.user_email_cc && settingsValue.emailSettings && settingsValue.emailSettings.username &&
              !ccList.includes(settingsValue.emailSettings.username)) {
              ccList.push(settingsValue.emailSettings.username);
            }
          }
        }
        // Airline Email Changes
        let emailsArrValue = {
          to: emailObjFormatter(toList),
          cc: emailObjFormatter(ccList),
          bcc: emailObjFormatter(bccList),
          comments: commentMsg,
          sent_dt: new Date(),
          from: {
            _id: senduser_Id,
            name: sendUserEmail
          }
        };

        if (dbRes[i]['emails'] && dbRes[i]['emails'].length > 0) {
          for (let arr of faEmailsArray) {
            dbRes[i]['emails'].push(arr);
          }
        } else {
          dbRes[i]['emails'] = faEmailsArray;
        }

        if (faEmailsArray && faEmailsArray.length > 0) {
          if (dbRes[i]['info']['forwarder_agents'] && dbRes[i]['info']['forwarder_agents'].length > 0) {
            for (let fa of faStatusArray) {
              dbRes[i]['info']['forwarder_agents'].push(fa);
            }
          } else {
            dbRes[i]['info']['forwarder_agents'] = faStatusArray;
          }
        }
        if (mailStatus) {
        if (toList.length > 0) {
          dbRes[i]['emails'].push(emailsArrValue);
          dbRes[i]['info']['airline_contacted']['status'] = true;
          dbRes[i]['info']['airline_contacted']['send_dt'] = new Date();
        }
      }
        // if (dbRes[i]['info'] && dbRes[i]['info']['send_to_customer'] && !dbRes[i]['info']['send_to_customer']['status']) {
        //   dbVal['quotation_dt']['prepared'] = new Date().yyyymmdd()
        // } else if (dbRes[i]['info'] && dbRes[i]['info']['send_to_customer'] && dbRes[i]['info']['send_to_customer']['status']) {
        //   dbVal['quotation_dt']['modified'] = new Date().yyyymmdd()
        // }
        // Airline Email Changes
      }
    }


    if (dbVal.status && dbVal.status.value === 'Enquiry') {
      dbVal.status.value = 'Pending';
    }
    dbVal['comments'] = req.body.comment;
    await dbVal.save();
    let emailStat = {
      success: false,
      failed: true
    };
    if (mailStatus) {
      emailStat = {
        success: true,
        failed: false
      }
    }
    res.json({
      id: { id: req.body.param },
      status: emailStat
    });
  } catch (e) {
    console.log(e)
  }

}

function emailObjFormatter(emailArray) {
  let emailArrayList = [];
  for (let emailId of emailArray) {
    emailArrayList.push({ email: emailId });
  }
  return emailArrayList;
}

function prepareEmailContent(org, dest, volume_weight, weight, tMode, comments, signature, header, quote, airlines, airlineName) {
  let htmlContent = "<div><p>Dear Sir/Madam,</p><p>Greetings from " + header + " </p><span style='font-weight:bold'>" + quote + "</span><br/><br/>";
  htmlContent = htmlContent + "<table><tr><td>Origin</td><td> : " + org + "</td></tr>" +
    "<tr><td>Destination</td><td> : " + dest + "</td></tr></table>";
  if (volume_weight.items.length !== 0) {
    htmlContent = htmlContent + "<table style='min-width: 60%;border-collapse: collapse;border:1px solid black'><thead style='background: #e0d9d9'><tr><td style='padding:6px'>Dimensions (" + volume_weight.unit + ")</td><td style='padding:6px'>No of pieces</td><td style='padding:6px'>Weight/kg</td></tr></thead>";
    for (let item of volume_weight.items) {
      htmlContent = htmlContent + "<tr style='border-bottom:1px solid black'><td style='padding:6px'>" + item.dims.length + " x " + item.dims.width + " x " + item.dims.height + "</td><td style='padding:6px'>" + item.pieces + "</td><td style='padding:6px'>" + ((item.weight.piece !== 0) ? item.weight.piece : '-') + "</td></tr>";
    }
    htmlContent = htmlContent + "</table>";
  }
  htmlContent = htmlContent + "<table>";
  if (weight.gross && weight.gross.value) {
    htmlContent = htmlContent + "<tr><td>Gross Weight</td><td> : " + weight.gross.value + " " + weight.gross.unit + "</td></tr>";
  }
  if (weight.volume && weight.volume.value) {
    htmlContent = htmlContent + "<tr><td>Volume Weight</td><td> : " + weight.volume.value + " " + weight.volume.unit + "</td></tr>";
  }
  if (volume_weight.total && volume_weight.total.weight && volume_weight.total.weight.volume_m3) {
    htmlContent = htmlContent + "<tr><td>Cubic meter(CBM)</td><td> : " + volume_weight.total.weight.volume_m3 + " m³" + "</td></tr>";
  }
  if (volume_weight.total && volume_weight.total.pieces) {
    htmlContent = htmlContent + "<tr><td>No of piece(s)</td><td> : " + volume_weight.total.pieces + "</td></tr>";
  }
  htmlContent = htmlContent + "<tr><td>Tariff Mode</td><td> : " + tMode + "</td></tr>";
  if (airlines.length > 0) {
    htmlContent = htmlContent + "<tr><td>Airlines</td><td> : ";
    for (let ai in airlines) {
      htmlContent = htmlContent + airlines[ai];
      if (ai < airlines.length - 1) {
        htmlContent = htmlContent + ", ";
      }
    }
    htmlContent = htmlContent + "</td></tr>";
  } else if (airlineName) {
    htmlContent = htmlContent + "<tr><td>Airline</td><td> : " + airlineName + "</td></tr>";
  }
  if (comments) {
    htmlContent = htmlContent + "<tr><td>Comments</td><td> : " + comments + "</td></tr></table>";
  } else {
    htmlContent = htmlContent + "</table>";
  }
  if (signature && signature.signature_settings && signature.signature_settings.signature) {
    htmlContent = htmlContent + "<br/><div>" + signature.signature_settings.signature.replace(/(?:\r\n|\r|\n)/g, '<br />') + "</div>";
  }

  htmlContent = htmlContent + "<div style='padding-top:10px;'><div>Powered by <a href='https://numaxcloud.com/'>Numax</a></div></div>";
  return htmlContent;
}

exports.upload = async function (req, res) {
  csvFile = req.files.file;
  fileSize = req.body.size;
  let userId;
  const extension = csvFile.name.split('.').pop();
  let csvname = randomString({
    length: 6
  });
  let airlineDataData = generateAirlineData(csvFile, fileSize, userId, extension, csvname);
  csvFile.mv(`../../../airline-uploads/${csvname}.${extension}`, (err) => {
    if (err)
      return res.status(500).send(err);
    AirlineFile.create(airlineDataData, function (err, documents) {
      if (err) throw err;
      if (documents) {
        res.json(documents);
      }
    });
  });
}

function generateAirlineData(file, size, userId, ext, randomName) {

  const Airline = {
    file: {
      name: file.name,
      size: size,
      saved_name: randomName,
      location: `../../../airline-uploads/${randomName}.${ext}`,
      ext: ext
    },
    uploaded_by: {
      _id: userId
    },
    type: 'airline',
    status: {
      type: 'uploaded',
      info: 'successfully uploaded'
    },
    created_at: new Date()
  }
  return Airline;
}

exports.getAirlineFiles = async function (req, res) {
  AirlineFile.find({
    type: "airline"
  }, function (err, airlineFile) {
    if (airlineFile) {
      res.json(airlineFile);
    }
  })
}

exports.processFile = async function (req, res) {
  let fileData = [];
  await xls(req.body.file.location, async function (err, data) {
    if (err) {
      return res.status(400).send('Invalid data');
    }
    if (!checkValidation(data)) {
      return res.status(400).send('Invalid data');
    }
    let result = await convertToJSON(data);
    result.forEach((element, i) => {
      let fileObject = {
        _id: new mongoose.Types.ObjectId(),
        airline: {
          _id: new mongoose.Types.ObjectId(),
          code: element['Airline code'],
          name: element['Airline name']
        },
        airline_agent: {
          first_name: element['First name'],
          last_name: element['Last name'],
          email: element['Email']
        },
        uploaded_file_id: req.body._id,
        created_at: new Date()
      }
      fileData.push(fileObject);
    });
    airlineData.create(fileData, async (err, documents) => {
      if (err) throw err;
      if (undefined === documents) return res.status(400).send('Agents already exists');
      if (documents) {
        const file = await AirlineFile.findOne({
          _id: req.body._id
        });

        file.status = {
          type: 'processed',
          info: 'successfully processed'
        }
        await file.save();
        res.json('processed');
      }
    });
  });
}

exports.deleteFile = async function (req, res) {
  AirlineFile.remove({
    _id: req.body._id
  }, async function (error) {
    await airlineData.remove({
      uploaded_file_id: req.body._id
    }, function (err) {
      if (!err) {
        res.json('deleted');
      }
    });
  });
}

exports.createAirline = async function (req, res) {

  const find = await airlineData.find({ 'airline.code': req.body.airline[0].id, 'airline_agent.email': req.body.form.email });
  if (find.length != 0) return res.status(400).send({ message: 'email id alrady exists' })
  let fileObject = {
    _id: new mongoose.Types.ObjectId(),
    airline: {
      _id: new mongoose.Types.ObjectId(),
      code: req.body.airline[0].id,
      name: req.body.airline[0].name
    },
    airline_agent: {
      first_name: req.body.form.firstName,
      last_name: req.body.form.lastName,
      email: req.body.form.email
    },
    origin: req.body.origin,
    created_at: new Date()
  }
  airlineData.create(fileObject, async (err, documents) => {
    if (err) throw err;
    if (documents) {
      res.json('created');
    }
  });
}

exports.airlineResults = async function (req, res) {


  let idSub = jwt.decode(req.headers.authorization.split(' ')[1], process.env.SECRET);
  let user = await User.findOne({_id: idSub.sub});
  airlineData.find({'origin._id': {$in: user.origins.map(x => x._id)}},{}, { sort: { '_id' : -1 }}, function (err, customer) {
    if (customer) {
      res.json(customer);
    }
  })
}

exports.updateAirline = async function (req, res) {
  let fileObject = {
    airline: {
      _id: new mongoose.Types.ObjectId(),
      code: req.body.airline[0].id,
      name: req.body.airline[0].name
    },
    airline_agent: {
      first_name: req.body.form.firstName,
      last_name: req.body.form.lastName,
      email: req.body.form.email
    },
    origin: req.body.origin
  }
  airlineData.update({
    _id: req.body.id
  }, fileObject, (err, raw) => {
    if (err) {
      res.send(err);
    }
    res.json('updated');

  });

}

exports.deleteAirline = async function (req, res) {
  airlineData.remove({
    _id: req.body._id
  }, function (err) {
    if (!err) {
      res.json('deleted');
    }
  });
}

async function convertToJSON(array) {
  var first = array[0].join()
  var headers = first.split(',');

  var jsonData = [];
  for (var i = 1, length = array.length; i < length; i++) {

    var myRow = array[i].join();
    var row = myRow.split(',');

    var data = {};
    for (var x = 0; x < row.length; x++) {
      data[headers[x]] = row[x];
    }
    await airlineData.findOne({ 'airline_agent.email': data.Email, 'airline.code': data['Airline code'] }, (err, document) => {
      if (!document && '' !== data.Email) {
        jsonData.push(data);
      }
    })

  }
  return jsonData;
};

function checkValidation(data) {
  if (data[0].length === airlineFormat.length) {
    let count = 0;
    data[0].forEach((element, index) => {
      if (element !== airlineFormat[index]) {
        count++;
      }
    });
    return (count === 0 ? true : false)
  } else {
    return false;
  }
};

async function sendAirlineEmail(toAdd, sub, mailBodyContent, sendUser, ccEmail, bccEmail) {
  let status;
  var mailOptions = {
    from: '<email@numaxcloud.com>', // sender address
    fromname: 'Numax Cloud',
    to: toAdd, // list of receivers
    cc: ccEmail,
    bcc: bccEmail,
    replyto: sendUser,
    subject: sub, // Subject line
    html: mailBodyContent, // html body
  }

  await sendgrid.send(mailOptions, await
    function (err, json) {
      if (err) {

        console.error(err);
        status = false;
      }
      status = true;
    });
  return status;
}

async function numaxsmtp(toAdd, sub, mailBodyContent, sendUser, ccEmail, bccEmail) {
  let status;
  let type;
  let settings = {
    securityType: process.env.DEFAULT_EMAIL_SECURITY_TYPE,
    username: process.env.DEFAULT_EMAIL_ID,
    password: process.env.DEFAULT_EMAIL_PASSWORD,
    host: process.env.DEFAULT_EMAIL_HOST,
    port: process.env.DEFAULT_EMAIL_PORT,
    smtp_status: true
  };
  if (settings.securityType === 'SSL') {
    type = true
  } else {
    type = false
  }
  var decryptedString = cryptr.decrypt(settings.password);
  if (settings.smtp_status) {
    let obj = {
      smtp_settings: {
        host: settings.host,
        port: Number(settings.port),
        secure: type,
        auth: {
          user: settings.username,
          pass: settings.password //
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      mail_options: {
        from: settings.username, // sender address
        to: toAdd, // list of receivers
        cc: ccEmail,
        bcc: bccEmail,
        subject: sub, // Subject line
        html: mailBodyContent, 
      },
      host: process.env.host,
      status: 'active'
    };
    let  response = await axios.post(`http://${process.env.MAIL_IP}/api/post`, obj);
     if (response.status == 200) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
}

async function customSmtp(settings, toAdd, sub, mailBodyContent, sendUser, ccEmail, bccEmail) {
  let status;
  let type;
  if (settings.securityType === 'SSL') {
    type = true
  } else {
    type = false
  }
  var decryptedString = cryptr.decrypt(settings.password);
  if (settings.smtp_status) {
    let obj = {
      smtp_settings: {
        host: settings.host,
        port: Number(settings.port),
        secure: type,
        auth: {
          user: settings.username,
          pass: settings.password //
        },
        tls: {
          rejectUnauthorized: false
        }
      },
      mail_options: {
        from: settings.username, // sender address
        to: toAdd, // list of receivers
        cc: ccEmail,
        bcc: bccEmail,
        subject: sub, // Subject line
        html: mailBodyContent, 
      },
      host: process.env.host,
      status: 'active'
    };
    let  response = await axios.post(`http://${process.env.MAIL_IP}/api/post`, obj);
     if (response.status == 200) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
}