'use strict'

const qs = require('querystring');

const receiver = (methods, request, response) => {
    console.log(methods);

    if (request.method === 'GET') {
        if (!methods[2] || methods[2][0] !== ':') console.log('err');

        let userInfo = getUserInfo(methods[2].slice(1));

        // TODO : task #24.1

    } else if (request.method === 'POST') {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk.toString();
        });

        request.on('end', () => {
            if (methods[2] === 'signin')
                require('auth/login').signin(response, qs.parse(data));
            else if (methods[2] === 'signup')
                require('auth/registration').signup(response, qs.parse(data));
        });
    } else if (request.method === 'PUT') {
        // TODO : task #24.4
    } else if (request.method === 'DELETE') {
        // TODI : task #24.5 (дополнить)
        db.users.findOne(login)
            .exec()
            .then(async (doc) => {
                if (!doc) {
                    response.writeHead(204, {
                        'Content-Type': 'text/html'
                    });

                    response.end('User doesn\'t exist')
                } else {
                    await doc.remove();

                    response.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    response.end(`DELETE user ${login}`);
                }
            });
    } else {
        // error
        source.send404(response);
    }

}

const getUserInfo = (login) => {
    // TODO : task #24.1
};

module.exports.handler = receiver;
