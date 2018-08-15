'use strict'

const source = require('router/source');
const qs = require('querystring');

const Database = require('db');

const receiver = async (methods, request, response) => {
    console.log(methods);

    if (request.method === 'GET') {
        if (!methods[1]) {
            console.log('err');
            source.send404(response);
        }

        let dlg = await getDialog(methods[1]);

        if (dlg) {
            source.sendJSON(dlg, response);
        }

    } else if (request.method === 'POST') {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk.toString();
        });

        request.on('end', async () => {
            data = qs.parse(data);

            const db = await Database.get();

            await db.dialogs.addDialog(
                data.id,
                data.kind,
                new Date().toUTCString()
            );

            await db.destroy();
        });
    } else if (request.method === 'PUT') {

        if (!methods[1]) {
            console.log('err');
            source.send404(response);
        }

        const db = await Database.get();

        let dlg = await db.dialogs.findOne(methods[1]);

        let data = '';
        request.on('data', (chunk) => {
            data += chunk.toString();
        });

        request.on('end', async () => {
            data = qs.parse(data);

            data.on('text', (anotherText) =>{
                dlg.text = anotherText;
            });
        });

        await db.destroy();

        // TODO : Редактирование диалога
    } else if (request.method === 'DELETE') {

        if (!methods[1]) {
            console.log('err');
            source.send404(response);
        }

        const db = await Database.get();

        let dlg = await db.dialogs.findOne(methods[1]);

        await dlg.remove()

        await db.destroy();

    } else {
        source.send404(response);
    }

}

const getDialog = async (id) => {
    const db = await Database.get();

    await db.dialogs.addMember(id, 'lelkeklol');

    return db.dialogs.findOne(id)
        .exec()
        .then(async (doc) => {
            return doc;
        });
};

module.exports.receiver = receiver;
