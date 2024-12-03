*** Settings ***
Resource               ../keywords/common.robot
Resource               ../keywords/steps.robot
Test Setup             Setup
Test Teardown          Tear Down

*** Test Cases ***
PL_00 Post
  [Tags]                                                                                                Develop                   UI                     Smoketest
  Login to admin
  All steps Post

