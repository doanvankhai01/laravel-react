*** Settings ***
Resource               ../keywords/common.robot
Resource               ../keywords/steps.robot
Test Setup             Setup
Test Teardown          Tear Down

*** Test Cases ***
CL_00 User
  [Tags]                                                                                                Develop                   UI                     Smoketest
  Login to admin
  All steps User
