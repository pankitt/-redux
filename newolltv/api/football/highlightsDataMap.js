import matchesDataMap from './matchesDataMap';

export default function highlightsDataMap(response) {
    let data = response.data.highlights,
        hasMore = response.data,
        l = data.length,
        id,
        ids = new Array(l),
        item,
        items = {},
        matches = response.data.matches ? matchesDataMap(response) : null;

    while (l) {
        item = data[--l];
        id = parseInt(item.id, 10);
        ids[l] = id;
        items[id] = {
            id,
            title: item.title,
            marker: item.marker,
            cover: item.cover,
            penalty: !!item.penalty,
            score: item.score,
            matchId: parseInt(item.match_id, 10),
            duration: item.duration,
            isPurchased: typeof item.is_subscription_paid === 'undefined' ? true : !!item.is_subscription_paid,
            viewPercentage: item.view_percentage,
            viewDate: item.view_date,
        };
    }

    return { items, ids, hasMore, matches };
}
