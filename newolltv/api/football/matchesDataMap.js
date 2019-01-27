import moment from 'moment';
import highlightsDataMap from './highlightsDataMap';
import map from 'lodash/map';
const STOI = 'STOI';
const TS = 'TS';
const BOOL = 'BOOL';
const FN = 'FN';
import { LIVE_STATUS_STOPPED } from '../../constants';

const schema = {
    away_team: ['awayTeam', null], // 'Пари Сен-Жермен',
    away_team_id: ['awayTeamId', STOI],  // '1849',
    // away_team_logo: 'http://s5.dev.ollcdn.net/i/football_teams_logos/1644_34x76.PNG',
    // away_team_logo_small: 'http://s2.dev.ollcdn.net/i/football_teams_logos/1644_20x46.PNG',
    // away_team_logo_tablet: ['awayTeamLogo', null], // 'http://s6.dev.ollcdn.net/i/football_teams_logos/1644_68x152.PNG',
    // away_team_logo_tablet_big: ['awayTeamLogoBig', null], // '/i/football_teams_logos/1644_68x152.PNG',
    away_team_logo_site: ['awayTeamLogo', null],
    away_team_penalties_scored: ['awayTeamPenaltiesScored', null],
    away_team_scored: ['awayTeamScored', null],
    away_team_formation: ['awayTeamFormation', null],
    highlight_id: ['highlightId', STOI],
    // highlights: null,
    // [
    // { id: '150840', title: 'Селтик — Пари Сен-Жермен. Обзор матча. 0:5. 12.09.2017', marker: 'best', cover: 'http://s0.dev.ollcdn.net/i/e3/90/7a/e3907a-150840_170912_HIGHLIGHT_Celtik_PSG_00_05_10_00.jpg', cover_big: 'http://s7.dev.ollcdn.net/i/e3/90/7a/e3907a-150840_…0912_HIGHLIGHT_Celtik_PSG_00_05_10_00_537x295.jpg' },
    // { id: '150764', title: 'Гол! Неймар, 19 мин., Пари Сен-Жермен', marker: 'goal', cover: 'http://s2.dev.ollcdn.net/i/b6/06/30/b60630-150764_170912_HIGHLIGHT_Celtik_PSG_0_1_00_00_35_00.jpg', cover_big: 'http://s0.dev.ollcdn.net/i/b6/06/30/b60630-150764_…_HIGHLIGHT_Celtik_PSG_0_1_00_00_35_00_537x295.jpg' },
    // { id: '150768', title: 'Гол! Килиан Мбаппе Лоттин, 34 мин., Пари Сен-Жермен', marker: 'goal', cover: 'http://s3.dev.ollcdn.net/i/81/96/32/819632-150768_170912_HIGHLIGHT_Celtik_PSG_0_2_00_00_25_00.jpg', cover_big: 'http://s1.dev.ollcdn.net/i/81/96/32/819632-150768_…_HIGHLIGHT_Celtik_PSG_0_2_00_00_25_00_537x295.jpg' },
    // { id: '150772', title: 'Гол! Эдинсон Кавани, 40 мин. (P), Пари Сен-Жермен', marker: 'goal', cover: 'http://s7.dev.ollcdn.net/i/14/34/e7/1434e7-150772_170912_HIGHLIGHT_Celtik_PSG_0_3_00_00_20_00.jpg', cover_big: 'http://s5.dev.ollcdn.net/i/14/34/e7/1434e7-150772_…_HIGHLIGHT_Celtik_PSG_0_3_00_00_20_00_537x295.jpg' },
    // { id: '150784', title: 'Селтик — Пари Сен-Жермен. Лучшие моменты. 1-й тайм', marker: 'best', cover: 'http://s8.dev.ollcdn.net/i/90/98/59/909859-150784_170912_HIGHLIGHT_Celtik_PSG_1_half_00_01_25_00.jpg', cover_big: 'http://s4.dev.ollcdn.net/i/90/98/59/909859-150784_…GHLIGHT_Celtik_PSG_1_half_00_01_25_00_537x295.jpg' },
    // { id: '150808', title: 'Гол! Микаэль Лустиг, 83 мин. (AG), Селтик', marker: 'goal', cover: 'http://s0.dev.ollcdn.net/i/5b/67/b7/5b67b7-150808_170912_HIGHLIGHT_Celtik_PSG_0_4_00_00_30_00.jpg', cover_big: 'http://s9.dev.ollcdn.net/i/5b/67/b7/5b67b7-150808_…_HIGHLIGHT_Celtik_PSG_0_4_00_00_30_00_537x295.jpg' },
    // { id: '150812', title: 'Гол! Эдинсон Кавани, 85 мин., Пари Сен-Жермен', marker: 'goal', cover: 'http://s0.dev.ollcdn.net/i/a4/a3/cb/a4a3cb-150812_170912_HIGHLIGHT_Celtik_PSG_0_5_00_00_25_00.jpg', cover_big: 'http://s1.dev.ollcdn.net/i/a4/a3/cb/a4a3cb-150812_…_HIGHLIGHT_Celtik_PSG_0_5_00_00_25_00_537x295.jpg' },
    // { id: '150828', title: 'Селтик — Пари Сен-Жермен. Лучшие моменты. 2-й тайм', marker: 'best', cover: 'http://s1.dev.ollcdn.net/i/11/74/a1/1174a1-150828_170912_HIGHLIGHT_Celtik_PSG_2_half_00_00_45_00.jpg', cover_big: 'http://s0.dev.ollcdn.net/i/11/74/a1/1174a1-150828_…GHLIGHT_Celtik_PSG_2_half_00_00_45_00_537x295.jpg' },
    // ],
    home_team: ['homeTeam', null], // 'Селтик',
    home_team_id: ['homeTeamId', STOI],
    // home_team_logo: 'http://s3.dev.ollcdn.net/i/football_teams_logos/2352_34x76.PNG',
    // home_team_logo_small: 'http://s9.dev.ollcdn.net/i/football_teams_logos/2352_20x46.PNG',
    // home_team_logo_tablet: ['homeTeamLogo', null], // 'http://s2.dev.ollcdn.net/i/football_teams_logos/2352_68x152.PNG',
    // home_team_logo_tablet_big: ['homeTeamLogoBig', null], // '/i/football_teams_logos/2352_68x152.PNG',
    home_team_logo_site: ['homeTeamLogo', null],
    home_team_penalties_scored: ['homeTeamPenaltiesScored', null],
    home_team_scored: ['homeTeamScored', null],
    home_team_formation: ['homeTeamFormation', null],
    lineups: ['lineups', FN, matchLineupsDataMap],
    match_events: ['matchEvents', FN, matchEventsDataMap],
    substitutions: ['substitutions', FN, matchSubstitutionsDataMap],
    subtournament_id: ['subtournamentId', null],
    tournament_type: ['tournamentType', null],
    id: ['id', STOI],
    is_favorite: ['isFavorite', BOOL], // 0,
    // is_hd: 1,
    is_subscription_paid: ['isPurchased', BOOL],
    kick_off_at: ['kickOffAt', null], // '2017-09-12 21:45:00',
    live_id: ['liveId', STOI],
    live_schedule_id: ['liveScheduleId', STOI],
    live_status: ['liveStatus', null], // 'finished',
    live_url: ['liveUrl', null], // '150150-live-seltik-pszh',
    // match_poster_small: ['matchPosterSmall', null], // 'http://s8.dev.ollcdn.net/i/17/e3/c5/17e3c5sel-psg.png',
    live_type_id: ['liveTypeId', null],
    match_poster_large: ['matchPosterLarge', null], // 'http://s8.dev.ollcdn.net/i/17/e3/c5/17e3c5sel-psg.png',
    round_id: ['roundId', STOI],
    round_name: ['roundName', null], // '1-й тур',
    started_at_ts: ['startedAt', null], // '2017-09-12 22:50:20',
    // status: null, // 'Ended',
    status_id: ['statusId', null], // 130,
    subs: ['subs', null],
    // tournament_css_class: null,
    // tournament_css_class_v2: 'tournament-7',
    tournament_id: ['tournamentId', STOI],
    tournament_logo: ['tournamentLogo', null], // 'http://s6.dev.ollcdn.net/i/94/26/40/942640_lch-40x92.png',
    tournament_name: ['tournamentName', null], // 'Лига Чемпионов УЕФА',
    tournament_player_image: ['tournamentPlayerImage', null], // 'http://s0.dev.ollcdn.net/i/81/6d/53/816d53_lch-537x295.png',
    unique_tournament_id: ['uniqueTournamentId', STOI],
    // web_end_ts: ['webEnd', null], // 000000000,
    // web_start: ['webStart', null], // '2017-09-12 21:45:00',
    web_start_ts: ['webStartTS', null],

};

const fields = Object.keys(schema);

export default function matchesDataMap(response) {
    let data = response.data.matches,
        l = data.length,
        item,
        field,
        value,
        parsedItem,
        teamsWithFutureMatches = [],
        items = {},
        ids = new Array(l),
        fl,
        // webStart,
        date,
        hasMore = !!response.data.hasMore,
        itemHighlights,
        highlights = {},
        now = Date.now();
    while (l) {
        item = data[--l];
        fl = fields.length;
        parsedItem = {};
        while (fl) {
            field = fields[--fl];
            value = item[field];
            switch (schema[field][1]) {
                case STOI:
                    value = value ? parseInt(value, 10) : +value;
                    break;
                case TS:
                    value = value ? (new Date(value.replace(/-/g, '/'))).getTime() || Date.now() : +value;
                    break;
                case BOOL:
                    value = !!value;
                    break;
                case FN:
                    if (typeof schema[field][2] === 'function') {
                        value = schema[field][2](value);
                    }
                    break;
                default:
                    break;
            }
            parsedItem[schema[field][0]] = value;
        }
        if (parsedItem.startedAt) {
            parsedItem.startedAt *= 1000;
        }
        date = moment(parsedItem.webStartTS * 1000);
        parsedItem.webStart = date.toISOString();
        parsedItem.webStartData = date.format('YYYY-MM-DD');
        parsedItem.webStartHour = date.format('HH');
        parsedItem.webStartMinute = date.format('mm');
        parsedItem.webStartDay = date.format('dd');
        if (date.isSame(now, 'year')) {
            parsedItem.webStartDayMonthShort = date.format('D MMM, dd');
            parsedItem.webStartDayMonthLong = date.format('D MMMM, dd');
        } else {
            parsedItem.webStartDayMonthShort = date.format('D MMM YYYY');
            parsedItem.webStartDayMonthLong = date.format('D MMMM YYYY');
        }
        parsedItem.webStartTS = +date;
        if (item.highlights) {
            itemHighlights = highlightsDataMap({ data: { highlights: item.highlights } });
            parsedItem.highlights = itemHighlights.ids;
            if (itemHighlights.ids.length) {
                highlights = { ...highlights, ...itemHighlights.items };
            }
        } else {
            parsedItem.highlights = [];
        }

        items[parsedItem.id] = parsedItem;
        ids[l] = parsedItem.id;
        if (parsedItem.liveStatus === LIVE_STATUS_STOPPED) {
            teamsWithFutureMatches = [...teamsWithFutureMatches, parsedItem.homeTeamId, parsedItem.awayTeamId];
        }
    }
    return { items, ids, hasMore, highlights, teamsWithFutureMatches };
}

export function matchDataMap(response) {
    return matchesDataMap({ data: { matches : [response.data] } });
}

export function matchSubstitutionsDataMap(substitutions) {
    return map(substitutions, item => {
        return {
            teamId: parseInt(item.team_id, 10),
            outPlayerId : parseInt(item.out_player_id, 10),
            inPlayerId: parseInt(item.in_player_id, 10),
            minute: item.minute,
        };
    });
}

function matchLineupsDataMap(lineups) {
    return {
        homeTeam: lineupDataMap(lineups.home_team),
        awayTeam: lineupDataMap(lineups.away_team),
    };
}

function lineupDataMap(lineup) {
    return map(lineup, data => {
        return {
            ...data,
            player: {
                ...data.player,
                id: parseInt(data.player.id, 10),
            },
        };
    });
}

function matchEventsDataMap(matchEvents) {
    return {
        goals: map(matchEvents.goals, goal => matchGoalDataMap(goal)),
        cards: map(matchEvents.cards, card => matchCardDataMap(card)),
    };
}

export function matchGoalDataMap(goal) {
    return {
        id: goal.id,
        minute: goal.minute,
        playerId: parseInt(goal.player_id, 10),
        subType: goal.sub_type,
    };
}

export function matchCardDataMap(card) {
    return {
        id: card.id,
        minute: card.minute,
        playerId: parseInt(card.player_id, 10),
        subType: card.sub_type,
    };
}
