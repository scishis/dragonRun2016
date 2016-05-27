Template.header.events({
    'click #sign-out': function(e) {
        Meteor.logout();
    }
});
