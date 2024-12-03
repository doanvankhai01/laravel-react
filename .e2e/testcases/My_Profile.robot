*** Settings ***
Resource               ../keywords/common.robot
Resource               ../keywords/steps.robot
Test Setup             Setup
Test Teardown          Tear Down

*** Test Cases ***
MP_00 My Profile
  [Tags]                                                                                               Develop                 UI                     Smoketest
  Login to admin
  All steps My Profile
