/**
 * @module card-save
 * @description almacena la informacion de un auto
 * @author fredy.alvarino <fredy.alvarino@gmail.com>
 * @version 1.0.0
 * @since 2021-09-19
 * @lastModified 2021-09-19
 * @example
> Request
```zsh
curl --location --request POST 'https://raubakwg85.execute-api.us-east-1.amazonaws.com/qa/car-save' \
--header 'Content-Type: application/json' \
--data '{
    "autoID": uuid(),
    "modelo": "2021",
    "color": "Rojo",
    "fechaIngreso": new Date().toJSON(),
    "estado": "ACTIVO",
    "asignado": "Nombre de conductor"
}'
```
> Response
```json
{"httpStatus":200,"status":true}
```
 * 
*/

const pckg = require('./package.json');
const ajv = new (require('ajv'))();
const uuid = require("uuid").v4;
const { format } = require("util");

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const ddb = new AWS.DynamoDB.DocumentClient();
const putDB = async (p) => { return new Promise((d, f) => { ddb.put(p, (e, b) => { !!e ? f(e) : d(b) }) }) };
const updateDB = async (p) => { return new Promise((d, f) => { ddb.update(p, (e, b) => { !!e ? f(e) : d(b) }) }) };

const { log } = console;
const CTE = {
    TABLE_NAME: 'myTable'
    , INPUT_SCHEME: {
        "type": "object",
        "required": [],
        "properties": {
            "autoID": { "type": "string", "minLength": 0 }
            , "modelo": { "type": "string", "minLength": 1, "pattern": "^[0-9]{4}$" }
            , "color": { "type": "string", "minLength": 1 }
            , "fechaIngreso": { "type": "string", "minLength": 1, "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$" }
            , "estado": { "type": "string", "minLength": 1 }
            , "asignado": { "type": "string", "minLength": 1 }
        }
    }
};
const validateRQ = ajv.compile(CTE.INPUT_SCHEME);
log('Loading Function', [pckg.name, pckg.version]);

exports.handler = async (event) => {
    try {
        log('evento de entrada %j', event);
        if (!validateRQ(event)) {
            log('Error on validation input: %j', validateRQ.errors);
            throw validateRQ.errors;
        }
        await saveData(event);
        let resp = {};
        res = { httpStatus: 200, status: res };
        if (!!event.returnData && event.returnData === true) {
            res.data = resp;
        }
        return Promise.resolve(res);
    } catch (error) {
        return Promise.resolve({
            statusCode: 403
            , statusDescription: 'Forbidden'
            , body: { httpStatus: 403, errors: error }
        });
    }
};

/**
 * Save data into table (save or update info)
 * @param {JSON} event original event to save
 */
async function saveData(event) {
    if (!!event && !!event.autoID) {
        // Se debe actualizar la información del auto
        let updateStr = {
            TableName: CTE.TABLE_NAME
            , Key: { keystr: event.autoID, sortstr: '#' }
            , ConditionExpression: '#typeData IN (:type)'
            , ExpressionAttributeNames: { "#typeData": 'typeData' }
            , ExpressionAttributeValues: { ":type": 'auto' }
        };
        let expressionData = [];
        buildUpdateExpression(event, updateStr, expressionData, "modelo");
        buildUpdateExpression(event, updateStr, expressionData, "color");
        buildUpdateExpression(event, updateStr, expressionData, "fechaIngreso");
        buildUpdateExpression(event, updateStr, expressionData, "estado");
        buildUpdateExpression(event, updateStr, expressionData, "asignado");
        if (expressionData.length > 0) {
            event.fechaActualizacion = (new Date()).toJSON();
            buildUpdateExpression(event, updateStr, expressionData, "fechaActualizacion");
            updateStr.UpdateExpression = 'SET ' + expressionData.join(',');
            await updateDB(updateStr);
        }
    } else {
        // Es un nuevo auto para almacenar
        let data = { TableName: CTE.TABLE_NAME, Item: event };
        data.Item.typeData = 'auto';
        data.Item.keystr = uuid();
        data.Item.sortstr = '#';
        console.log('put %j', data);
        await putDB(data);
    }
}

/**
 * Build update expression into containers data
 * @param {JSON} event Original event
 * @param {JSON} content container
 * @param {Array} data array to expression set
 * @param {String} attr name of attribute
 */
function buildUpdateExpression(event, content, data, attr) {
    if (!!event[attr]) {
        content.ExpressionAttributeNames[format("#%s", attr)] = attr;
        content.ExpressionAttributeValues[format(":%s", attr)] = event[attr];
        data.push(format("#%s = :%s", attr, attr));
    }
}
