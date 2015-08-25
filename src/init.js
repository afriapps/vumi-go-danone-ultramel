go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var HttpApp = go.app.HttpApp;


    return {
        im: new InteractionMachine(api, new HttpApp())
    };
}();
