import forEach from 'lodash/forEach';

export default function paymentDataMap(response) {
    let subs = {};
    forEach(response.data.subs, (sub, id) => {
        subs[id] = {
            ...sub,
            id: +id,
            priceWithDiscount: '' + (Number(sub.price) - Number(sub.discount)).toFixed(2),
        };
    });
    const { renew, user, error, subsNames, discount } = response.data;
    return { renew, user, error, subsNames, subs, discount };
}
