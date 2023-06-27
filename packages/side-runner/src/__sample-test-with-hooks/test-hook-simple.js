//TODO: I'm currently focused on hooks for the test completing, but I can also add one before the test starts for things like setting the test name
//      which I need to do for LambdaTest, but maybe I could just do that in the test complete before cleanup.

//TJM: Example command to run this (from the packages/side-runner directory):
//
//      npx selenium-side-runner-with-hooks -k ./dist/__sample-test-with-hooks/**/*.js -- ./dist/__sample-test-with-hooks/sample-test.side
//
//  The " -- " is very important so that the test hooks option (where there can be multiple paths) doesn't get messed up and eat the 
//  final argument of the *.side file.
//

/**
 * This hook will be called after the test completes (regardless of status, even from error) BUT before cleanup is done,
 * so the webdriver is still active.
 * 
 * @param {Object} input Object consisting of the data provided for hooks to do things as needed.
 */
async function onTestCompleteBeforeCleanup(input) {
  console.log('In onTestCompleteBeforeCleanup, input:', input);

  //TJM: Test out trying to set the name of a test in LambdaTest.
  //    The only way to do it is by using their "bad" JS described here, https://www.lambdatest.com/support/docs/change-individual-test-details/
  //    but if you're not executing the test via LambdaTest their "script" results in an error, either in the SIDE runner or SIDE itself.
  //    Using this hook, I can look at the config and see if we're using the LambdaTest server, and if so, execute necessary commands.
  //
  //    This means I don't have to put "executeScript" with bad JS in our *.side file(s) that causes an error but I can still do something like
  //    name the test a human-readable name and take it right from the test dynamically!
  //
  //    I can even dynamically set an accurate status for the test in LambdaTest based on the results here, which seemed impossible to do before,
  //    and they didn't even cover that in their tutorial: https://www.lambdatest.com/support/docs/run-selenium-ide-tests-on-lambdatest-selenium-cloud-grid/
  //
  if(input.sideConfig?.server && input.sideConfig.server.indexOf('lambdatest') >= 0) {
    console.log(`The test, ${input.test.name}, is running via LambdaTest.`);

    //TJM: Test out setting the name.
    //     Note that, any calls to the driver should use "await".
    await input.webDriverExec?.driver?.executeScript(`lambda-name=${input.test.name}`);

    //TJM: I would also report the status at this time and map it to a relevant LambdaTest status, but it's a bit more involved for this example.
  }
  else {
    console.log(`The test, ${input.test.name}, is not running via LambdaTest.`);
  }
}

/**
 * This hook will be called after the test completes (regardless of status, even from error) AND after cleanup is done,
 * so the webdriver is not active.
 * 
 * @param {Object} input Object consisting of the data provided for hooks to do things as needed.
 */
async function onTestCompleteAfterCleanup(input) {
  console.log('In onTestCompleteAfterCleanup, input:', input);
}

module.exports = { onTestCompleteBeforeCleanup: onTestCompleteBeforeCleanup, onTestCompleteAfterCleanup: onTestCompleteAfterCleanup };