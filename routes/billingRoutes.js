const keys = require("../config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  app.post("/api/stripe", requireLogin, async (req, res) => {
 
    const charge = await stripe.charges.create({
      amount: 500,
      currency: "usd",
      description: "$5 for 5 credits",
      // This is the ID on the token
      source: req.body.id,
    });

    req.user.credits += 5;
    const user = await req.user.save();

    // Respond to request with actual user
    res.send(user);
  });
};



//---------Example charge object sent back by stripe --------------

// {
//       id: 'tok_1H8v9VL3tSlhGoTFhOVX8DS2',  // The token that identifies the credit card we are trying to charge money to
//       object: 'token',
//       card: {
//         id: 'card_1H8v9VL3tSlhGoTF4BHC6AJx',
//         object: 'card',
//         address_city: null,
//         address_country: null,
//         address_line1: null,
//         address_line1_check: null,
//         address_line2: null,
//         address_state: null,
//         address_zip: null,
//         address_zip_check: null,
//         brand: 'Visa',
//         country: 'US',
//         cvc_check: 'pass',
//         dynamic_last4: null,
//         exp_month: 12,
//         exp_year: 2022,
//         funding: 'credit',
//         last4: '4242',
//         metadata: {},
//         name: '44jordanbailey@gmail.com',
//         tokenization_method: null
//       },
//       client_ip: '67.248.98.17',
//       created: 1595713413,
//       email: '44jordanbailey@gmail.com',
//       livemode: false,
//       type: 'card',
//       used: false
//     }
