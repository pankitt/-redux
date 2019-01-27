export const STOI = 'STOI';
export const TS = 'TS';
export const BOOL = 'BOOL';
export const FN = 'FN';

export function dataMap(data, schema) {
    const res = {};
    const fields = Object.keys(data);
    let l = fields.length, field, value;
    while (l) {
        field = fields[--l];
        if (!schema[field]) {
            continue;
        }
        value = data[field];
        switch (schema[field][1]) {
            case STOI:
                value = value ? parseInt(value, 10) : +value;
                break;
            case TS:
                value = value ? (new Date(value.replace(/-/g, '/'))).getTime() || Date.now() : +value;
                break;
            case BOOL:
                value = !!value;
                break;
            case FN:
                if (typeof schema[field][2] === 'function') {
                    value = schema[field][2](value);
                }
                break;
            default:
                break;
        }
        res[schema[field][0]] = value;
    }
    return res;
}