import { vodItemDataMap } from './../vodItemDataMap';

export default function vhItemsDataMap(response) {
    let l = response.data.length,
        item,
        id,
        items = {},
        ids = new Array(l);
    while (l) {
        item = response.data[--l];
        id = parseInt(item.id, 10);
        items[id] = vodItemDataMap({ data: item });
        ids[l] = id;
    }
    return { items, ids };
}
