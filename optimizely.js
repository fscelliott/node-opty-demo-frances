
/*  To run:
1. Create an empty project directory. For example, run in the terminal: touch opty-demo
2. Create an empty package.json. Run: npm init. Leave all the prompts blank
3. create optimizely.js: run: touch optimizely.js. 
4. Copy the following code into optimizely.js
5. run: npm install --save @optimizely/optimizely-sdk
6. run: node optimizely.js. Answer the prompt, then press Ctl+C twice to exit
7. repeat step 5 a few times, then head over to the Optimizely app to see experiment results
 */



const optimizelySDK = require('@optimizely/optimizely-sdk');
const enums = optimizelySDK.enums;
const optimizelyClientInstance = optimizelySDK.createInstance({
  sdkKey: 'PnsTgkYA2fJUhHZRnZ9S5f'
});


//accept user input (to mock event tracking)
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


optimizelyClientInstance.onReady().then(() => {
  //optimizelyClientInstance downloaded your Optimizely configuration
  console.log('Optimizely client ready');
  /* --------------------------------
     OPTIONAL: Add a notification listener so you can later integrate with third party analytics platforms
     --------------------------------
     */
  const listenerId = optimizelyClientInstance.notificationCenter.addNotificationListener(enums.NOTIFICATION_TYPES.DECISION,
    function (decision) {
      console.log(
        `Notification listener: User bucketing event for:
                User: ${decision.userId}
                Variation: ${decision.decisionInfo.sourceInfo["variationKey"]}
                Experiment: ${decision.decisionInfo.sourceInfo["experimentKey"]}`);
      // send decision to an anayltics platform here
    }
  );

  
    /* --------------------------------
       OPTIONAL: to get rapid demo experiment results, generate random user ids so a user gets randomly bucketed into a variation every time you rerun
       --------------------------------
     */ 
  function makeid() {
    var userId = "";
    userId = String(Math.random());
    return userId;
  };
  // make a random user ID
  const userId = makeid();


      /* --------------------------------
       Bucket user into a flag variation and mock experiment results
       --------------------------------
     */ 

  // get flag enabled status
  const enabled = optimizelyClientInstance.isFeatureEnabled('discount', userId);
  if (enabled) {
    // get the flag variable value, as determined by the variation the user buckets into
    const discountAmount = optimizelyClientInstance.getFeatureVariable('discount', 'amount', userId);
    console.log(userId + " got a discount of " + discountAmount);
    readline.question('Pretend they made a purchase? y/n', (answer) => {
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
    console.log(userId + " didn't get a discount (flag disabled)")
    readline.question('Pretend that they made a purchase? y/n', (answer) => {
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

