import JSONToSchema from './json2Schema';
import {
    SwaggerToApipost,
} from 'apipost-converter';

function Json2Schema(rawData: string): string {
    let dataObj = JSON.parse(rawData);
    let data = JSONToSchema(dataObj);

    return JSON.stringify(data);
}


async function Swagger2Apipost(rawData: string, basePath: boolean, host: boolean): Promise<string> {
    let options = {
        basePath: basePath ? true : false,
        host: host ? true : false
    }
    const SwaggerToApipostClass = new SwaggerToApipost();
    const dataObj = JSON.parse(rawData);
    const result = await SwaggerToApipostClass.convert(dataObj, options);
    return JSON.stringify(result);
}

//@ts-ignore
global.Json2Schema = Json2Schema;
//@ts-ignore
global.Swagger2Apipost = Swagger2Apipost;
