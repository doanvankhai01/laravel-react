*** Settings ***
Resource               ../keywords/steps.robot
Test Setup             Setup
Test Teardown          Tear Down

*** Test Cases ***
All steps in website
  when All steps Login
  when All steps My Profile
  when All steps Code
  when All steps User
  when All steps Parameter
  when All steps Content
  when All steps Post
