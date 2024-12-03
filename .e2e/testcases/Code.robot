*** Settings ***
Resource               ../keywords/common.robot
Resource               ../keywords/steps.robot
Test Setup             Setup
Test Teardown          Tear Down

*** Test Cases ***
### Link to testcases https://docs.google.com/spreadsheets/d/1R_jW5GBVBaMy7YgNKJQ2Ha5xW12Vn0nRzOHE0-OsyF8/edit#gid=778615548 ###
PC_00 Code List
  [Tags]                                                                                                Develop                   UI                     Smoketest
  Login to admin
  All steps Code
