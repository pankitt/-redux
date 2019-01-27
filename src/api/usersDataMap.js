export default function usersDataMap(response) {
    let l = response.length,
        items = {},
        ids = new Array(l),
        id,
        item;
    while (l) {
        item = response[--l];
        id = parseInt(item.id, 10);
        items[id] = {
            id,
            name: item.name,
            username: item.username,
            phone: item.phone,
            website: item.website,
        };
        ids[l] = id;
    }
    return { items, ids };
}
