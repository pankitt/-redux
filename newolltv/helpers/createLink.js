export function createLink(category, type, id) {
    let link = '/';
    if (category) {
        switch (category) {
            case 'music_collections':
                link += 'music/collections/';
                break;
            default:
                link += category + '/';
        }
    }
    if (type) {
        link += type + '/';
    }
    if (id) {
        link += id;
    }
    return link;
}
