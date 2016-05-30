Meteor.startup(() => {
    // code to run on server at startup
    var numOfUsers = Meteor.users.find().count();
    if (numOfUsers == 0) {

        Accounts.createUser({
            username: "admin",
            password: "test1234!",
            email: "adminuser@hisdragonrun.org"
        });

    }



    var adminUser = Meteor.users.findOne({
        username: 'admin'
    });

    if (Meteor.users.findOne(adminUser._id)) {
        Roles.addUsersToRoles(adminUser._id, ['admin']);

    }

    if (!Meteor.roles.findOne({
            name: "race-runner"
        }))
        Roles.createRole("race-runner");

    if (!Meteor.roles.findOne({
            name: "staff"
        }))
        Roles.createRole("staff");

    if (!Meteor.roles.findOne({
            name: "wechat"
        }))
        Roles.createRole("wechat");


});


Meteor.publish('runners', (publishLimit, options) => {
    if (this.userId) {
        var currentUser = Meteor.users.findOne({
            _id: this.userId
        });
        if (Roles.userIsInRole(this.userId, ['staff', 'admin'])) {
            return Runners.find({
                year: 2016
            }, options);
        } else {
            return Runners.find({
                year: 2016,
                registrationEmail: currentUser.emails[0].address
            }, options);


        }
    }
    return null;
});

Meteor.publish('systemVariables', () => {

    return systemVariables.find();

});

Meteor.publish('payments', () => {
    if (this.userId) {
        var currentUser = Meteor.users.findOne({
            _id: this.userId
        });
        if (Roles.userIsInRole(this.userId, ['staff', 'admin'])) {
            return Payments.find();
        }

    }
    return null;


});

Meteor.publish('users', () => {
    if (this.userId) {
        var currentUser = Meteor.users.findOne({
            _id: this.userId
        });
        if (Roles.userIsInRole(this.userId, ['staff', 'admin', 'wechat'])) {
            return Meteor.users.find();
        }

    }
    return null;


});


Meteor.publish('racerunners', () => {

    return RaceRunners.find();

});



Meteor.methods({

    sendEmail: (to, from, subject, text) => {
        check([to, from, subject, text], [String]);

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            this.unblock();

            Email.send({
                to: to,
                from: from,
                subject: subject,
                text: text
            });

        }


    },


    startRace: () => {
        this.unblock();
        var startTimeObject = {
            name: "raceStartTime",
            value: new Date().getTime()
        };
        var raceHasStartedObject = {
            name: "raceHasStarted",
            value: true
        };
        systemVariables.update({
            name: "raceStartTime"
        }, {
            $set: startTimeObject
        });
        systemVariables.update({
            name: "raceHasStarted"
        }, {
            $set: raceHasStartedObject
        });

    },
    stopRace: () => {
        this.unblock();
        var startTimeObject = {
            name: "raceStartTime",
            value: new Date()
        };
        var raceHasStoppedObject = {
            name: "raceHasStarted",
            value: false
        };
        systemVariables.update({
            name: "raceHasStarted"
        }, {
            $set: raceHasStoppedObject
        });






    },
    sendVerifyEmail: (userId) => {
        this.unblock();

        var email = Meteor.users.findOne({
            _id: userId
        });

        Accounts.sendVerificationEmail(email._id, email.emails[0].address);
        return "Email sent!";


    },
    download: () => {
        if (Roles.userIsInRole(this.userId, ['admin', 'staff'])) {
            var collection = Runners.find().fetch();

            var heading = false; // Optional, defaults to true
            var delimiter = ";" // Optional, defaults to ",";
            var result = exportcsv.exportToCSV(collection, heading, delimiter);
            //console.log(result);
            return result;
        } else {
            return "Not authorized"
        }
    }
});

Runners.allow({
    update: () => {

        return Meteor.user();

    },
    remove: () => {

        return Meteor.user();

    },
    insert: () => {

        return Meteor.user();

    }
});

Runners.deny({
    update: (userId, post, fieldNames) => {
        // may only edit the following two fields:
        if (_.contains(fieldNames, 'runnerHasPaid')) {

            if (Roles.userIsInRole(userId, ['staff', 'admin'])) {
                console.log('isAdmin');
                return false;

            } else {
                return true;
            }
        } else {
            return false
        }

    }

});

Payments.allow({
    update: (userId, doc, fieldNames, modifier) => {

        return Roles.userIsInRole(userId, ['staff', 'admin']);

    },
    remove: (userId, doc) => {

        return Roles.userIsInRole(userId, ['staff', 'admin']);

    },
    insert: (userId, doc) => {

        return Roles.userIsInRole(userId, ['staff', 'admin']);

    }



});

RaceRunners.allow({
    update: (userId, doc, fieldNames, modifier) => {

        return Roles.userIsInRole(userId, ['staff', 'admin']);

    },
    remove: (userId, doc) => {

        return Roles.userIsInRole(userId, ['staff', 'admin']);

    },
    insert: (userId, doc) => {

        return Roles.userIsInRole(userId, ['staff', 'admin']);

    }


});

systemVariables.allow({
    update: () => {

        return true;

    },
    remove: () => {

        return true;

    },
    insert: () => {

        return true;

    }

});


Accounts.onCreateUser((options, user) => {
    user.roles = ['race-runner'];
    return user;
});



Accounts.emailTemplates.siteName = "HIS Dragon Run Registration";
Accounts.emailTemplates.from = "HIS Dragon Run Registration Robot <registration-robot@hisdragonrun.org>";

Accounts.emailTemplates.resetPassword = {
    subject: (user) => {
        return "Reset your password on http://register.hisdragonrun.org";
    },
    text: (user, url) => {
        return "Hello! Click the link below to reset your Dragon Run registration password. \n" + url + " If you didn't request this email, please ignore it. Do not reply to this email - it was sent by a robot! \n \n  "
    },
    html: (user, url) => {
        // This is where HTML email content would go.
        // See the section about html emails below.
    }
};

Accounts.emailTemplates.verifyEmail = {
    subject: (user) => {
        return "Verify Account for " + user.emails[0].address;
    },
    text: (user, url) => {
        return "Hello! Click the link below to verify your new account for the HIS Charity Dragon Run Website.\n大家好！点击下面的链接，为5公里赛跑验证您的新帐户。\n" + url + " \n If you didn't request this email, please ignore it. \n 如果您不想参与，请忽略这份邮件。\n  Do not reply to this email - it was sent by a robot! \n 请不要直接回复邮件，这是系统自动发送的。"

    },
    html: (user, url) => {
        // This is where HTML email content would go.
        // See the section about html emails below.
    }
};
