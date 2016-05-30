Template.header.events({
    'click #sign-out': e => {
        Meteor.logout();
    }
});
