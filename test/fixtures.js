// we make the fixtures function that simply returns the fixtures. This ensures
// we have a deep copy of all the fixtures.
module.exports = function() {
    return [
        {
        "request": {
            "method": "POST",
            "url": "http://4319e457.ngrok.com/ussd/1/",
            "data": {
                "name":null,"id":null,"choose_event":null,"resident_city":null,"meal_preference":null,"correct_answer":false
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
                "data": "{\"message\":\"hello world!\"}",
                "args": {},
                "json": {
                    "message": "hello world!"
                }
            }
        }
    },
    ];
};
