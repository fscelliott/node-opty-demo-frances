
/*  To run:
1. create an empty project directory, e.g run: touch node-demo
2. run: npm init and leave all the prompts blank
3. create optimizely.js: run: touch optimizely.js and copy the following contents into it
4. run: npm install --save @optimizely/optimizely-sdk
5. run: node optimizely.js and answer the prompts, then press Ctl+C twice to exit
6. repeat step 5 a few times, then head over to the Optimizely app to see experiment results
 */

 //QUESTION FOR ASA/KODY: i've never tried to just run node completely barebones (without say starting from Express)
 //so I'm a little lost on what I need to get the import { enums} statement to work without complaining
 // about package/module type stuff

const optimizelySDK = require('@optimizely/optimizely-sdk');
//import { enums } from '@optimizely/optimizely-sdk';
const optimizelyClientInstance = optimizelySDK.createInstance({
  sdkKey: 'PnsTgkYA2fJUhHZRnZ9S5f' //TODO: change to <SDK_KEY> when publish
});


//accept user input (to mimic event tracking)
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


optimizelyClientInstance.onReady().then(() => {
  //optimizelyClientInstance has downloaded your Optimizely configuration
  //and is ready to use
  console.log('client ready');

  // OPTIONAL: Add a notification listener so you can later integrate with third - party analytics platforms
  /*   const listenerId = optimizelyClientInstance.notificationCenter.addNotificationListener(enums.NOTIFICATION_TYPES.DECISION,
      function (decision) {
        console.log(
          `NOTIFICATION LISTENER: User bucketing event for:
                User: ${decision.userId}
                Variation: ${decision.decisionInfo.sourceInfo["variationKey"]}
                Experiment: ${decision.decisionInfo.sourceInfo["experimentKey"]}`);
        // send decision to an anayltics platform here
      }
    ); */

  // OPTIONAL: to get rapid demo experiment results, generate random user ids so a user gets randomly bucketed into a variation every time you reload
  function makeid() {
    var userId = ""; //TODO should this be a var?
    userId = String(Math.random());
    return userId;
  };
  // make a random user ID
  const userId = makeid();
  // get flag enabled status
  const enabled = optimizelyClientInstance.isFeatureEnabled('discount', userId);
  if (enabled) {
    // get the flag variable value, as determined by the variation the user buckets into
    const discountAmount = optimizelyClientInstance.getFeatureVariable('discount', 'amount', userId);
    // we'll pretend our app confirmed a purchase so we see experiment results in the Optimizely app

    console.log(userId + " got a discount of " + discountAmount);
    readline.question('Should optimizely pretend that they made a purchase? y/n', (answer) => {
      if (answer = 'y') {
        optimizelyClientInstance.track('purchase', userId);
        console.log("Optimizely recorded a purchase in experiment results")
      }
      else {
        console.log("Optimizely didn't record a purchase in experiment results")
      }
      readline.close()
    })

  } else {
    console.log(userId + " did not get the discount flag and made no purchase")
    readline.question('Should optimizely pretend that they made a purchase? y/n', (answer) => {
      if (answer = 'y') {
        optimizelyClientInstance.track('purchase', userId);
        console.log("Optimizely recorded a purchase in experiment results")
      }
      else {
        console.log("Optimizely didn't record a purchase in experiment results")
      }
      readline.close()
    })
  }

}).catch(error => {
  console.log("Error: " + error)
});

