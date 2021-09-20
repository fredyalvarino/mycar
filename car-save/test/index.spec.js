const proc = require('../index.js').handler;
const rewire = require('rewire');
const uuid = require("uuid").v4;

const fn_ = async () => { return Promise.resolve() };
const fn_0 = (p, c) => { c(null, {}) };
const fn_1 = (p, c) => { c('null', {}) };

function runTest(handler, eventNameFile, eventObject, functionName = "jasmine-test") {
    if (!handler || (!eventNameFile && !eventObject)) {
        throw new Error('Error en parametros');
    }
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await handler((eventObject || require(eventNameFile))
                , { "functionName": functionName, succeed: resolve, fail: reject }
                , (error, data) => { if (!!error) reject(error); else resolve(data); }));
        } catch (e) {
            reject(e);
        }
    });
}

describe('Unit test', () => {
    let originalTimeout;

    beforeEach(() => {
        originalTimeout = jasmine.getEnv().defaultTimeoutInterval;
        jasmine.getEnv().defaultTimeoutInterval = 15000;
    });

    afterEach(() => {
        jasmine.getEnv().defaultTimeoutInterval = originalTimeout;
    });

    it('Create car', async (done) => {
        try {
            let payload = {
                // "autoID": uuid(),
                "modelo": "2021",
                "color": "Rojo",
                "fechaIngreso": new Date().toJSON(),
                "estado": "ACTIVO",
                "asignado": "Fredy Alvarino"
            };
            let proc_r = rewire("../index.js");
            let response;
            await proc_r.__with__({})(async () => {
                response = await runTest(proc_r.handler, null, payload);
            });

            console.log('Response Basic test: %j', response);
            expect(response).toBeDefined();
        } catch (error) {
            console.error('Error on Basic test', error);
            expect(error).not.toBeDefined();
        } finally {
            done();
        }
    });

});
