export default function bundlesDataMap(response) {
    let l = response.data.tariffs.length,
        specialOffers = {},
        stars = '*',
        bundle,
        error =  response.error,
        subsId,
        items = {},
        page = response.data.page,
        ids = new Array(l);
    while (l) {
        bundle = response.data.tariffs[--l];
        if (bundle.specialOfferId) {
            if (Object.keys(specialOffers).indexOf(bundle.specialOfferId + '') === -1) {
                specialOffers[bundle.specialOfferId] = stars;
                stars += '*';
            }
        }
        subsId = parseInt(bundle.subsId, 10);
        items[subsId] = bundleDataMap(bundle);
        ids[l] = subsId;
    }
    return { page, items, ids, error, specialOffers };
}

function bundleDataMap(item) {
    return item;
}
