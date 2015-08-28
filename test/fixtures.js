// we make the fixtures function that simply returns the fixtures. This ensures
// we have a deep copy of all the fixtures.
module.exports = function() {
    return [
        {
        "request": {
            "method": "POST",
            "url": "http://afriapps.co.za/ussd/1/",
            // "data": {
            //     "addr": "+27724217253",
            //     "states:id": "8506045237086",
            //     "states:name": "Herman Stander",
            //     "states:resident_city": "Pretoria",
            //     "states:meal_preference": "Any",
            //     "states:choose_event": "Johannesburg",
            //     "correct_answer": "True"
            // }
            "data": {
                "name":"Herman Stander",
                "id":"8506045237086",
                "city":"Pretoria"
            } 
        },
        "response": {
            "code": 200,
            "data": {
                "form": {},
                "headers": {
                    "Accept-Encoding": "gzip, deflate",
                    "Cookie": "",
                    "Content-Length": "26",
                    "Host": "httpbin.org",
                    "Connection": "close",
                    "Content-Type": "application/json",
                    "X-Request-Id": "4cd50631-7b53-4687-8f5f-df24cfd6ff84"
                },
                "files": {},
                "origin": "192.168.0.23",
                "url": "http://localhost:8000/ussd/1/",
                "data": "{\"win\":\"true\"}",
                "args": {},
                "json": {
                    "win": "true"
                }
            }
        }
    },
    ];
};
