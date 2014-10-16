var express     = require('express');
var app         = express();
var request     = require('request').defaults({ encoding: null });
var bodyParser  = require('body-parser');
var path        = require('path');

var paymill     = require('paymill-wrapper');
var cloudinary  = require('cloudinary');
var twitter     = require('./lib/twitter');

var dotenv      = require('dotenv');
dotenv.load();
var config      = require('config');

var tuwm        = new twitter({
  consumer_key: config.get('Twitter.consumer_key'),
  consumer_secret: config.get('Twitter.consumer_secret'),
  token: config.get('Twitter.token'),
  token_secret: config.get('Twitter.token_secret')
});



// Application configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

/////////////////////////
// Routes definitions //
////////////////////////

// Homepage. Just sets some variables
app.get('/', function(req, res) {
  var paymillPublicKey    = config.get('Paymill.public_key'),
      cloudinaryPreset    = config.get('Cloudinary.preset'),
      cloudinaryCloudname = config.get('Cloudinary.cloud_name'),
      amount              = config.get('Settings.price'),
      currency            = config.get('Settings.currency');

  res.render('index', {
    paymillPublicKey: paymillPublicKey,
    cloudinaryPreset: cloudinaryPreset,
    cloudinaryCloudname: cloudinaryCloudname,
    amount: amount,
    currency: currency
  });
});

cloudinary.config({
  cloud_name: config.get('Cloudinary.cloud_name'),
  api_key: config.get('Cloudinary.api_key'),
  api_secret: config.get('Cloudinary.api_secret')
});

// The payment actions which is called by the payment form.
app.post('/payments', function(req, res) {
  var paymillSecret   = config.get('Paymill.secret_key'),
      amount          = config.get('Settings.price'),
      currency        = config.get('Settings.currency'),
      paymentGateway  = paymill.getContext(paymillSecret),
      token           = req.param('token');

  // We pass the toke, the amount, and the currency to the PAYMILL API
  paymentGateway.transactions.createWithToken(token, amount, currency).then(function(transaction) {
    res.json({
      status: 'OK',
      transaction_id: transaction.id
    });
  }, function(error) {
    res.json({
      status: 'FAILED',
      error: error,
      message: error.message
    });
  });
});

// This is the route that gets called by the PAYMILL webhook when the status of a transaction changes.
// The 'event' parameter contains information about the transaction as well as its status.
// Here we only take action for succeeded transactions. In a real world application, you would also act upon failed transactions
app.post('/payments/confirm', function(req, res) {
  console.log(req.body);
  if (req.param('event').event_type === 'transaction.succeeded')  {
    var image_id = req.param('event').event_resource.id;
    cloudinary.api.resource(image_id, function(result) {
      var image_url = result.url;
      tuwm.post('#PMHack present a new #PayBooth shot at #TestHome', image_url, function(err, response) {
        if (err) {
          console.log(err);
        }
      });
    });
  }
});

////////////////////////////////
// End of routes definitions //
///////////////////////////////

// Fire up the server
var server = app.listen(3000, function() {
  console.log("PAYBOOTH started and listening on port 3000");
});
