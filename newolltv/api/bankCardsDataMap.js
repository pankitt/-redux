export default function bankCardsDataMap(response) {
    let cards = [];
    if (response.data && Array.isArray(response.data.cards) && response.data.cards.length) {
        cards = response.data.cards.map(data => {
            return {
                id: data.hash,
                number: data.mask.split('*').join(' XXXX XXXX '),
                type: data.type,
            };
        });
    }
    return { cards };
}