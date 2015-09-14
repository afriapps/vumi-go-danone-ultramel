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
            it("should ask for name and surname", function() {  
                return tester
                    .start()
                    .input('Herman Stander')
                    .check.interaction({
                        state:"states:start",
                        reply: "Please enter your name and surname",
                    })
                    .run();
            });
            it("should ask for ID number", function() {                
                return tester
                    .setup.user.state('states:id')
                    .input('8506045237086')
                    .check.interaction({
                        state:"states:id",
                        reply: 'Please enter your ID number',
                    })
                    .run();
            });
            it("should ask for residing city", function() {                
                return tester
                    .setup.user.state('states:city')
                    .check.interaction({
                        state:"states:city",
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
                            "9. Easter Cape",
                        ].join("\n")
                    })
                    .run();
            });
            it("should enter the draw", function () {
                return tester
                    .setup.user.state('states:enter_draw')
                    .check.interaction({
                        state:"states:enter_draw",
                        reply: [
                            "Answer the below question correctly and stand a chance to win 4 tickets to the Ultra Mel Big big Lunch event on 25 October 2015.", 
                            "1. Show me the quesiton"
                        ].join("\n")
                    })
                    .run();
            });
            it("should show random question", function() {
                return tester
                    .setup.user.state('states:enter_draw')
                    .input('1')
                    .check.interaction({
                        state:"states:random_question_1",
                        reply: [
                            "Choose option 1, 2 or 3. How much milk does the Ultra Mel special recipe contain?", 
                            "1. 30%",   // wrong
                            "2. 65%",   // wrong
                            "3. 80%"    // correct
                        ].join("\n")
                    })
                    .run();
            });
            describe("when user answers quesiton correctly", function () {
                it("should send data to server", function () {
                    return tester
                        .setup.user.state('states:random_question_1')
                        .input('1')
                        .check.interaction({
                            state: "states:send_data",
                        });
                });
                describe("when user wins", function () {
                    it("should congratulate user and show menu to conitnue", function () {
                        return tester
                            .setup.user.state("states:send_data")
                            .check.interaction({
                                state: "states:win",
                                reply: "Congratulations. You have won 4 tickets to SA's Biggest Lunch event on  25 October 2015 in Johannesburg."
                            });
                    });
                    it("should ask which event will be attended", function() {                
                        return tester
                            .setup.user.state('states:event')
                            .check.interaction({
                                state:"states:event",
                                reply: [
                                    'Which Ultra Mel Biggest Sunday Lunch event would you like to attend?',
                                    "1. Johannesburg",
                                    "2. Durban",
                                    "3. Cape Town",
                                ].join("\n")
                            })
                            .run();
                    });

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
                                ].join("\n")
                            })
                            .run();
                    });
                    it("should thank user and end session", function() {
                        return tester
                            .setup.user.state('states:meal_preference')
                            .input('1')
                            .check.interaction({
                                state: 'states:end',
                                reply: 'Thanks for entering. We are looking forward to hosting you at SA\'s Biggest Lunch event on 25 October 2015. For more information visit www.ultramelsundays.co.za'
                            })
                            .check.reply.ends_session()
                            .run();
                    }); 
                });
                describe("when user loose", function () {
                   it("should tell user and end session", function () {
                        return tester
                            .setup.user.state('states:end_dont_win')
                            .check.interaction({
                                state: "states:end_wrong",
                                reply: "Thank you for entering South Africas Biggest Lunch Competition . Unfortunately you are not a winner. Better luck next time."
                            });
                    }); 
                });
            });
            describe("when user answers quesiton incorrectly", function () {
                it("should thank the user and end the session", function () {
                    return tester
                        .setup.user.state('states:random_question_1')
                        .input('1')
                        .check.interaction({
                            state: "states:end_wrong",
                            reply: "Incorrect answer. Sorry, you are not a winner. To stand a chance to win visit the Ultra Mel Sundays Facebook page or go to www.ultramelsundays.co.za"
                        });
                });
            });
        });
    });
});
