var go = {};
go;

go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;


    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var PaginatedChoiceState = vumigo.states.PaginatedChoiceState;
    var FreeText = vumigo.states.FreeText;
    var EndState = vumigo.states.EndState;

    var JsonApi = vumigo.http.api.JsonApi;
    var HttpApp = App.extend(function(self) {
    
        App.call(self, 'states:start');
        
        self.init = function() {
            self.http = new JsonApi(self.im);
            self.api = 'http://afriapps.co.za/ussd/1/';
        };

        self.states.add('states:start', function(name) {
            return new ChoiceState(name,{
                question:"Welcome to South Africa’s Biggest Lunch event competition! In order to enter the competition, please follow the steps.",
                choices: [
                    new Choice("states:name", "Continue"),
                    new Choice("states:end", "Exit"),
                ],
                next: function(choice) {
                    return choice.value;
                },
            });
        });
        self.states.add('states:name', function(name) {
            return new FreeText(name,{
                question:"Please enter your first and last name",
                next: function (content) {
                    return "states:id";
                }
            });
        });
        self.states.add('states:id', function(name) {
            return new FreeText(name,{
                question:"Please enter your ID number",
                next: function (content) {
                    return 'states:choose_event';
                    
                }
            });
        });
        self.states.add('states:choose_event', function(name) {
            return new ChoiceState(name, {
                question: "Which South Africa’s Biggest Lunch event would you like to attend?",
                choices: [
                    new Choice("states:resident_city", "Johannesburg"),
                    new Choice("states:resident_city", "Durban"),
                    new Choice("states:resident_city", "Cape Town"),
                    new Choice("states:end", "Exit"),
                ],
                next: function(choice) {
                    self.im.user.set_answer("states:choose_event", choice.label);
                    return {
                        name: choice.value
                    };
                },

            });
        });

        self.states.add('states:resident_city', function(name) {
            return new PaginatedChoiceState(name, {
                question: "In which province do you reside?",
                choices: [
                    new Choice("states:meal_preference", "Gauteng"),
                    new Choice("states:meal_preference", "Western Cape"),
                    new Choice("states:meal_preference", "KwaZulu-Natal"),
                    new Choice("states:meal_preference", "Free State"),
                    new Choice("states:meal_preference", "Limpopo"),
                    new Choice("states:meal_preference", "Mpumalanga"),
                    new Choice("states:meal_preference", "Northern Cape"),
                    new Choice("states:meal_preference", "North West"),
                    new Choice("states:meal_preference", "Easter Cape")
                ],
                next: function(choice) {
                    self.im.user.set_answer("states:resident_city", choice.label);
                    return choice.value;
                },

            });
        });

        self.states.add('states:meal_preference', function(name) {
            return new ChoiceState(name, {
                question: "What is your meal preference?",

                choices: [
                    new Choice("states:enter_draw", "Any"),
                    new Choice("states:enter_draw", "Halaal"),
                    new Choice("states:enter_draw", "Kosher"),
                    new Choice("states:enter_draw", "Vegetarian"),
                    new Choice("states:end", "Exit"),
                ],
                next: function(choice) {
                    self.im.user.set_answer("states:meal_preference", choice.label);
                    return choice.value;
                }
            });
        });

        self.states.add('states:enter_draw', function(name) {

            random_choice = Math.floor(Math.random() * 3) + 1;
            return new ChoiceState(name, {
                question: "Answer the next question correctly and stand a chance to win 4 tickets to South Africa's Biggest Lunch on 25 October 2015",

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
                    new Choice('wrong', '30%'),
                    new Choice('wrong', '65%'),
                    new Choice('correct', '80%')
                ],

                next: function(choice) {
                    if (choice.value == "correct") {
                        self.im.user.answers.correct_answer=true;
                        self.im.user.answers.addr=self.im.user.addr;
                        
                    } else {
                        self.im.user.answers.correct_answer=false;
                        self.im.user.answers.addr=self.im.user.addr;
                    }
                    return self
                        .http.post(self.api, {
                            data: self.im.user.answers
                        })
                        .then(function(resp) {
                            if (JSON.parse(resp.body).win === "true") {
                                return {name: 'states:end_win'};
                            } else if (JSON.parse(resp.body).win === "false") {
                                return {name: 'states:end_notwin'};
                            } else if (JSON.parse(resp.body).win === "none") {
                                return {name: 'states:end_wrong'};
                            }
                        });

                }
            });
        });
    
        self.states.add('states:random_question_2', function(name) {
            return new ChoiceState(name, {
                question: 'Since when has Ultra Mel been bringing people together?',

                choices: [
                    new Choice('wrong', '1920\'s'),
                    new Choice('correct', '1970\'s'),
                    new Choice('wrong', '1990\'s')],

                next: function(choice) {
                    if (choice.value == "correct") {
                        self.im.user.answers.correct_answer=true;
                        self.im.user.answers.addr=self.im.user.addr;
                        
                    } else {
                        self.im.user.answers.correct_answer=false;
                        self.im.user.answers.addr=self.im.user.addr;
                    }
                    return self
                        .http.post(self.api, {
                            data: self.im.user.answers
                        })
                        .then(function(resp) {
                            if (JSON.parse(resp.body).win === "true") {
                                return {name: 'states:end_win'};
                            } else if (JSON.parse(resp.body).win === "false") {
                                return {name: 'states:end_notwin'};
                            } else if (JSON.parse(resp.body).win === "none") {
                                return {name: 'states:end_wrong'};
                            }
                        });

                }
            });
        });

        self.states.add('states:random_question_3', function(name) {
            return new ChoiceState(name, {
                question: 'For how many years has Ultra Mel been a trusted brand?',

                choices: [
                    new Choice('wrong', '10 years'),
                    new Choice('wrong', '30 years'),
                    new Choice('correct', '40 years')
                ],

                next: function(choice) {
                    if (choice.value == "correct") {
                        self.im.user.answers.correct_answer=true;
                        self.im.user.answers.addr=self.im.user.addr;
                        
                    } else {
                        self.im.user.answers.correct_answer=false;
                        self.im.user.answers.addr=self.im.user.addr;
                    }
                    return self
                        .http.post(self.api, {
                            data: self.im.user.answers
                        })
                        .then(function(resp) {
                            if (JSON.parse(resp.body).win === "true") {
                                return {name: 'states:end_win'};
                            } else if (JSON.parse(resp.body).win === "false") {
                                return {name: 'states:end_notwin'};
                            } else if (JSON.parse(resp.body).win === "none") {
                                return {name: 'states:end_wrong'};
                            }
                        });

                }
            });
        });


        self.states.add('states:end_win', function(name) {
            return new EndState(name, {
                text: 'Congratulations. You have won 4 tickets to South Africa\'s Biggest Lunch on 25 October 2015 in ' + self.im.user.get_answer("states:choose_event"),
                next: "states:start"
            });
        });
        self.states.add('states:end_notwin', function(name) {
            return new EndState(name, {
                text: 'Thank you for entering South Africa\'s Biggest Lunch Competition . Unfortunately you are not a winner. Better luck next time.',
                next: "states:start"
            });
        });
        self.states.add('states:end_wrong', function(name) {
            return new EndState(name, {
                text: 'Incorrect answer. Sorry, you are not a winner. To stand a chance to win visit (details to be defined)',
                next: "states:start"
            });
        });
        self.states.add('states:end', function(name) {
            return new EndState(name, {
                text: 'Thank you for participating. You may try again later.',
                next: 'states:start',
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
