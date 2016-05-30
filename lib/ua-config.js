var mySubmitFunc = (error, state)=> {
    if (!error) {
        if (state === "signIn") {
            if (Meteor.user()) {
                Router.go('/portal/');
            } else {
                Router.go('/')
            }
        }
        if (state === "signUp") {
            Router.go('/sent-verification');
        }
    }
};

Accounts.config({
    sendVerificationEmail: true
});

AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: false,
    sendVerificationEmail: true,
    lowercaseUsername: false,
    enforceEmailVerification: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    //showResendVerificationEmailLink:true,
    showLabels: true,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',

    // Redirects
    homeRoutePath: '/portal/',
    redirectTimeout: 4000,

    // Hooks
    //onLogoutHook: myLogoutFunc,
    onSubmitHook: mySubmitFunc,


    // Texts
    texts: {
        button: {
            signUp: "Create/注册",
            signIn: "Sign In/登陆"

        },

        socialSignUp: "Create an account",

        title: {
            forgotPwd: "Recover Your Password",
            signUp: "Please create an account to register for this year's HIS Charity Run/请为参加今年的HIS慈善助跑创建一个账户以便注册:",
            signIn: "Please sign in to continue/请登陆",
        },
        signInLink_link: "signin",
    },
    defaultLayout: "main"
});


AccountsTemplates.configureRoute('signIn', {
    name: 'signIn',
    path: '/sign-in',
    template: 'signInAccount',
    redirect: '/portal/'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'signUp',
    template: 'registerAccount',
    path: '/sign-up',
    redirect: '/sent-verification/'
});

AccountsTemplates.configureRoute('forgotPwd', {
    name: 'forgotPwd',
    template: 'forgotPwd',
    path: '/forgot-password',
    redirect: '/sign-in'
});



AccountsTemplates.configureRoute('changePwd');

AccountsTemplates.configureRoute('resetPwd');
