*** Settings ***
Resource               ../keywords/common.robot
Resource               ../keywords/steps.robot
Test Setup             Setup
Test Teardown          Tear Down

*** Test Cases ***
LO_00 Login
  [Tags]                                                                                                Develop                   UI                     Smoketest
  All steps Login

