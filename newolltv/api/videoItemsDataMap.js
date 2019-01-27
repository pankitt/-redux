import { vodItemDataMap } from './vodItemDataMap';

export default function videoItemsDataMap(response) {
    let l = response.data.items.length,
        item,
        id,
        items = {},
        hasMore = response.data.hasMore,
        totalFound = response.data.totalFound,
        title = response.data.title || '',
        collectionUrl = response.data.collection_url || '',
        ids = new Array(l);
    while (l) {
        item = response.data.items[--l];
        id = parseInt(item.id, 10);
        items[id] = vodItemDataMap({ data: item });
        ids[l] = id;
    }
    return { items, ids, totalFound, hasMore, title, collectionUrl };
}
