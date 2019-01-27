import matchesDataMap from './matchesDataMap';
import clubsDataMap from './clubsDataMap';
import leaguesDataMap from './leaguesDataMap';
import highlightsDataMap from './highlightsDataMap';

export default function mainDataMap(response) {
    const topMatches = matchesDataMap({
        data: {
            matches: response.data.carousel,
        },
    });

    const clubs = clubsDataMap({
        data: response.data.clubs,
    });

    const highlights = highlightsDataMap({
        data: response.data.highlights,
    });

    const nationalTeams = clubsDataMap({
        data: response.data.nationalTeams,
    });

    const tournaments = leaguesDataMap({
        data: response.data.tournaments,
    });

    return { topMatches, clubs, nationalTeams, highlights, tournaments };
}
