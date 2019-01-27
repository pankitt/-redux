export default function tournamentDataMap(response) {
    let l = response.data.length,
        items = {},
        id,
        item;
    while (l) {
        item = response.data[--l];
        id = parseInt(item.team_id, 10);
        items[id] = {
            id,
            group: item.group,
            title: item.title,
            logo: item.logo,
            played: item.played,
            won: item.won,
            drawn: item.drawn,
            lost: item.lost,
            goalsFor: item.goals_for,
            goalsAgainst: item.goals_against,
            goalsDiff: item.goals_diff,
            points: item.points,
        };
    }
    return { items };
}
