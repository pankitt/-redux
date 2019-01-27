export default function clubsDataMap(response) {
    let l = response.data.length,
        item,
        id,
        items = {},
        ids = new Array(l);
    while (l) {
        item = response.data[--l];
        id = parseInt(item.id, 10);
        items[id] = { id, title: item.name, logo: item.logo_site, top: item.top };
        ids[l] = id;
    }
    return { items, ids };
}
