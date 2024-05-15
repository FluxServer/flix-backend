import { Context } from "elysia";

/**
 * 
 * @param {import("elysia").Context} context 
 */
export const parse = async (type: any,context: Context) => {
    if(type == "raw") {
        return new URLSearchParams(await context.request.text());
    }else if(type == "json"){
        let json:any = await context.request.json();

        return {
            ...json as any,
            get: async (name: string) => {
                return json[name];
            }
        };
    }else if(type == "auto"){
        let body = await context.request.text();

        try{
            let json = JSON.parse(body);
            return {
                ...json,
                get: (name: string) => {
                    return json[name];
                }
            };
        }catch(e){
            if(body.startsWith("--------")){
                let formData:any = parseFormDataRaw(body);
                return {
                    ...formData,
                    get: (name: string) => {
                        return formData[name];
                    }
                };
            }else{
                return new URLSearchParams(body);
            }
        }
    }
}

function parseFormDataRaw(rawData: String) {
    const parts = rawData.split('--');

    const data:any = {};

    parts.forEach(part => {
        if (part.trim().length === 0) return; // Skip empty parts

        const matches = part.match(/name="([^"]+)"[\s\S]*?(\n\n|\r\n\r\n)([\s\S]*)\r?\n/);
        if (matches && matches.length >= 4) {
            const name = matches[1];
            const value = matches[3].trim();
            if (!data.hasOwnProperty(name)) {
                data[name] = value;
            } else {
                if (!Array.isArray(data[name])) {
                    data[name] = [data[name]];
                }
                data[name].push(value);
            }
        }
    });

    return data;
}