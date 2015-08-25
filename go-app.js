var go = {};
go;

go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;


    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var FreeText = vumigo.states.FreeText;
    var EndState = vumigo.states.EndState;

    var JsonApi = vumigo.http.api.JsonApi;


    var HttpApp = App.extend(function(self) {
        App.call(self, 'states:start');
        self.init = function() {
            self.http = new JsonApi(self.im);
            self.api = 'http://4319e457.ngrok.com/ussd/1/';
        };

        self.states.add('states:start', function(name) {
            return new ChoiceState(name,{
                question:"Hi and welcome to the Danone Ultramel Ultra Sunday Lunch!",
                choices: [
                    new Choice("states:name", "Continue"),
                    new Choice("states:end", "Exit"),
                ],
                next: function(choice) {
                    return self
                        .http.post(self.api, {
                            data: {message:choice.value}
                        })
                        .then(function(resp) {
                            return {
                                name: 'states:name',
                                // creator_opts: {
                                //     method: 'post',
                                //     echo: resp
                                // }
                            };
                        });
                }
            });
        });
        self.states.add('states:name', function(name) {
            return new FreeText(name,{
                question:"Please enter your first and last name",
                next:"states:id"
            });
        });
        self.states.add('states:id', function(name) {
            return new FreeText(name,{
                question:"Please enter your ID number",
                next:"states:choose_event"
            });
        });
        // Need to check ID number on Database, if use is not there, continue, else Display he is allready entered.
        self.states.add('states:choose_event', function(name) {
            return new ChoiceState(name, {
                question: "Which Ultramel Big big lunch event would you like to attend?",
                choices: [
                    new Choice("states:resident_city", "Johannesburg"),
                    new Choice("states:resident_city", "Durban"),
                    new Choice("states:resident_city:", "Cape Town"),
                    new Choice("states:exit", "Exit"),
                ],
                next: function(choice) {
                    return choice.value;
                },

            });
        });

        self.states.add('states:resident_city', function(name) {
            return new FreeText(name,{
                question:"In which city do you reside?",
                next:"states:meal_preference"
            });
        });

        self.states.add('states:meal_preference', function(name) {
            return new ChoiceState(name, {
                question: "What is your meal preference?",

                choices: [
                    new Choice("states:enter_draw", "Any"),
                    new Choice("states:enter_draw", "Halaal"),
                    new Choice("states:enter_draw:", "Kosher"),
                    new Choice("states:enter_draw:", "Vegetarian"),
                    new Choice("states:exit", "Exit"),
                ],
                next: function(choice) {
                    return choice.value;
                }
            });
        });

        self.states.add('states:enter_draw', function(name) {
            random_choice = Math.floor(Math.random() * 3) + 1;
            return new ChoiceState(name, {
                question: "Answer the next question correctly and stand a chance to win 4 tickets to the Ultra Mel Big big Lunch event on 27 September 2015",

                choices: [
                    new Choice("states:random_question_" + random_choice, "Show me the quesiton"),
                ],
                next: function(choice) {
                    return choice.value;
                }
            });
        });

        self.states.add('states:random_question_1', function(name) {
            return new ChoiceState(name, {
                question: 'How much milk does the Ultra Mel special recipe contain?',
                choices: [
                    new Choice('states:end_wrong', '30%'),
                    new Choice('states:end_wrong', '65%'),
                    new Choice('states:end_correct', '80%')
                ],

                next: function(choice) {
                    return choice.value;
                }
            });
        });

        self.states.add('states:random_question_2', function(name) {
            return new ChoiceState(name, {
                question: 'Since when has Ultra Mel been bringing people together?',

                choices: [
                    new Choice('states:end_wrong', '1920\'s'),
                    new Choice('states:end_correct', '1970\'s'),
                    new Choice('states:end_wrong', '1990\'s')],

                next: function(choice) {
                    return choice.value;
                }
            });
        });

        self.states.add('states:random_question_3', function(name) {
            return new ChoiceState(name, {
                question: 'For how many years has Ultra Mel been a trusted brand?',

                choices: [
                    new Choice('states:end_wrong', '10 years'),
                    new Choice('states:end_wrong', '30 year'),
                    new Choice('states:end_correct', '40 years')],

                next: function(choice) {
                    return choice.value;
                }
            });
        });
        self.states.add('states:end_correct', function(name) {
            return new EndState(name, {
                text: 'Congratulations. You have won 4 tickets to the Big big Sunday Lunch event on 27 September in >>venue selected<<',
                next: "states:start"
                // next: function(choice) {
                //     return self
                //         .http.post(self.api, {
                //             data: {message: choice}
                //         })
                //         .then(function(resp) {
                //             return {
                //                 name: 'states:start',
                //                 creator_opts: {
                //                     method: 'post',
                //                     echo: resp.data.json.message
                //                 }
                //             };
                //         });
                // }
            });
        });

        self.states.add('states:end_wrong', function(name) {
            return new EndState(name, {
                text: 'Incorrect answer. Sorry, you are not a winner. To stand a chance to win visit (details to be defined)',
                next: 'states:start'
            });
        });
        self.states.add('states:end', function(name) {
            return new EndState(name, {
                text: 'Thank you for participating. Please try again later',
                next: 'states:start'
            });
        });

    });

    return {
        HttpApp: HttpApp
    };
}();

go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var HttpApp = go.app.HttpApp;


    return {
        im: new InteractionMachine(api, new HttpApp())
    };
}();
