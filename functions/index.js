'use strict';
/**
 * @author: Facundo Merighi (merighifacundo@gmail.com)
 * This is the GoogleHome assitant myrunhub leaderboard
 */
process.env.DEBUG = 'actions-on-google:*';
const doRequest = require('request');
const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const functions = require('firebase-functions');


/**
 * This is the function declared for firebase.
 * Inside there are the intents that are referenced in the action.json
 * The action.json for those intents has to have a trigger.
 */
exports.getLeaderboard = functions.https.onRequest((request, response) => {
  const app = new ActionsSdkApp({ request, response });
  function mainIntent(app) {
    let speach = "";
    doRequest("https://myrunhub.herokuapp.com/leaderboard", (error, response, leaderboard) => {
      if (error) {
        let inputPrompt = app.buildInputPrompt(false,
          "I couldn't get the leaderboard, something feels wrong.");
        app.ask(inputPrompt);
        return;
      }
      leaderboard = JSON.parse(leaderboard);
      let speach = "This is MyRunHub Leaderboard. ";
      leaderboard.forEach((runner, index) => {
        speach += runner.user + " is in position number " + (index + 1) + ". ";
      })
      let inputPrompt = app.buildInputPrompt(false,
        speach);
      app.ask(inputPrompt);
    })
  }

  let actionMap = new Map();
  actionMap.set(app.StandardIntents.MAIN, mainIntent);
  actionMap.set(app.StandardIntents.TEXT, mainIntent);
  app.handleRequest(actionMap);

});
