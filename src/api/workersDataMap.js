import map from 'lodash/map';


export default function workersDataMap(response) {
    const size = 24;
    let num = 0;
    const number = (i) => {
        if (i % size === 0) ++num;
        return num
    };

    let l = response.length,
        page = Math.ceil(l/size),
        items = {};
    items = map(response, (item, i) => ({
        id: i,
        pageNum: number(i),
        isActive: item.isActive,
        balance: item.balance,
        picture: item.picture,
        name: item.name,
        gender: item.gender,
        company: item.company,
        email: item.email,
        phone: item.phone,
        address: item.address,
        about: item.about,
        registered: item.registered,
    }));
    return { items, page };
}
