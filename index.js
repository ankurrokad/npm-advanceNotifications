const ESNSService = require('./ESNSService')
const _ = require('underscore')

module.exports = {
    async sendAll(params) {
        return new Promise((resolve, reject) => {
            if (params.settings) {
                if (params.settings.email) {
                    if (params.data.emailData && !_.isArray(params.data.emailData)) {
                        params.data.emailData = [params.data.emailData]
                    }
                    params.data.emailData.map(async data => {
                        await ESNSService.sendEmail(data);
                    })
                }

                if (params.settings.pushNotification) {
                    if (params.data.pushNotificationData && !_.isArray(params.data.pushNotificationData)) {
                        params.data.pushNotificationData = [params.data.pushNotificationData]
                    }
                    params.data.pushNotificationData.map(async data => {
                        await ESNSService.sendNotification(data);
                    })
                }

                if (params.settings.sms) {
                    if (params.data.smsData && !_.isArray(params.data.smsData)) {
                        params.data.smsData = [params.data.smsData]
                    }
                    params.data.smsData.map(async data => {
                        await ESNSService.sendSms(data);
                    })
                }

            }
            return resolve(params)
        })
    },

    async sendEmail(options) {
        if (options && !_.isArray(options)) {
            options = [options]
        }
        return new Promise((resolve, reject) => {
            options.map(async data => {
                await ESNSService.sendEmail(data);
            })
            return resolve(true)
        })
    },

    async sendSms(options) {
        if (options && !_.isArray(options)) {
            options = [options]
        }
        return new Promise((resolve, reject) => {
            options.map(async data => {
                await ESNSService.sendSms(data);
            })
            return resolve(true)
        })
    },

    async sendPushNotification(options) {
        if (options && !_.isArray(options)) {
            options = [options]
        }
        return new Promise((resolve, reject) => {
            options.map(async data => {
                await ESNSService.sendPushNotification(data);
            })
            return resolve(true)
        })
    }
}