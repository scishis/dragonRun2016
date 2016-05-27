Session.set("selectedRace", '');
Session.set("showSubmitButton", "false");
Session.set("runnerAdditionalDonation", "0");
Session.set("registrationComplete", 'false');
Session.set("currentPaymentRegistrationCode", '');
Session.set("selectedLanguage", 'EN');


Meteor.setInterval(function() {
    Session.set('time', new Date());
}, 10);
Meteor.subscribe("systemVariables");
Meteor.subscribe("racerunners");
Meteor.subscribe("runners", {}, {});
Meteor.subscribe("payments");
Meteor.subscribe("users");

Template.registerHelper('isAdminUser', function() {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
});
Template.registerHelper('isStaffUser', function() {
    return Roles.userIsInRole(Meteor.user(), ['staff', 'admin']);
});

Template.registerHelper('isWechatUser', function() {
    return Roles.userIsInRole(Meteor.user(), ['wechat', 'admin']);
});
Template.loginForm.events({
    'click #loginButton': function(e) {
        e.preventDefault();
        var username = $('#inputUsername').val();
        var password = $('#inputPassword').val();
        var previousPath = Session.get('currentURL');
        Meteor.loginWithPassword(username, password, function() {
            Router.go(previousPath);
        });
    }


});





Template.raceConfiguration.events({
    'click #raceStartButton': function(e) {
        e.preventDefault();
        if ($('#confirmStartRace').val() == '1') {
            Meteor.call('startRace');

        }
        else {
            alert('Confirm what you are doing!');
        }

    },
    'click #raceStopButton': function(e) {
        e.preventDefault();
        Meteor.call('stopRace');
    }
});




Template.raceConfiguration.helpers({
    raceIsStarted: function() {
        var raceStarted = systemVariables.findOne({
            name: "raceHasStarted"
        });
        if (!raceStarted) {
            return false;
        }
        return raceStarted.value;
    },
    raceTime: function() {
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
        }
        else {
            var secondString = seconds.toFixed(0).toString();
        }
        if (minutes < 9) {
            var minuteString = '0' + minutes.toString();
        }
        else {
            var minuteString = minutes.toString();
        }
        return {
            minutes: minuteString,
            seconds: secondString
        };
    },
    connectedToServer: function() {
        return Meteor.status().status;
    }


});


Template.officialRaceTime.helpers({
    raceTime: function() {

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
        }
        else {
            var secondString = seconds.toFixed(0).toString();
        }
        if (minutes < 9) {
            var minuteString = '0' + minutes.toString();
        }
        else {
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
    connection: function() {

        if (Meteor.status().status == 'connected') {
            return "green";
        }
        else {
            return "red";
        }

    }

});



function raceTime() {
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
    }
    else {
        var secondString = seconds.toFixed(0).toString();
    }
    if (minutes < 9) {
        var minuteString = '0' + minutes.toString()
    }
    else {
        var minuteString = minutes.toString();
    }
    return {
        minutes: minuteString,
        seconds: secondString
    };


}

function stopTimeString() {
    var elapsedTime = this.runnerStopTime;
    minutes = Math.floor(elapsedTime / 60000);
    seconds = Math.floor(((elapsedTime / 60000) - Math.floor(elapsedTime / 60000)) * 60)
    if (seconds <= 9) {
        var secondString = '0' + seconds.toFixed(0).toString()
    }
    else {
        var secondString = seconds.toFixed(0).toString();
    }
    if (minutes < 9) {
        var minuteString = '0' + minutes.toString()
    }
    else {
        var minuteString = minutes.toString();
    }
    return minuteString + ":" + secondString;



}
