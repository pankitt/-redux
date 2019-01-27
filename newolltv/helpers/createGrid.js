export function createGrid(category) {
    let className = '';
    switch (category) {
        case 'premium':
        case 'bigPosters':
        case 'amedia':
            className = 'grid cols-4@xxl cols-3@xl cols-3@l cols-3@ml cols-2@s cols-2@xs';
            break;
        case 'series':
        case 'movies':
            className = 'grid cols-6@xxl cols-5@xl cols-4@l cols-3@ml cols-2@s cols-2@xs';
            break;
        case 'shows':
            className = 'grid cols-7@xxl cols-6@xl cols-5@l cols-3@ml cols-2@s cols-2@xs';
            break;
        case 'collections':
        case 'music_collections':
        case 'radio':
        case 'continue_view':
            className = 'grid cols-7@xxl cols-6@xl cols-5@l cols-4@ml cols-3@s cols-2@xs';
            break;
        default:
            className = 'grid cols-6@xxl cols-5@xl cols-4@l cols-3@ml cols-2@s cols-2@xs';
    }
    return className;
}
