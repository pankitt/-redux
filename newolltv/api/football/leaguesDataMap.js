export default function leaguesDataMap(response) {
    let l = response.data.length,
        items = {},
        ids = new Array(l),
        id,
        item;
    while (l) {
        item = response.data[--l];
        id = parseInt(item.id, 10);
        items[id] = { id, title: item.name, logo: item.logo, unique_tournament_id: item.unique_tournament_id };
        ids[l] = id;
    }
    return { items, ids };
}
