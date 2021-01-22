const _ = require('lodash');
const {Path }= require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');


const Survey = mongoose.model('surveys');

module.exports = app => {

  // Find all surveys made by the user. Login is required.
  app.get('/api/surveys', requireLogin, async (req, res) => {

    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });

    res.send(surveys);
  });


  // When the user clicks the link emailed to them, they will be sent here
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
  
    const p = new Path('/api/surveys/:surveyId/:choice');

    _.chain(req.body)
      .map(({ email, url }) => {
        // Extract JUST the path (not domain) from URL and see if the URL matches proper format
        const match = p.test(new URL(url).pathname); // returns null if no match
        // If the URL is something we are interested in, extract the surveyID and choice (yes/no)
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      .compact() // Takes an array, and removes any elements that are undefined. In this case, undefined elements will be the ones that didn't match our URL
      .uniqBy('email', 'surveyId') // look at emails and surveyId and make sure there are no duplicates
      .each(({ surveyId, email, choice }) => {
        // Find and update ONE record in the collection
        Survey.updateOne(
          // Find the record (survey) that has this recipient in it and the recipient hasn't responded
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          // Once you find the surevy, update it to show that the survey has one more vote and mark
          // the recipient as already voted so they can't vote again
          {
            $inc: { [choice]: 1 },
            // the $ sign lines up with the $elemMatch from the original query. 
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value(); // return the actual array (need bc using _.chain())

    res.send({});
  });

  // This is where User creates survey. Middlewear to make sure user is logged in and has enough credits.
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {


    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      // recipients is a comma seperated string of email addresses to send survey to
      // Take every email in the string, make an array by splitting on commas, for each email, return a new object that has a key of email and value of email w/o whitespace
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // Build the email template
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save(); // Save the survey document
      req.user.credits -= 1;
      const user = await req.user.save(); // Save user bc credit property changed

      res.send(user); // Send back user data so redux can update the credits the user has
    } catch (err) {
      res.status(422).send(err);
    }
  });
};