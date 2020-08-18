const ESNSService = require('./ESNSService')

module.exports = function advanceNotifications(params) {
    return new Promise((resolve, reject) => {

        if (params.settings) {
            if (params.settings.email) {
                params.data.emailData.map(async data => {
                    await ESNSService.sendEmail(data);
                })
            }

            if (params.settings.pushNotification) {
                params.data.pushNotificationData.map(async data => {
                    await ESNSService.sendNotification(data);
                })
            }

            if (params.settings.sms) {
                params.data.smsData.map(async data => {
                    await ESNSService.sendSms(data);
                })
            }

        }
        return resolve(params)
    })
}