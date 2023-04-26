# API Documentation

  * [KerbalWeb.UserConfirmationController](#kerbalweb-userconfirmationcontroller)
    * [create](#kerbalweb-userconfirmationcontroller-create)
    * [update](#kerbalweb-userconfirmationcontroller-update)
  * [KerbalWeb.UserRegistrationController](#kerbalweb-userregistrationcontroller)
    * [create](#kerbalweb-userregistrationcontroller-create)
  * [KerbalWeb.UserResetPasswordController](#kerbalweb-userresetpasswordcontroller)
    * [create](#kerbalweb-userresetpasswordcontroller-create)
    * [update](#kerbalweb-userresetpasswordcontroller-update)
  * [KerbalWeb.UserSessionController](#kerbalweb-usersessioncontroller)
    * [create](#kerbalweb-usersessioncontroller-create)
    * [delete](#kerbalweb-usersessioncontroller-delete)
  * [KerbalWeb.UserSettingsController](#kerbalweb-usersettingscontroller)
    * [update](#kerbalweb-usersettingscontroller-update)
    * [confirm_email](#kerbalweb-usersettingscontroller-confirm_email)

## KerbalWeb.UserConfirmationController
### <a id=kerbalweb-userconfirmationcontroller-create></a>create
#### POST /api/users/confirm sends a new confirmation token

##### Request
* __Method:__ POST
* __Path:__ /api/users/confirm
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "email": "user-576460752303422844@example.com"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJPPe_qzqfIAAAmM
```
* __Response body:__
```json
{
  "status": "ok"
}
```

#### POST /api/users/confirm does not send confirmation token if User is confirmed

##### Request
* __Method:__ POST
* __Path:__ /api/users/confirm
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "email": "user-576460752303423037@example.com"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJBYxYWJ4lwAAABJ
```
* __Response body:__
```json
{
  "status": "ok"
}
```

#### POST /api/users/confirm does not send confirmation token if email is invalid

##### Request
* __Method:__ POST
* __Path:__ /api/users/confirm
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "email": "unknown@example.com"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJOtiNImr1IAAAJE
```
* __Response body:__
```json
{
  "status": "err"
}
```

### <a id=kerbalweb-userconfirmationcontroller-update></a>update
#### POST /api/users/confirm/:token does not confirm email with invalid token

##### Request
* __Method:__ POST
* __Path:__ /api/users/confirm/oops

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJJREEMHB2UAAAdM
```
* __Response body:__
```json
{
  "reason": "link is invalid or it has expired",
  "status": "err"
}
```

## KerbalWeb.UserRegistrationController
### <a id=kerbalweb-userregistrationcontroller-create></a>create
#### POST /api/users/register creates account and logs the user in

##### Request
* __Method:__ POST
* __Path:__ /api/users/register
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "email": "user-576460752303423094@example.com",
    "password": "hello world!"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAACbQAAAA5saXZlX3NvY2tldF9pZG0AAAA7dXNlcnNfc2Vzc2lvbnM6akNiS3JFRFJveFV5QmpwTnlkNWRwTG12NkQyZ0RXaS1WMnZLazFSLTFLVT1tAAAACnVzZXJfdG9rZW5tAAAAIIwmyqxA0aMVMgY6TcneXaS5r-g9oA1ovldrypNUftSl.AXlg8XrjvaaD35nKXgD0km3C57eZjwSUJB4kNTxhQkA; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJLhV9wPbroAAAIK
```
* __Response body:__
```json
{
  "status": "ok"
}
```

#### POST /api/users/register errors for invalid data

##### Request
* __Method:__ POST
* __Path:__ /api/users/register
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "email": "with spaces",
    "password": "too short"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVII0ldT62DEQAAAAJ
```
* __Response body:__
```json
{
  "reason": "Invalid email",
  "status": "err"
}
```

## KerbalWeb.UserResetPasswordController
### <a id=kerbalweb-userresetpasswordcontroller-create></a>create
#### POST /api/users/reset_password sends a new reset password token

##### Request
* __Method:__ POST
* __Path:__ /api/users/reset_password
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "email": "user-576460752303422781@example.com"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJR8Rv_6w48AAAMD
```
* __Response body:__
```json
{
  "status": "ok"
}
```

#### POST /api/users/reset_password does not send reset password token if email is invalid

##### Request
* __Method:__ POST
* __Path:__ /api/users/reset_password
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "email": "unknown@example.com"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJBf_bKUlSgAAALC
```
* __Response body:__
```json
{
  "status": "ok"
}
```

### <a id=kerbalweb-userresetpasswordcontroller-update></a>update
#### PUT /api/users/reset_password/:token resets password once

##### Request
* __Method:__ PUT
* __Path:__ /api/users/reset_password/5vq0W0AWz9fDszvscuAOuz17jhqX8wVmSYaFvDpu7lI
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "password": "new valid password",
    "password_confirmation": "new valid password"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJQG5JpVR2QAAAJD
```
* __Response body:__
```json
{
  "status": "ok"
}
```

#### PUT /api/users/reset_password/:token does not reset password on invalid data

##### Request
* __Method:__ PUT
* __Path:__ /api/users/reset_password/2yVs1v-sQlfH2SjXbVcyvZyOFWDiMod85QocBLXF1mI
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "password": "too short",
    "password_confirmation": "does not match"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJSplMEXgCkAAAEH
```
* __Response body:__
```json
{
  "reason": "failed to update user params",
  "status": "err"
}
```

#### PUT /api/users/reset_password/:token does not reset password with invalid token

##### Request
* __Method:__ PUT
* __Path:__ /api/users/reset_password/oops
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "password": "new valid password",
    "password_confirmation": "new valid password"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJPX0J10bekAAAIJ
```
* __Response body:__
```json
{
  "reason": "link is invalid or it has expired",
  "status": "err"
}
```

## KerbalWeb.UserSessionController
### <a id=kerbalweb-usersessioncontroller-create></a>create
#### POST /api/users/log_in logs the user in

##### Request
* __Method:__ POST
* __Path:__ /api/users/log_in
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "email": "user-576460752303423163@example.com",
    "password": "hello world!"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAACbQAAAA5saXZlX3NvY2tldF9pZG0AAAA7dXNlcnNfc2Vzc2lvbnM6akVpSWNrRHR0dWgwNTlkT2V2WS1PRDJVeGNqR1lkaWI1Q3puM3hNTUV6bz1tAAAACnVzZXJfdG9rZW5tAAAAIIxIiHJA7bbodOfXTnr2Pjg9lMXIxmHYm-Qs598TDBM6.uHOxGUMQE9mQ6FjOGVCdm3tZePCQmH4qKyZsQU1TsDg; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJNRQjHJwpIAAAiM
```
* __Response body:__
```json
{
  "status": "ok",
}
```

#### POST /api/users/log_in logs the user in with remember me

##### Request
* __Method:__ POST
* __Path:__ /api/users/log_in
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "email": "user-576460752303423229@example.com",
    "password": "hello world!",
    "remember_me": "true"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_web_user_remember_me=SFMyNTY.g2gDbQAAACBTsmd9JVOpXDnjZtpA63nVgWHa0T0QwC6EAjLd3S8SWW4GACQuJFKHAWIATxoA.BRxmRoKYwxV6muCxWuWw8_04xgtGzPz57UM_qhTYz_I; path=/; expires=Sun, 04 Jun 2023 15:58:35 GMT; max-age=5184000; HttpOnly; SameSite=Lax
set-cookie: _kerbal_key=SFMyNTY.g3QAAAACbQAAAA5saXZlX3NvY2tldF9pZG0AAAA7dXNlcnNfc2Vzc2lvbnM6VTdKbmZTVlRxVnc1NDJiYVFPdDUxWUZoMnRFOUVNQXVoQUl5M2QwdkVsaz1tAAAACnVzZXJfdG9rZW5tAAAAIFOyZ30lU6lcOeNm2kDredWBYdrRPRDALoQCMt3dLxJZ.SkLKYz2NKviyHpRR2Jz8oTXi-coh67_0DD6gRe9Ectk; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJAmfsjNAqkAAAbM
```
* __Response body:__
```json
{
  "status": "ok",
  "token": "jwt-token"
}
```

#### POST /api/users/log_in emits error message with invalid credentials

##### Request
* __Method:__ POST
* __Path:__ /api/users/log_in
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "user_params": {
    "email": "user-576460752303423227@example.com",
    "password": "invalid_password"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJMnNciWAXMAAAgM
```
* __Response body:__
```json
{
  "reason": "Invalid email or password",
  "status": "err"
}
```

### <a id=kerbalweb-usersessioncontroller-delete></a>delete
#### DELETE /api/users/log_out logs the user out

##### Request
* __Method:__ DELETE
* __Path:__ /api/users/log_out

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_web_user_remember_me=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; HttpOnly
set-cookie: _kerbal_key=SFMyNTY.g3QAAAAA.exRSBNUJj-MIcuOk6dbI1nziMGGnsf3qxXLNG1LhHU8; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJOWowXbZb0AAAHJ
```
* __Response body:__
```json
{
  "status": "ok"
}
```

#### DELETE /api/users/log_out succeeds even if the user is not logged in

##### Request
* __Method:__ DELETE
* __Path:__ /api/users/log_out

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_web_user_remember_me=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; HttpOnly
set-cookie: _kerbal_key=SFMyNTY.g3QAAAAA.exRSBNUJj-MIcuOk6dbI1nziMGGnsf3qxXLNG1LhHU8; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJMEK0PU3OoAAAHE
```
* __Response body:__
```json
{
  "status": "ok"
}
```

## KerbalWeb.UserSettingsController
### <a id=kerbalweb-usersettingscontroller-update></a>update
#### PUT /api/users/settings (change password form) updates the user password and resets tokens

##### Request
* __Method:__ PUT
* __Path:__ /api/users/settings
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "action": "update_password",
  "current_password": "hello world!",
  "user_params": {
    "password": "new valid password",
    "password_confirmation": "new valid password"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACA0YK4F0gm3RBBuqx1V6I8j7z0KyT9uWIEo10BWiRS3AA.80iIdEFFWAftNRL8jt_n62zWpMdcTWPEy3wEEaHWRIg; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJUOnZMbi7IAAAGH
```
* __Response body:__
```json
{
  "status": "ok"
}
```

#### PUT /api/users/settings (change password form) does not update password on invalid data

##### Request
* __Method:__ PUT
* __Path:__ /api/users/settings
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "action": "update_password",
  "current_password": "invalid",
  "user_params": {
    "password": "too short",
    "password_confirmation": "does not match"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACAgqnCw0RLxFj_YpddQ98inXRtXKImodKwmz0EF_CoTnQ.RqbX2M3LeV3-TTAMKaeMBOl0ZRdtUOlfdg41PsRfiy4; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJP6sYddq9wAAAIB
```
* __Response body:__
```json
{
  "status": "err"
}
```

#### PUT /api/users/settings (change email form) updates the user email

##### Request
* __Method:__ PUT
* __Path:__ /api/users/settings
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "action": "update_email",
  "current_password": "hello world!",
  "user_params": {
    "email": "user-576460752303422524@example.com"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACCFKg0m6C_iIydNwZxacXKG-BpO8POtXSST43cjFGqDGg.aNDeToEirWJ85Zx9RENvekDaizLp5sgEVSX-dJMAXkU; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJTW706PpEsAAAQE
```
* __Response body:__
```json
{
  "status": "ok"
}
```

#### PUT /api/users/settings (change email form) does not update email on invalid data

##### Request
* __Method:__ PUT
* __Path:__ /api/users/settings
* __Request headers:__
```
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "action": "update_email",
  "current_password": "invalid",
  "user_params": {
    "email": "with spaces"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACDJ8WFmkzluAuuW-XhzJor324KtYd8L_KlKjNkeXf3duQ.tK8kE4jFMXHa5xgB4RMpPmVP_ZvP84lyxrj7RPi7kCM; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJVkxJPS7GkAAALF
```
* __Response body:__
```json
{
  "status": "err"
}
```

### <a id=kerbalweb-usersettingscontroller-confirm_email></a>confirm_email
#### GET /users/settings/confirm_email/:token updates the user email once

##### Request
* __Method:__ GET
* __Path:__ /api/users/settings/confirm_email/npPDqLkVHdibOX1v0vE8ltj1OvTVMTZXTFGh9xQX3PI

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACAi3zMIx9JZrtn4HToBxocMdjcuTXAAUa7NiEQN7gEJjQ.iRLJ8aFEZqTk3TkKXNzsw06yLUQvNoZ2mlbPDX5_x_U; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJRvWSjM5HcAAAOK
```
* __Response body:__
```json
{
  "status": "ok"
}
```

#### GET /users/settings/confirm_email/:token updates the user email once

##### Request
* __Method:__ GET
* __Path:__ /api/users/settings/confirm_email/npPDqLkVHdibOX1v0vE8ltj1OvTVMTZXTFGh9xQX3PI
* __Request headers:__
```
cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACAi3zMIx9JZrtn4HToBxocMdjcuTXAAUa7NiEQN7gEJjQ.iRLJ8aFEZqTk3TkKXNzsw06yLUQvNoZ2mlbPDX5_x_U
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJS10OzM5HcAAAJF
```
* __Response body:__
```json
{
  "status": "err"
}
```

#### GET /users/settings/confirm_email/:token does not update email with invalid token

##### Request
* __Method:__ GET
* __Path:__ /api/users/settings/confirm_email/oops

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACAJUcnCCkYWkkUeCLSKmLM1JVCKUtvjQidaJ9do2OD6zw.hU30umza-9-wboUIUwEd4T1FWxGH7BGfgXNBvtMPB3Q; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1MVIJWWNLEmUE4AAAOF
```
* __Response body:__
```json
{
  "status": "err"
}
```

