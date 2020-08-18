# One service to send notification.

## How to pass credentials : 
### Pass 'mailGun' credentials in .env file with exactly same variable names.
- EMAIL_SERVICE = "Name of the service, e.g: 'mailgun'"
- EMAIL_AUTH_USERNAME = "*username*"
- EMAIL_AUTH_PASSWORD = "*password*"


### Pass 'OneSignal' credentials in .env file with exactly same variable names.
- PUSH_NOTIFICATION_USER_AUTH_KEY = "OneSignal User Auth Key"
- PUSH_NOTIFICATION_AUTH_KEY = "OneSignal Auth Key"
- PUSH_NOTIFICATION_APP_ID = "OneSignal App id"


### Pass 'GupShup' credentials in .env file with exactly same variable names.
- SMS_URL = "*URL*"
- SMS_USER_ID = "XXXXXXXXXXX"
- SMS_PASSWORD = "XXXXXXXXXXX"
- SMS_TEMPLATE_ID: "XXXXXXXXXXX"


## Methods

```javascript
const Notification = require('advancedNotifications')

// Send All notifications
// Params Example : https://github.com/ankurrokad/advancedNotifications/blob/master/params.json
    await Notification.sendAll(params)

// Send Emails Only
let params = [
        {
            subject: "Test Email",
            to: ["admin@gmail.com"],
            from: "org@gmail.com",
            template: "common",
            data: {
                message: "Hello World!"
            }
        }, {
            // ....
        }
    ]
    await Notification.sendEmail(params)

// Send Sms Only
   let params = [
        {
            mobiles: "+918866949366",
            message: "Hii, How are you ?"
        }, {
            // ....
        }
    ]
    await Notification.sendSms(params)

// Send Push Notification
   let params = [
        {
            playerIds: ["fXXXXX0-ddf3-4e1e-a88e-cXXXXXXXXf"],
            content: "Test Notification, Content",
            data: "TEST NOTIFICATION DATA",
            title: "TEST TITLE"
        }, {
            // ....
        }
    ]
    await Notification.sendPushNotification(params)

```

#### Example : https://github.com/ankurrokad/advancedNotifications




