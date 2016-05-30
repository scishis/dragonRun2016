Session.set("selectedRace", '');
Session.set("showSubmitButton", "false");
Session.set("runnerAdditionalDonation", "0");
Session.set("registrationComplete", 'false');
Session.set("currentPaymentRegistrationCode", '');
Session.set("selectedLanguage", 'EN');


Meteor.setInterval(() => {
    Session.set('time', new Date());
}, 10);
Meteor.subscribe("systemVariables");
Meteor.subscribe("racerunners");
Meteor.subscribe("runners", {}, {});
Meteor.subscribe("payments");
Meteor.subscribe("users");

Template.registerHelper('isAdminUser', () => {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
});
Template.registerHelper('isStaffUser', () => {
    return Roles.userIsInRole(Meteor.user(), ['staff', 'admin']);
});

Template.registerHelper('isWechatUser', () => {
    return Roles.userIsInRole(Meteor.user(), ['wechat', 'admin']);
});
Template.loginForm.events({
    'click #loginButton': e => {
        e.preventDefault();
        var username = $('#inputUsername').val();
        var password = $('#inputPassword').val();
        var previousPath = Session.get('currentURL');
        Meteor.loginWithPassword(username, password, () => {
            Router.go(previousPath);
        });
    }


});





Template.raceConfiguration.events({
    'click #raceStartButton': e => {
        e.preventDefault();
        if ($('#confirmStartRace').val() == '1') {
            Meteor.call('startRace');

        } else {
            alert('Confirm what you are doing!');
        }

    },
    'click #raceStopButton': e => {
        e.preventDefault();
        Meteor.call('stopRace');
    }
});




Template.raceConfiguration.helpers({
    raceIsStarted: () => {
        var raceStarted = systemVariables.findOne({
            name: "raceHasStarted"
        });
        if (!raceStarted) {
            return false;
        }
        return raceStarted.value;
    },
    raceTime: () => {
        var currentTime = Session.get('time');
        var raceStartTime = systemVariables.findOne({
            name: "raceStartTime"
        });
        if (!raceStartTime) {
            return 'not found';
        }
        var elapsedTime = (currentTime - raceStartTime.value);
        minutes = Math.floor(elapsedTime / 60000);
        seconds = Math.floor(((elapsedTime / 60000) - Math.floor(elapsedTime / 60000)) * 60);
        if (seconds <= 9) {
            var secondString = '0' + seconds.toFixed(0).toString();
        } else {
            var secondString = seconds.toFixed(0).toString();
        }
        if (minutes < 9) {
            var minuteString = '0' + minutes.toString();
        } else {
            var minuteString = minutes.toString();
        }
        return {
            minutes: minuteString,
            seconds: secondString
        };
    },
    connectedToServer: () => {
        return Meteor.status().status;
    }


});


Template.officialRaceTime.helpers({
    raceTime: () => {

        var currentTime = Session.get('time');
        var raceStartTime = systemVariables.findOne({
            name: "raceStartTime"
        });
        if (!raceStartTime) {
            return 'not found';
        }
        var elapsedTime = (currentTime - raceStartTime.value);
        minutes = Math.floor(elapsedTime / 60000);
        seconds = Math.floor(((elapsedTime / 60000) - Math.floor(elapsedTime / 60000)) * 60);
        if (seconds <= 9) {
            var secondString = '0' + seconds.toFixed(0).toString()
        } else {
            var secondString = seconds.toFixed(0).toString();
        }
        if (minutes < 9) {
            var minuteString = '0' + minutes.toString();
        } else {
            var minuteString = minutes.toString();
        }
        return {
            minutes: minuteString,
            seconds: secondString
        };


    }

});



Template.smallRaceTime.helpers({
    raceTime: raceTime,
    connection: () => {

        if (Meteor.status().status == 'connected') {
            return "green";
        } else {
            return "red";
        }

    }

});



var raceTime = () => {
    var clientTime = parseInt(Session.get('time'));
    var raceStartTime = systemVariables.findOne({
        name: "raceStartTime"
    });
    var currentServerTime = raceStartTime;
    if (!raceStartTime) {
        return 'not found'
    }
    var elapsedTime = (currentServerTime - raceStartTime.value);
    minutes = Math.floor(elapsedTime / 60000);
    seconds = Math.floor(((elapsedTime / 60000) - Math.floor(elapsedTime / 60000)) * 60)
    if (seconds <= 9) {
        var secondString = '0' + seconds.toFixed(0).toString()
    } else {
        var secondString = seconds.toFixed(0).toString();
    }
    if (minutes < 9) {
        var minuteString = '0' + minutes.toString()
    } else {
        var minuteString = minutes.toString();
    }
    return {
        minutes: minuteString,
        seconds: secondString
    };


}

var stopTimeString = () => {
    var elapsedTime = this.runnerStopTime;
    minutes = Math.floor(elapsedTime / 60000);
    seconds = Math.floor(((elapsedTime / 60000) - Math.floor(elapsedTime / 60000)) * 60)
    if (seconds <= 9) {
        var secondString = '0' + seconds.toFixed(0).toString()
    } else {
        var secondString = seconds.toFixed(0).toString();
    }
    if (minutes < 9) {
        var minuteString = '0' + minutes.toString()
    } else {
        var minuteString = minutes.toString();
    }
    return minuteString + ":" + secondString;



}
