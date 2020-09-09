const Email = require('email-templates');
const nodemailer = require('nodemailer');
const request = require('request');
const OneSignal = require('onesignal-node');
const _ = require('underscore');
require('dotenv').config();

module.exports = {
    sendEmail: async (obj) => {
        let transport = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_AUTH_USERNAME,
                pass: process.env.EMAIL_AUTH_PASSWORD
            }
        });

        const email = new Email({
            message: {
                from: obj.from,
                cc: obj.cc || [],
                bcc: obj.bcc || [],
                subject: obj.subject,
                attachments: obj.attachments
            },
            send: true,
            transport: transport,
            views: {
                options: {
                    extension: 'ejs'
                }
            }
        });

        if (!_.isArray(obj.to)) {
            obj.to = [obj.to];
        }

        return await Promise.all(_.map(obj.to, (emailId) => {
            email
                .send({
                    template: obj.template,
                    message: {
                        to: emailId,
                        cc: obj.cc
                    },
                    locals: obj.data,
                })
                .then((res) => {
                    console.log(res.response, res.envelope.to);
                })
                .catch((err) => {
                    console.log(err);
                });
        }));

    },

    sendSms: async (obj) => {
        if (obj.to) {
            obj.mobiles = obj.to;
        }
        let mobiles;
        if (_.isArray(obj.mobiles)) {
            obj.mobiles = _.map(obj.mobiles, (m) => {
                let tmpNo = m.split('+');
                return tmpNo[1] ? tmpNo[1] : tmpNo[0];
            });
            mobiles = obj.mobiles.join(',');
        }
        else {
            let tmpNo = obj.mobiles.split('+');
            mobiles = tmpNo[1] ? tmpNo[1] : tmpNo[0];
        }
        let query = {
            loginid: process.env.SMS_USER_ID,
            password: process.env.SMS_PASSWORD,
            v: 1.1,
            send_to: mobiles,//obj.mobiles,
            msg: obj.message,
            method: 'sendMessage',
            msg_type: 'text',
            template_id: process.env.SMS_TEMPLATE_ID
        }
        return await new Promise((resolve, reject) => {
            request.get({
                url: process.env.SMS_URL,
                qs: query
            },
                function (error, response, body) {
                    if (error) {
                        console.log('SMS err:', error);
                        reject(error);
                    }
                    else {
                        resolve(body);
                    }
                });
        });
    },


    async sendNotification(options) {
        let appData = {
            appAuthKey: process.env.PUSH_NOTIFICATION_AUTH_KEY,
            appId: process.env.PUSH_NOTIFICATION_APP_ID
        }
        const myClient = new OneSignal.Client({
            userAuthKey: process.env.EMAIL_AUTH_USERNAME,
            app: appData
        });
        let isSend = false
        let playerIds
        if (options.playerIds == 'all') {
            playerIds = "all"
            isSend = true
        }
        else {
            playerIds = _.compact(_.uniq(options.playerIds));
            if (playerIds.length) isSend = true
        }
        console.log(isSend, playerIds)
        if (isSend) {
            let configObj = {
                contents: {
                    en: options.content,
                }
            };
            if (options.data) {
                configObj.data = options.data;
                configObj.headings = options.title
            }
            if (playerIds !== 'all') {//send to specific playerids
                configObj.include_player_ids = playerIds
            } else {//send to all device
                configObj.included_segments = ["All"]
            }

            myClient.createNotification(configObj)
                .then(response => {
                    console.log('response', response)
                    return true
                })
                .catch(e => {
                    console.log('error', e)
                    return e
                });
        }
    },

    async sendPushNotification(options) {
        try {
            console.log('options', options)
            const myClient = new OneSignal.Client({
                userAuthKey: process.env.EMAIL_AUTH_USERNAME,
                app: {
                    appAuthKey: process.env.PUSH_NOTIFICATION_AUTH_KEY,
                    appId: process.env.PUSH_NOTIFICATION_APP_ID
                }
            });
            console.log('myClient', myClient)
            let isSend = false
            let playerIds
            if (options.playerIds == 'all') {
                playerIds = "all"
                isSend = true
            }
            else {
                playerIds = _.compact(_.uniq(options.playerIds));
                if (playerIds.length) isSend = true
            }
            console.log(isSend, playerIds)
            if (isSend) {
                let configObj = {
                    contents: {
                        en: options.content,
                    }
                };
                if (options.data) {
                    configObj.data = options.data;
                    configObj.headings = options.title
                }
                if (playerIds !== 'all') {//send to specific playerids
                    configObj.include_player_ids = playerIds
                } else {//send to all device
                    configObj.included_segments = ["All"]
                }
                console.log('configObj', configObj)
                let notification = new OneSignal.Notification(configObj);

                myClient.sendNotification(notification, function (err, httpResponse, data) {
                    console.log("data", data);
                    if (err) {
                        console.log("push notification error :- ", err);
                    }
                });
            }
            return true

        } catch (error) {
            console.log('error', error)
        }

    },

};

