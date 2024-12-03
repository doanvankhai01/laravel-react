*** Settings ***
Resource               ../keywords/common.robot
Resource               ../keywords/steps.robot
Test Setup             Setup
Test Teardown          Tear Down

*** Test Cases ***
DL_00 Content
  [Tags]                                                                                                Develop                   UI                     Smoketest
  Login to admin
  All steps Content


