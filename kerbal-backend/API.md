# API Documentation

  * [KerbalWeb.ClusterController](#kerbalweb-clustercontroller)
    * [query](#kerbalweb-clustercontroller-query)
  * [KerbalWeb.DomainController](#kerbalweb-domaincontroller)
    * [create](#kerbalweb-domaincontroller-create)
    * [query](#kerbalweb-domaincontroller-query)
    * [delete](#kerbalweb-domaincontroller-delete)
    * [query](#kerbalweb-domaincontroller-query)
    * [delete](#kerbalweb-domaincontroller-delete)
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

## KerbalWeb.ClusterController
### <a id=kerbalweb-clustercontroller-query></a>query
#### query and create and destroy domain

##### Request
* __Method:__ GET
* __Path:__ /api/cluster?cpu_count=1&gpu[name]=&gpu[vram_size]=0&gpu_count=0&ram_size=3145728

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACB3LyI5GF3_Fqy7W3dRlDWJ65qMLGyb_ejnstWupOzXgw.maGoMWz4SiOQgsJGr43Xb7137NT7vf38hucGfgzUSR0; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-b9nPiyPpEsAAABL
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
```
* __Response body:__
```json
{
  "result": [
    {
      "cpu_count": 16,
      "free_cpu_count": 16,
      "free_ram_size": 32767996,
      "gpus": [
        {
          "bus": "01",
          "domain_uuid": "",
          "free": true,
          "function": "0",
          "gpu_id": "nonode@nohost10de:1f08",
          "name": "NVIDIA Corporation TU106 [GeForce RTX 2060 Rev. A]",
          "node_id": "nonode@nohost",
          "online": true,
          "slot": "00",
          "vram_size": 0
        }
      ],
      "node_id": "nonode@nohost",
      "ram_size": 32767996,
      "storage_role": "_"
    }
  ],
  "status": "ok"
}
```

## KerbalWeb.DomainController
### <a id=kerbalweb-domaincontroller-create></a>create
#### query and create and destroy domain

##### Request
* __Method:__ POST
* __Path:__ /api/cluster/domain
* __Request headers:__
```
cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACB3LyI5GF3_Fqy7W3dRlDWJ65qMLGyb_ejnstWupOzXgw.maGoMWz4SiOQgsJGr43Xb7137NT7vf38hucGfgzUSR0
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "cpu_count": 1,
  "gpus": [
    {
      "bus": "01",
      "domain_uuid": "",
      "free": true,
      "function": "0",
      "gpu_id": "nonode@nohost10de:1f08",
      "name": "NVIDIA Corporation TU106 [GeForce RTX 2060 Rev. A]",
      "node_id": "nonode@nohost",
      "online": true,
      "slot": "00",
      "vram_size": 0
    }
  ],
  "ram_size": 2097152
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-cJ2vWKPpEsAAAIK
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
```
* __Response body:__
```json
{
  "domain_uuid": "f2381674-a3ec-4a18-b556-c2ac1134adc2",
  "status": "ok"
}
```

#### query and create and destroy domain

##### Request
* __Method:__ POST
* __Path:__ /api/cluster/domain
* __Request headers:__
```
cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACB3LyI5GF3_Fqy7W3dRlDWJ65qMLGyb_ejnstWupOzXgw.maGoMWz4SiOQgsJGr43Xb7137NT7vf38hucGfgzUSR0
content-type: multipart/mixed; boundary=plug_conn_test
```
* __Request body:__
```json
{
  "cpu_count": 1,
  "gpus": [
    {
      "bus": "01",
      "domain_uuid": "",
      "free": true,
      "function": "0",
      "gpu_id": "nonode@nohost10de:1f08",
      "name": "NVIDIA Corporation TU106 [GeForce RTX 2060 Rev. A]",
      "node_id": "nonode@nohost",
      "online": true,
      "slot": "00",
      "vram_size": 0
    }
  ],
  "ram_size": 2097152
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-dkx8SaPpEsAAAZG
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
```
* __Response body:__
```json
{
  "reason": "{{:badmatch, {:aborted, {{:badmatch, []}, [{TrackingStation.Scheduler.DomainMonitor, :\"-check_and_allocate/2-fun-0-\", 1, [file: 'lib/tracking_station/scheduler/domain_monitor.ex', line: 77]}, {Enum, :\"-map/2-lists^map/1-0-\", 2, [file: 'lib/enum.ex', line: 1658]}, {TrackingStation.Scheduler.DomainMonitor, :\"-check_and_allocate/2-fun-3-\", 5, [file: 'lib/tracking_station/scheduler/domain_monitor.ex', line: 75]}, {:mnesia_tm, :apply_fun, 3, [file: 'mnesia_tm.erl', line: 884]}, {:mnesia_tm, :execute_transaction, 5, [file: 'mnesia_tm.erl', line: 860]}, {TrackingStation.Scheduler.DomainMonitor, :check_and_allocate, 2, [file: 'lib/tracking_station/scheduler/domain_monitor.ex', line: 73]}, {TrackingStation.Scheduler.DomainMonitor, :init, 1, [file: 'lib/tracking_station/scheduler/domain_monitor.ex', line: 49]}, {:gen_server, :init_it, 2, [file: 'gen_server.erl', line: 851]}, {:gen_server, :init_it, 6, [file: 'gen_server.erl', line: 814]}, {:proc_lib, :init_p_do_apply, 3, [file: 'proc_lib.erl', line: 240]}]}}}, [{TrackingStation.Scheduler.DomainMonitor, :check_and_allocate, 2, [file: 'lib/tracking_station/scheduler/domain_monitor.ex', line: 72]}, {TrackingStation.Scheduler.DomainMonitor, :init, 1, [file: 'lib/tracking_station/scheduler/domain_monitor.ex', line: 49]}, {:gen_server, :init_it, 2, [file: 'gen_server.erl', line: 851]}, {:gen_server, :init_it, 6, [file: 'gen_server.erl', line: 814]}, {:proc_lib, :init_p_do_apply, 3, [file: 'proc_lib.erl', line: 240]}]}",
  "status": "err"
}
```

### <a id=kerbalweb-domaincontroller-query></a>query
#### query and create and destroy domain

##### Request
* __Method:__ GET
* __Path:__ /api/cluster/domain/f2381674-a3ec-4a18-b556-c2ac1134adc2
* __Request headers:__
```
cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACB3LyI5GF3_Fqy7W3dRlDWJ65qMLGyb_ejnstWupOzXgw.maGoMWz4SiOQgsJGr43Xb7137NT7vf38hucGfgzUSR0
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-dlTf2OPpEsAAAbG
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
```
* __Response body:__
```json
{
  "result": {
    "domain_id": 4,
    "domain_uuid": "f2381674-a3ec-4a18-b556-c2ac1134adc2",
    "port": 5000,
    "running_disk_id": "f6c9b0c5-5823-4051-8af5-ac8f0aadcd0e",
    "spec": {
      "cpu_count": 1,
      "gpus": [
        {
          "bus": "01",
          "function": "0",
          "gpu_id": "nonode@nohost10de:1f08",
          "slot": "00"
        }
      ],
      "ram_size": 2097152
    },
    "status": "booting"
  },
  "status": "ok"
}
```

### <a id=kerbalweb-domaincontroller-delete></a>delete
#### query and create and destroy domain

##### Request
* __Method:__ DELETE
* __Path:__ /api/cluster/domain/f2381674-a3ec-4a18-b556-c2ac1134adc2
* __Request headers:__
```
cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACB3LyI5GF3_Fqy7W3dRlDWJ65qMLGyb_ejnstWupOzXgw.maGoMWz4SiOQgsJGr43Xb7137NT7vf38hucGfgzUSR0
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-pi3GFWPpEsAAAMH
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
```
* __Response body:__
```json
{
  "status": "ok"
}
```

### <a id=kerbalweb-domaincontroller-query></a>query
#### query domain that doesn't exist

##### Request
* __Method:__ GET
* __Path:__ /api/cluster/domain/12345678-1234-1234-0000-123412341234

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACCBw0dzcjAtxrJtw09Gk-BOQ8OB4yIP65H9ON7t866ADg.XQK7W4SVFlqmqsMkWseD7crepS4Z9m6-LpQYqRYv4dI; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-szsFBBWk04AAAdG
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
```
* __Response body:__
```json
{
  "reason": "not_exist",
  "status": "err"
}
```

### <a id=kerbalweb-domaincontroller-delete></a>delete
#### delete domain that doesn't exist

##### Request
* __Method:__ DELETE
* __Path:__ /api/cluster/domain/12345678-1234-1234-0000-123412341234

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACCkja3tPRqwUTF8pWm5U69qp8E5a4P6maof_mnqZIvjMg.KzG-YaUlbncjjbcQN0qIkAh8h4PC2FFq4jy2G5pYWfM; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-szIent5fWgAAAOH
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
```
* __Response body:__
```json
{
  "reason": "not_exist",
  "status": "err"
}
```

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
    "email": "user-576460752303420606@example.com"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-b9Leh4RgoQAAABD
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
    "email": "user-576460752303420158@example.com"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-cRAVeCGIn0AAAWB
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
x-request-id: F1xI-cP4Bfzxf_MAAATB
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
x-request-id: F1xI-cQY2jANnRAAAALI
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
    "email": "user-576460752303423481@example.com",
    "password": "hello world!"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAACbQAAAA5saXZlX3NvY2tldF9pZG0AAAA7dXNlcnNfc2Vzc2lvbnM6ZE5zajlBdlhWelRtYmpheERFLTNnZHhTWHR1cWo3TXExRU4yMGFTX1lpdz1tAAAACnVzZXJfdG9rZW5tAAAAIHTbI_QL11c05m42sQxPt4HcUl7bqo-zKtRDdtGkv2Is.DOis0ftgpPUzv0lNm_hBVrRhWUSKjHyzRrHS5ifXMqA; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-bz1I7HXWvwAAAEH
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
x-request-id: F1xI-cKh5jLTQngAAAJK
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
    "email": "user-576460752303423351@example.com"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-b9yQs943hoAAAOG
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
x-request-id: F1xI-cRMJrpMC2EAAANI
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
* __Path:__ /api/users/reset_password/O0rYQmpuYlxr5c9n7CKonOyquYpuyvul3gCH7NbB0tE
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
x-request-id: F1xI-cPRsRZrKDoAAARB
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
* __Path:__ /api/users/reset_password/h7h02V-n8FkptpF900AOvPsusFL4Popivj6KQUJ1LQk
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
x-request-id: F1xI-cKnaiC6xbwAAADE
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
x-request-id: F1xI-cQr1DL8lmMAAAMI
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
    "email": "user-576460752303422970@example.com",
    "password": "hello world!"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAACbQAAAA5saXZlX3NvY2tldF9pZG0AAAA7dXNlcnNfc2Vzc2lvbnM6MU1maHFnbmN6T1NETU03bjRZZG1yalo1SzVDdG9vaVEwNllTNTdCX3RDRT1tAAAACnVzZXJfdG9rZW5tAAAAINTH4aoJ3MzkgzDO5-GHZq42eSuQraKIkNOmEuewf7Qh.nyP5Ds7s7t_kl80UYY2hEg1Fw6oskd_93lwgqX0iGCY; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-b8VrnDqi60AAAFH
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
```
* __Response body:__
```json
{
  "status": "ok"
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
    "email": "user-576460752303422905@example.com",
    "password": "hello world!",
    "remember_me": "true"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_web_user_remember_me=SFMyNTY.g2gDbQAAACDAJ-kpxstAh18-SHwMcN7Cc4BPYc2JIdqH_U0q2OWNYG4GAA_CiOyHAWIATxoA.Py1JoIKjz0G6gCj5QtfxKaamKtmEqkueVAbwA47_HBc; path=/; expires=Tue, 04 Jul 2023 15:29:58 GMT; max-age=5184000; HttpOnly; SameSite=Lax
set-cookie: _kerbal_key=SFMyNTY.g3QAAAACbQAAAA5saXZlX3NvY2tldF9pZG0AAAA7dXNlcnNfc2Vzc2lvbnM6d0NmcEtjYkxRSWRmUGtoOERIRGV3bk9BVDJITmlTSGFoXzFOS3RqbGpXQT1tAAAACnVzZXJfdG9rZW5tAAAAIMAn6SnGy0CHXz5IfAxw3sJzgE9hzYkh2of9TSrY5Y1g.d4pbRQNq0JFoPmxgZ-zcSoTCNvjxbVDZu7NMUcj2P94; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-cMJKt44JiQAAAKH
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
```
* __Response body:__
```json
{
  "status": "ok"
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
    "email": "user-576460752303423097@example.com",
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
x-request-id: F1xI-cLJrmSySL0AAAHH
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
x-request-id: F1xI-cKmRhd5gOoAAAKF
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
x-request-id: F1xI-cLvlYesj3oAAANB
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACAWgVsmi1JbP_bzmCRoPNl8z4cEAAb7_wDCRboy_mk1GA.d2247IVEI8QWTU9avHM9d-Ark77GIOUU9QOWhw9rZ8w; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-cK9_r_wYt4AAAHL
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACBDXN6K--zxSsUVdL0MOBKEAkn0BYF-e2Iap96R2IPT3Q.fy9RA6T9C6OlsgYjzHDi0t8N7_Ril20qJcWSatQNKHo; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-cTza4gaXdYAAASI
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
    "email": "user-576460752303422207@example.com"
  }
}
```

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACB1fF8O3GXvga8ovbrO-edBTiXWBFo9MaED6SvlKL3gzQ.4NTIdtUY2NnXTfM0XHnteNKnPr03pEkFJsv-rtkDL8k; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-cQ0pyAxsQ4AAAVB
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACDEYIMnkAag-x6PuoETIEa-SgeZ8DY4ubwlMyOJ_upDJA.VPbFxktTGx18vyhaB22x6IC8S-kawUHQS7UDIPiAK64; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-cPvop09_1wAAASB
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
* __Path:__ /api/users/settings/confirm_email/IKpgU7sm8L08-XBA_1bMjxKwU-JqUpiD5WQERqEL1DU

##### Response
* __Status__: 200
* __Response headers:__
```
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACCWtCFzMyhsIWOpIe77STcUK9orJSzxkuDpPnU2d2tKiQ.PwROfsX3SF1dvjXiNhd0WzdQEI-4BNeuaO5wtYn6ulQ; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-cSPFl0X8pIAAAKD
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
* __Path:__ /api/users/settings/confirm_email/IKpgU7sm8L08-XBA_1bMjxKwU-JqUpiD5WQERqEL1DU
* __Request headers:__
```
cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACCWtCFzMyhsIWOpIe77STcUK9orJSzxkuDpPnU2d2tKiQ.PwROfsX3SF1dvjXiNhd0WzdQEI-4BNeuaO5wtYn6ulQ
```

##### Response
* __Status__: 200
* __Response headers:__
```
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-cSq2lkX8pIAAAMD
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
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
set-cookie: _kerbal_key=SFMyNTY.g3QAAAABbQAAAAp1c2VyX3Rva2VubQAAACCrSQV0uAiJXxb3QQlpZpGLtkfaDU1XdntkYPRKSdnWPw.-bNummRM9HrobpomaCdGS8YrUibnGYgBsW_UD4VUU9w; path=/; HttpOnly; SameSite=Lax
content-type: application/json; charset=utf-8
cache-control: max-age=0, private, must-revalidate
x-request-id: F1xI-cTN_fg7UvkAAAQI
vary: Origin
access-control-allow-origin: null
access-control-expose-headers: 
access-control-allow-credentials: true
```
* __Response body:__
```json
{
  "status": "err"
}
```

