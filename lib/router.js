Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'loading'
});
Router.onBeforeAction('loading');

Router.onBeforeAction(requireLogin, {
    except: ['registrationNotReady', , 'frontPage', 'aboutPage', 'registerAccount', 'privacy', 'terms-of-use', 'signIn', 'atForgotPwd', 'forgotPwd', 'resetPwd', 'raceResults', 'signInAccount', 'verificationSent']
});


Router.onBeforeAction(requireStaff, {
    only: ['runnerRegistrationSummary', 'officialRaceTime', 'stoppedRunnersByNumber', 'stoppedRunnersAdultMale', 'stoppedRunnersAdultFemale', 'stoppedRunnersHSMale', 'stoppedRunnersHSFemale', 'stoppedRunnersMSMale', 'stoppedRunnersMSFemale', 'stoppedRunnersLSMale', 'stoppedRunnersLSFemale', 'payment', 'paymentConfirmationFrontPage', 'adminTemplate', 'registrationList']
});


Router.map(() => {
    this.route('signInAccount', {
        path: '/'
    });
    //this.route('registerAccount',{path:'/sign-up'})
    this.route('registrationForm', {
        path: '/registration/'
    });
    //this.route('forgot-password',{path:'/forgot/'})
    this.route('userPortal', {
        path: '/portal/',
        waitOn: () => {
            return Meteor.subscribe('runners', {
                runnerRegistrationCode: this.params.code
            }, {})
        }
    })

    this.route('verificationSent', {
        path: '/sent-verification/'
    })

    this.route('registrationNotReady', {
        path: '/registrationNotReady/'
    });
    this.route('adminTemplate', {
        path: '/admin/'
    });
    this.route('paymentRecordWeChat', {
        path: '/payment/wechat/'
    });

    this.route('registrationEdit', {
        path: '/registration/edit/:_id/',
        data: () => {
            return Runners.findOne({
                _id: this.params._id
            });
        },
        waitOn: () => {

            return Meteor.subscribe('runners', {
                runnerEmail: Meteor.user().emails[0].address
            }, {});
        }

    });
    this.route('registrationList', {
        path: '/registration/list/',
        data: () => {
            return Runners.find()
        },
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        }
    });
    this.route('registrationListDeleteEnabled', {
        path: '/registrationListDeleteEnabled/',
        data: () => {
            return Runners.find()
        },
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        }
    });
    this.route('paymentConfirmationFrontPage', {
        path: '/payment/',
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        }
    });

    this.route('paymentConfirmationRunner', {
        path: '/paymentConfirmation/:id/',
        data: () => {
            return Runners.findOne({
                _id: this.params.id
            })
        },
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        }
    });
    this.route('unpaidRunnerEmailList', {
        path: '/unpaidRunnerEmailList/',
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        }
    });
    this.route('runnerRegistrationSummary', {
        path: '/registrationSummary/',
        data: () => {
            return Runners.find()
        },
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        }
    });
    this.route('raceConfiguration', {
        path: '/raceCOnfiguration/',
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        }
    });
    this.route('allActiveRunners', {
        path: '/allActiveRunners/',
        data: () => {
            return RaceRunners.find()
        }
    });
    this.route('stoppedRunners', {
        path: '/stoppedRunners/',
        data: () => {
            return RaceRunners.find()
        }
    });


    this.route('officialRaceTime', {
        path: '/officialRaceTime/'
    });

    this.route('missionControl', {
        path: '/missionControl/',
        data: () => {
            return RaceRunners.find()
        }
    });


    this.route('registrationSorted5K', {
        path: '/registration5ksort/number/',
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        },
        data: () => {
            return Runners.find()
        }
    });
    this.route('registrationSorted1K', {
        path: '/registration1ksort/number/',
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        },
        data: () => {
            return Runners.find()
        }
    });
    this.route('emergencyContactList', {
        path: '/emergency/',
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        }
    });

    this.route('privacy', {
        path: '/privacy'
    });
    this.route('raceResults', {
        path: '/results/'
    });
    this.route('termsOfUse', {
        path: '/terms-of-use'
    });
    this.route('event-configuration', {
        path: '/admin/event'
    });
    this.route('pickupPage', {
        path: '/registration/pickup/',
        waitOn: () => {
            return Meteor.subscribe('runners', {}, {})
        }
    });




});



var requireLogin = () => {
    if (!Meteor.user()) {

        Session.set('currentURL', Router.current().path);
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            Router.go('/sign-up')
        };



    }
    this.next();
}



var requireStaff = () => {

    var currentUser = Meteor.user();
    if (!currentUser) {

        Session.set('currentURL', Router.current().path);
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        }

    } else {

        var allowed = Roles.userIsInRole(Meteor.user(), ['staff', 'admin']);

        if (!allowed) {
            alert("You are not permitted to access that page.")
            Router.go('/portal/');
        }

        this.next()

    };





}
