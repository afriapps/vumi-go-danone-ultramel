var vumigo = require('vumigo_v02');
var HttpApp = HttpApp;
var AppTester = vumigo.AppTester;
var fixtures = require('./fixtures');

describe("app", function() {
    describe("HttpApp", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.HttpApp();
            tester = new AppTester(app);
            tester
                .setup.config.app({
                    name: 'test_app'
                })
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                });
        });

        describe("when the user starts a session", function() {
            it("should welcome them the user and ask them what they want to do", function() {  
                return tester
                    .start()
                    .check.interaction({
                        state:"states:start",
                        reply: [
                            'Welcome to South Africa’s Biggest Lunch event competition! In order to enter the competition, please follow the steps.',
                            "1. Continue",
                            "2. Exit",
                        ].join("\n"),
                    })
                    .run();
            });
            describe("when the user asks to exit", function() {
                it("should say thank you and end the session", function() {
                    return tester
                        .setup.user.state('states:start')
                        .input('2')
                        .check.interaction({
                            state: 'states:end',
                            reply: 'Thank you for participating. You may try again later.'
                        })
                        .check.reply.ends_session()
                        .run();
                });
            });
            describe("when the user asks conitnues", function () {
                it("should ask them for fullname", function() {                
                    return tester
                        .setup.user.state('states:start')
                        .input('1')
                        .check.interaction({
                            state:"states:name",
                            reply: 'Please enter your first and last name',
                        })
                        .run();
                });
                describe("when the user responds", function () {
                    it("should save their full name", function() {
                        return tester
                            .setup.user.state('states:name')
                            .input('Herman Stander')
                            .run();
                    });
                });
                describe("when the user saves name", function() {
                    it("should ask for ID number", function() {                
                        return tester
                            .setup.user.state('states:id')
                            .start()
                            .check.interaction({
                                state:"states:id",
                                reply: 'Please enter your ID number',
                            })
                            .run();
                    });
                    it("should save their ID number", function() {
                        return tester
                            .input('8506045237086')
                            .run();
                    });
                });
                describe("when ID is saved", function () {
                     it("should ask which event will be attended", function() {                
                        return tester
                            .setup.user.state('states:choose_event')
                            .check.interaction({
                                state:"states:choose_event",
                                reply: [
                                    'Which South Africa’s Biggest Lunch event would you like to attend?',
                                    "1. Johannesburg",
                                    "2. Durban",
                                    "3. Cape Town",
                                    "4. Exit",
                                ].join("\n")
                            })
                            .run();
                    });
                    it("should save the event", function() {
                        return tester
                            .input('1')
                            .run();
                    });
                });
                describe("when event saved", function () {
                    it("should ask which city reside", function () {
                        return tester
                            .setup.user.state('states:resident_city')
                            .check.interaction({
                                state:"states:resident_city",
                                reply: [
                                    "In which province do you reside?",
                                    "1. Gauteng",
                                    "2. Western Cape",
                                    "3. KwaZulu-Natal",
                                    "4. Free State",
                                    "5. Limpopo",
                                    "6. Mpumalanga",
                                    "7. Northern Cape",
                                    "8. North West",
                                    "9. More",
                                ].join("\n")
                            })
                            .run();
                    });
                    it("should save the city", function() {
                        return tester
                            .input('1')
                            .run();
                    });
                });
                describe("when city saved", function () {
                    it("should ask meal preference", function () {
                        return tester
                            .setup.user.state('states:meal_preference')
                            .check.interaction({
                                state:"states:meal_preference",
                                reply: [
                                    "What is your meal preference?",
                                    "1. Any",
                                    "2. Halaal",
                                    "3. Kosher",
                                    "4. Vegetarian",
                                    "5. Exit",
                                ].join("\n")
                            })
                            .run();
                    });
                    it("should save meal preference", function() {
                        return tester
                            .input('5')
                            .run();
                    });
                });
                describe("when meal preference saved", function () {
                    it("should show draw line", function () {
                        return tester
                            .setup.user.state('states:enter_draw')
                            .check.interaction({
                                state:"states:enter_draw",
                                reply: [
                                    "Answer the next question correctly and stand a chance to win 4 tickets to South Africa's Biggest Lunch on 25 October 2015", 
                                    "1. Show me the quesiton"
                                ].join("\n")
                            })
                            .run();
                    });
                    it("should choose to show question", function() {
                        return tester
                            .input('1')
                            .run();
                    });
                    it("should show random question", function() {
                        return tester
                            .setup.user.state('states:random_question_1')
                            .check.interaction({
                                state:"states:random_question_1",
                                reply: [
                                    "How much milk does the Ultra Mel special recipe contain?", 
                                    "1. 30%",
                                    "2. 65%",
                                    "3. 80%"
                                ].join("\n")
                            })
                            .run();
                    });
                });
                describe("when choose answer", function () {
                    describe("when answer is correct", function () {
                        it("should check server", function() {
                            return tester
                                .setup.user.state('states:random_question_1')
                                .input('3')
                                .check.interaction({
                                    state: 'states:end_win',
                                    reply: 'Congratulations. You have won 4 tickets to the Big big Sunday Lunch event on 27 September in >>venue selected<<'
                                })
                                .check.reply.ends_session()
                                .run();
                        });
                        describe("when winner", function () {
                           it("should congratulate and end session", function() {
                                return tester
                                    .setup.user.state('states:end_win')
                                    .input('3')
                                    .check.interaction({
                                        state: 'states:end_win',
                                        reply: 'Congratulations. You have won 4 tickets to the Big big Sunday Lunch event on 27 September in >>venue selected<<'
                                    })
                                    .check.reply.ends_session()
                                    .run();
                            }); 
                        });
                        // describe("when looser", function () {
                        //     it("should inform and end session", function() {
                        //         return tester
                        //             .setup.user.state('states:random_question_1')
                        //             .input('1')
                        //             .check.interaction({
                        //                 state: 'states:end_notwin',
                        //                 reply: 'Sorry, you are not a winner. Try again to stand a chance to win.'
                        //             })
                        //             .check.reply.ends_session()
                        //             .run();
                        //     }); 
                        // });
                    });
  
                    // describe("if answer is NOT correct", function () {
                    //     it("should inform user they have not won and end the session", function() {
                    //         return tester
                    //             .setup.user.state('states:random_question_1')
                    //             .input('1')
                    //             .check.interaction({
                    //                 state: 'states:end_wrong',
                    //                 reply: 'Incorrect answer. Sorry, you are not a winner. To stand a chance to win visit (details to be defined)'
                    //             })
                    //             .check.reply.ends_session()
                    //             .run();
                    //     });
                    // });
                });
            });
        });
    });
});
