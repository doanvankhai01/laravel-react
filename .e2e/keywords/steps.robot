*** Settings ***
Resource               ../keywords/common.robot
Library                DateTime

*** Keywords ***
All steps Login
  Then Heading should contain "Sign In" inner text
  Then Heading should contain "Enter your details to login to your account" inner text
  Then Webpage should contain "Username" input field
  Then Webpage should contain "Password" input field
  Then Webpage should contain "Log In" button
  Then Webpage should contain "Forgot Password" button

  When Click "Log In" button
  Then Required message "Please enter username" displayed under "Username" field
  Then Required message "Please enter password" displayed under "Password" field

  When Enter "email" in "Username" with "admin.admin.com"
  Then Required message "Please enter a valid email address!" displayed under "Username" field

  When Click "Forgot Password" button
  Then Heading should contain "Forgot Password" inner text
  Then Heading should contain "Please enter your email. An OTP verification code will be sent to you." inner text
  Then Webpage should contain "Recovery Email" input field
  Then Webpage should contain "Get OTP" button
  Then Webpage should contain "Go back to login" button

  When Click "Go back to login" button
  Then Webpage should contain "Username" input field
  Then Webpage should contain "Password" input field
  Then Webpage should contain "Forgot Password" button

  When Click "Forgot Password" button
  When Enter "email" in "Recovery Email" with "_RANDOM_"
  When Click "Get OTP" button
  Then User look message "These credentials do not match our records." popup

  When Enter "email" in "Recovery Email" with "${USER_NAME}"
  When Click "Get OTP" button
  Then User look message "Success" popup
  Then Heading should contain "Forgot Password" inner text
  Then Heading should contain "Please enter the OTP code that has been sent to your email." inner text
  Then Webpage should contain "Code OTP" input field
  Then Webpage should contain "Send code OTP" button
  Then Webpage should contain "Go back to login" button

  When Click "Go back to login" button
  Then Webpage should contain "Username" input field
  Then Webpage should contain "Password" input field
  Then Webpage should contain "Forgot Password" button

  When Enter "email" in "Username" with "${USER_NAME}"
  When Enter "text" in "Password" with "${USER_PASSWORD}"
  When Click "Log In" button
  Then User look message "Success" popup

All steps My Profile
  When Click "My Profile" line in the avatar's account
  Then Webpage should contain the profile information group with name and role
  When Click on "Change Password" tab
  Then Webpage should contain "Password" input field
  Then Webpage should contain "New password" input field
  Then Webpage should contain "Confirm Password" input field
  Then Webpage should contain "Change Password" button

  When Click on "My Profile" tab
  Then Heading should contain "My Profile" inner text
  Then Webpage should contain "My Profile" tab
  Then Webpage should contain "Change Password" tab
  Then Webpage should contain "Full Name" input field
  Then Webpage should contain "Email" input field
  Then Webpage should contain "Phone Number" input field
  Then Webpage should contain "Date of birth" input field
  Then Webpage should contain "Position" input field
  Then Webpage should contain "Description" input field
  Then Webpage should contain "Save" button

  When Enter "test name" in "Full Name" with ""
  When Enter "email" in "Email" with ""
  When Enter "phone" in "Phone Number" with ""
  When Click on cross icon in select "Date of birth"
  When Click on cross icon in select "Position"
  When Enter "text" in textarea "Description" with ""

  Then Required message "Please enter full name" displayed under "Full Name" field
  Then Required message "Please enter email" displayed under "Email" field
  Then Required message "Please enter phone number" displayed under "Phone Number" field
  Then Required message "Please choose date of birth" displayed under "Date of birth" field
  Then Required message "Please choose position" displayed under "Position" field

  When Enter "test name" in "Full Name" with "_RANDOM_"
  When Enter "email" in "Email" with "admin@gmail.com"
  When Enter "phone" in "Phone Number" with "_RANDOM_"
  When Click "date" in "Date of birth" with "_RANDOM_"
  When Click select "Position" with "Developer"
  When Enter "text" in textarea "Description" with "_RANDOM_"

  When Click "Save" button
  Then User look message "Update Success" popup

  Then Data's information in "Full Name" should be equal "_@Full Name@_"
  Then Data's information in "Email" should be equal "_@Email@_"
  Then Data's information in "Phone Number" should be equal "_@Phone Number@_"
  Then Data's information in "Date of birth" should be equal "_@Date of birth@_"
  Then Data's information in "Position" should be equal "_@Position@_"
  Then Data's information in "Description" should be equal "_@Description@_"

All steps User
  When Click "User" menu
  Then Heading should contain "User" inner text
  Then Confirm locating exactly in page of "User" menu
  Then Select on the "Super Admin" item line
  Then Webpage should contain the list data from database
  Then Webpage should contain the search function
  Then Webpage should contain "Full Name" column with sort and search function
  Then Webpage should contain "Position" column with sort and search function
  Then Webpage should contain "Email" column with sort and search function
  Then Webpage should contain "Phone Number" column with sort and search function
  Then Webpage should contain "Created At" column with sort and search function
  Then Webpage should contain "Role" group
  Then Webpage should contain "Add new User Super Admin" button

  When Click "Add new User Super Admin" button
  Then Heading should contain "Add new User Super Admin" inner text
  Then Webpage should contain "Full Name" input field
  Then Webpage should contain "Email" input field
  Then Webpage should contain "Password" input field
  Then Webpage should contain "Confirm Password" input field
  Then Webpage should contain "Phone Number" input field
  Then Webpage should contain "Date of birth" input field
  Then Webpage should contain "Position" input field
  Then Webpage should contain "Description" input field
  Then Webpage should contain "Upload avatar" image upload field
  Then Webpage should contain "Save" button
  Then Webpage should contain "Cancel" button
  When Click "Save" button
  Then Required message "Please enter full name" displayed under "Full Name" field
  Then Required message "Please enter email" displayed under "Email" field
  Then Required message "Please enter phone number" displayed under "Phone Number" field
  Then Required message "Please choose date of birth" displayed under "Date of birth" field
  Then Required message "Please choose position" displayed under "Position" field

  When Enter "test name" in "Full Name" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "password" in "Password" with "_RANDOM_"
  When Enter "password" in "Confirm Password" with "_@Password@_"
  When Enter "phone" in "Phone Number" with "_RANDOM_"
  When Click "date" in "Date of birth" with "yesterday"
  When Click select "Position" with "Tester"
  When Enter "text" in textarea "Description" with "_RANDOM_"
  When Select file in "Upload avatar" with "image.jpg"
  When Click "Save" button
  Then User look message "Create Success" popup

  When Click on the "Enabled user _@Full Name@_" button in the "_@Full Name@_" table line
  Then User look message "Update Success" popup
  Then The status button in the "_@Full Name@_" table line should change to "Disabled user _@Full Name@_"

  When Click on the "Disabled user _@Full Name@_" button in the "_@Full Name@_" table line
  Then The status button in the "_@Full Name@_" table line should change to "Enabled user _@Full Name@_"

  When Click on the "Edit user _@Full Name@_" button in the "_@Full Name@_" table line
  Then Data's information in "Full Name" should be equal "_@Full Name@_"
  Then Data's information in "Email" should be equal "_@Email@_"
  Then Data's information in "Phone Number" should be equal "_@Phone Number@_"
  Then Data's information in "Date of birth" should be equal "_@Date of birth@_"
  Then Data's information in "Position" should be equal "_@Position@_"
  Then Data's information in "Description" should be equal "_@Description@_"
  When Click "Cancel" button

  When Click on the "Edit user _@Full Name@_" button in the "_@Full Name@_" table line
  Then Heading should contain "Edit User Super Admin" inner text
  Then Webpage should contain "Full Name" input field
  Then Webpage should contain "Email" input field
  Then Webpage should contain "Phone Number" input field
  Then Webpage should contain "Date of birth" input field
  Then Webpage should contain "Position" input field
  Then Webpage should contain "Description" input field
  Then Webpage should contain "Upload avatar" image upload field

  When Enter "test name" in "Full Name" with ""
  When Enter "email" in "Email" with ""
  When Enter "phone" in "Phone Number" with ""
  When Click on cross icon in select "Position"
  When Click "Save" button
  Then Required message "Please enter full name" displayed under "Full Name" field
  Then Required message "Please enter email" displayed under "Email" field
  Then Required message "Please enter phone number" displayed under "Phone Number" field
  Then Required message "Please choose position" displayed under "Position" field

  When Enter "test name" in "Full Name" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Phone Number" with "_RANDOM_"
  When Click select "Position" with "Tester"
  When Click "Save" button
  Then User look message "Update Success" popup

  When Click on the "Edit user _@Full Name@_" button in the "_@Full Name@_" table line
  ${before}=                     Get the image's information in "Upload avatar" field
  When Click on cross icon inside image in "Upload avatar"
  When Select file in "Upload avatar" with "image2.jpg"
  When Click "Save" button
  Then User look message "Update Success" popup
  When Click on the "Edit user _@Full Name@_" button in the "_@Full Name@_" table line
  ${after}=                      Get the image's information in "Upload avatar" field
  Then Should Not Be Equal       ${after}    ${before}

  ${yesterday}=                                                                                         Get Current Date                local                         -1 day                                     result_format=%d-%m-%Y
  Then Data's information in "Date of birth" should be equal "${yesterday}"
  When Click on cross icon in select "Date of birth"
  When Click "Save" button
  Then Required message "Please choose date of birth" displayed under "Date of birth" field
  When Click "Cancel" button

  When Click on the "Delete user _@Full Name@_" button in the "_@Full Name@_" table line with cancel
  Then "_@Full Name@_" should be visible in the table line

  When Click on the "Delete user _@Full Name@_" button in the "_@Full Name@_" table line
  Then User look message "Delete Success" popup
  Then "_@Full Name@_" should not be visible in the table line

All steps Parameter
  When Click "Setting" menu
  When Click "Parameter" sub menu to "#/en/setting/parameter"
  Then Confirm locating exactly in page of "Parameter" menu
  Then Heading should contain "Edit Parameter Address" inner text
  Then Webpage should contain "Vietnamese parameter" input field
  Then Webpage should contain "English parameter" input field
  Then Webpage should contain "Save" button

  When Enter "text" in "Vietnamese parameter" with "_RANDOM_"
  When Click "Save" button
  Then Data's information in "Vietnamese parameter" should be equal "_@Vietnamese parameter@_"
  When Enter "text" in "Vietnamese parameter" with "P3A.01.03, Picity High Park, 9A đường Thạnh Xuân 13, P. Thạnh Xuân, Q.12, TP. Hồ Chí Minh, Việt Nam."

  When Enter "text" in "English parameter" with "_RANDOM_"
  When Click "Save" button
  Then Data's information in "English parameter" should be equal "_@English parameter@_"
  When Enter "text" in "English parameter" with "P3A.01.03, Picity High Park, 9A Thạnh Xuan 13 St., Thạnh Xuan Ward, 12 Dist., Ho Chi Minh City, Vietnam."
  When Click "Save" button
  # Then User look message "Update Success" popup

All steps Code
  When Click "Setting" menu
  When Click "Code" sub menu to "#/en/setting/code"
  Then Select on the "Position" item line
  Then Heading should contain "Code" inner text
  Then Confirm locating exactly in page of "Code" menu
  Then Webpage should contain the list data from database
  Then Webpage should contain the search function
  Then Webpage should contain "Code" column with sort and search function
  Then Webpage should contain "Name Code" column with sort and search function
  Then Webpage should contain "Created At" column with sort and search function
  Then Webpage should contain "Type code" group
  Then Webpage should contain "Add new Code Position" button

  When Click "Add new Code Position" button
  Then Heading should contain "Add new Code Position" inner text
  Then Webpage should contain "Name Code" input field
  Then Webpage should contain "Code" input field
  Then Webpage should contain "Description code" input field
  Then Webpage should contain "Save" button
  Then Webpage should contain "Cancel" button
  When Click "Save" button
  Then Required message "Please enter name code" displayed under "Name Code" field
  Then Required message "Please enter code" displayed under "Code" field

  When Enter "test name" in "Name Code" with "_RANDOM_"
  When Enter "paragraph" in textarea "Description code" with "_RANDOM_"
  When Click "Save" button
  Then User look message "Create Success" popup

  When Click on the "Enabled code _@Name Code@_" button in the "_@Name Code@_" table line
  Then User look message "Update Success" popup
  Then The status button in the "_@Name Code@_" table line should change to "Disabled code _@Name Code@_"

  When Click on the "Disabled code _@Name Code@_" button in the "_@Name Code@_" table line
  Then The status button in the "_@Name Code@_" table line should change to "Enabled code _@Name Code@_"

  When Click on the "Edit code _@Name Code@_" button in the "_@Name Code@_" table line
  Then Data's information in "Name Code" should be equal "_@Name Code@_"
  Then Data's information in "Description code" should be equal "_@Description code@_"
  When Click "Cancel" button

  When Click on the "Edit code _@Name Code@_" button in the "_@Name Code@_" table line
  Then Heading should contain "Edit code Position" inner text
  Then Webpage should contain "Name Code" input field
  Then Webpage should contain "Description code" input field
  Then Webpage should contain "Save" button
  Then Webpage should contain "Cancel" button
  When Enter "test name" in "Name Code" with ""
  When Click "Save" button
  Then Required message "Please enter name code" displayed under "Name Code" field

  When Enter "test name" in "Name Code" with "_RANDOM_"
  When Enter "paragraph" in textarea "Description code" with "_RANDOM_"
  When Click "Save" button
  Then User look message "Update Success" popup

  When Click on the "Delete code _@Name Code@_" button in the "_@Name Code@_" table line with cancel
  Then "_@Name Code@_" should be visible in the table line

  When Click on the "Delete code _@Name Code@_" button in the "_@Name Code@_" table line
  Then User look message "Delete Success" popup
  Then "_@Name Code@_" should not be visible in the table line

All steps Content
  When Click "Setting" menu
  When Click "Content" sub menu to "#/en/setting/content"
  Then Select on the "Members" item line
  Then Heading should contain "Content" inner text
  Then Confirm locating exactly in page of "Content" menu
  Then Webpage should contain the list data from database
  Then Webpage should contain the search function
  Then Webpage should contain "Name Content" column with sort and search function
  Then Webpage should contain "Order" column with sort and search function
  Then Webpage should contain "Created At" column with sort and search function
  Then Webpage should contain "Type Content" group
  Then Webpage should contain "Add new Content Members" button

  When Click "Add new Content Members" button
  Then Heading should contain "Add new Content Members" inner text
  Then Webpage should contain "Order" input field
  Then Webpage should contain "Image" image upload field
  Then Webpage should contain "English" tab
  Then Webpage should contain "Name content" input field
  Then Webpage should contain "Description" input field
  Then Webpage should contain "Save" button
  Then Webpage should contain "Cancel" button
  When Click "Save" button
  Then Required message "Please enter name content" displayed under "Name content" field

  When Enter "number" in "Order" with "_RANDOM_"
  When Select file in "Image" with "image.jpg"
  When Click on "Vietnamese" tab
  When Enter "test name" in "Name content" with "_RANDOM_"
  When Enter "paragraph" in textarea "Description" with "_RANDOM_"
  When Click on "English" tab
  When Enter "test name" in "Name content" with "_RANDOM_"
  When Enter "paragraph" in textarea "Description" with "_RANDOM_"
  When Click "Save" button
  Then User look message "Create Success" popup

  When Click on the "Enabled content _@Name content@_" button in the "_@Name content@_" table line
  Then User look message "Update Success" popup
  Then The status button in the "_@Name content@_" table line should change to "Disabled content _@Name content@_"

  When Click on the "Disabled content _@Name content@_" button in the "_@Name content@_" table line
  Then The status button in the "_@Name content@_" table line should change to "Enabled content _@Name content@_"

  When Click on the "Edit content _@Name content@_" button in the "_@Name content@_" table line
  When Click on "English" tab
  Then Data's information in "Order" should be equal "_@Order@_"
  Then Data's information in "Name content" should be equal "_@Name content@_"
  Then Data's information in "Description" should be equal "_@Description@_"
  When Click "Cancel" button

  When Click on the "Edit content _@Name content@_" button in the "_@Name content@_" table line
  Then Heading should contain "Edit Content Members" inner text
  Then Webpage should contain "Order" input field
  Then Webpage should contain "Image" image upload field
  Then Webpage should contain "English" tab
  Then Webpage should contain "Name content" input field
  Then Webpage should contain "Description" input field
  Then Webpage should contain "Save" button
  Then Webpage should contain "Cancel" button
  When Click on "Vietnamese" tab
  When Enter "test name" in "Name content" with ""
  When Click "Save" button
  Then Required message "Please enter name content" displayed under "Name content" field
  When Enter "test name" in "Name content" with "_RANDOM_"
  When Enter "paragraph" in textarea "Description" with "_RANDOM_"

  When Click on "English" tab
  When Enter "test name" in "Name content" with ""
  When Click "Save" button
  Then Required message "Please enter name content" displayed under "Name content" field
  When Enter "test name" in "Name content" with "_RANDOM_"
  When Enter "paragraph" in textarea "Description" with "_RANDOM_"

  When Enter "number" in "Order" with "_RANDOM_"
  When Click "Save" button
  Then User look message "Update Success" popup

  When Click on the "Edit content _@Name content@_" button in the "_@Name content@_" table line
  ${before}=                     Get the image's information in "Image" field
  When Click on cross icon inside image in "Image"
  When Select file in "Image" with "image2.jpg"
  When Click "Save" button
  Then User look message "Update Success" popup
  When Click on the "Edit content _@Name content@_" button in the "_@Name content@_" table line
  ${after}=                      Get the image's information in "Image" field
  Then Should Not Be Equal       ${after}    ${before}
  When Click "Cancel" button

  When Click on the "Delete content _@Name content@_" button in the "_@Name content@_" table line with cancel
  Then "_@Name content@_" should be visible in the table line

  When Click on the "Delete content _@Name content@_" button in the "_@Name content@_" table line
  Then User look message "Delete Success" popup
  Then "_@Name content@_" should not be visible in the table line

All steps Post
  When Click "Setting" menu
  When Click "Post" sub menu to "#/en/setting/post"
  Then Select on the "Projects" item line
  Then Heading should contain "Post" inner text
  Then Confirm locating exactly in page of "Post" menu
  Then Webpage should contain the list data from database
  Then Webpage should contain the search function
  Then Webpage should contain "Name Post" column with sort and search function
  Then Webpage should contain "Slug" column with sort and search function
  Then Webpage should contain "Created At" column with sort and search function
  Then Webpage should contain "Type Post" group
  Then Webpage should contain "Add new Post Projects" button

  When Click "Add new Post Projects" button
  Then Heading should contain "Add new Post Projects" inner text
  Then Webpage should contain "Created At" input field
  Then Webpage should contain "Image" image upload field
  Then Webpage should contain "English" tab
  Then Webpage should contain "Name Post" input field
  Then Webpage should contain "Slug" input field
  Then Webpage should contain "Description" input field
  Then Webpage should contain "Content" input field
  Then Webpage should contain "Save" button
  Then Webpage should contain "Cancel" button
  When Click "Save" button
  Then Required message "Please enter name post" displayed under "Name Post" field
  Then Required message "Please enter slug" displayed under "Slug" field

  When Click "date" in "Created At" with "today"
  When Select file in "Image" with "image.jpg"
  When Click on "Vietnamese" tab
  When Enter "test name" in "Name Post" with "_RANDOM_"
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "paragraph" in textarea "Description" with "_RANDOM_"
  When Enter "text" in editor "Content" with "_RANDOM_"
  When Click on "English" tab
  When Enter "test name" in "Name Post" with "_RANDOM_"
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "paragraph" in textarea "Description" with "_RANDOM_"
  When Enter "text" in editor "Content" with "_RANDOM_"
  When Click "Save" button
  Then User look message "Create Success" popup

  When Click on the "Enabled post _@Name Post@_" button in the "_@Name Post@_" table line
  Then User look message "Update Success" popup
  Then The status button in the "_@Name Post@_" table line should change to "Disabled post _@Name Post@_"

  When Click on the "Disabled post _@Name Post@_" button in the "_@Name Post@_" table line
  Then The status button in the "_@Name Post@_" table line should change to "Enabled post _@Name Post@_"

  When Click on the "Edit post _@Name Post@_" button in the "_@Name Post@_" table line
  When Click on "English" tab
  Then Data's information in "Name Post" should be equal "_@Name Post@_"
  Then Data's information in "Slug" should be equal "_@Slug@_"
  Then Data's information in "Description" should be equal "_@Description@_"
  Then Data's information in "Content" should be equal "_@Content@_"
  When Click "Cancel" button

  When Click on the "Edit post _@Name Post@_" button in the "_@Name Post@_" table line
  Then Heading should contain "Edit Post Projects" inner text
  Then Webpage should contain "Created At" input field
  Then Webpage should contain "Image" image upload field
  Then Webpage should contain "English" tab
  Then Webpage should contain "Name Post" input field
  Then Webpage should contain "Slug" input field
  Then Webpage should contain "Description" input field
  Then Webpage should contain "Content" input field
  Then Webpage should contain "Save" button
  Then Webpage should contain "Cancel" button

  When Click on "Vietnamese" tab
  When Enter "test name" in "Name Post" with ""
  When Enter "text" in "Slug" with ""
  When Enter "paragraph" in textarea "Description" with ""
  When Enter "text" in editor "Content" with ""
  When Click "Save" button
  Then Required message "Please enter name post" displayed under "Name Post" field
  When Enter "test name" in "Name Post" with "_RANDOM_"
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "paragraph" in textarea "Description" with "_RANDOM_"
  When Enter "text" in editor "Content" with "_RANDOM_"

  When Click on "English" tab
  When Enter "test name" in "Name Post" with ""
  When Enter "text" in "Slug" with ""
  When Enter "paragraph" in textarea "Description" with ""
  When Enter "text" in editor "Content" with ""
  When Click "Save" button
  Then Required message "Please enter name post" displayed under "Name Post" field
  When Enter "test name" in "Name Post" with "_RANDOM_"
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "paragraph" in textarea "Description" with "_RANDOM_"
  When Enter "text" in editor "Content" with "_RANDOM_"

  When Click "date" in "Created At" with "yesterday"
  When Click "Save" button
  Then User look message "Update Success" popup

  When Click on the "Edit post _@Name Post@_" button in the "_@Name Post@_" table line
  ${before}=                     Get the image's information in "Image" field
  When Click on cross icon inside image in "Image"
  When Select file in "Image" with "image2.jpg"
  When Click "Save" button
  Then User look message "Update Success" popup
  When Click on the "Edit post _@Name Post@_" button in the "_@Name Post@_" table line
  ${after}=                      Get the image's information in "Image" field
  Then Should Not Be Equal       ${after}    ${before}

  ${yesterday}=                                                                                         Get Current Date                local                         -1 day                                     result_format=%d-%m-%Y
  Then Data's information in "Created At" should be equal "${yesterday}"
  When Click on cross icon in select "Created At"
  When Click "Save" button
  Then Required message "Please choose created at" displayed under "Created At" field
  When Click "Cancel" button

  When Click on the "Delete post _@Name Post@_" button in the "_@Name Post@_" table line with cancel
  Then "_@Name Post@_" should be visible in the table line

  When Click on the "Delete post _@Name Post@_" button in the "_@Name Post@_" table line
  Then User look message "Delete Success" popup
  Then "_@Name Post@_" should not be visible in the table line

