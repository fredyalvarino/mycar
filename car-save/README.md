<a name="module_card-save"></a>

## card-save
almacena la informacion de un auto

**Lastmodified**: 2021-09-19  
**Since**: 2021-09-19  
**Version**: 1.0.0  
**Author**: fredy.alvarino <fredy.alvarino@gmail.com>  
**Example**  
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

* [card-save](#module_card-save)
    * [~saveData(event)](#module_card-save..saveData)
    * [~buildUpdateExpression(event, content, data, attr)](#module_card-save..buildUpdateExpression)

<a name="module_card-save..saveData"></a>

### card-save~saveData(event)
Save data into table (save or update info)

**Kind**: inner method of [<code>card-save</code>](#module_card-save)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>JSON</code> | original event to save |

<a name="module_card-save..buildUpdateExpression"></a>

### card-save~buildUpdateExpression(event, content, data, attr)
Build update expression into containers data

**Kind**: inner method of [<code>card-save</code>](#module_card-save)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>JSON</code> | Original event |
| content | <code>JSON</code> | container |
| data | <code>Array</code> | array to expression set |
| attr | <code>String</code> | name of attribute |

