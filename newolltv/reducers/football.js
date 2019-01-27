import { GET_MAIN_SUCCESS } from '../actions/football/main';
import { GET_CLUBS_REQUEST, GET_CLUBS_SUCCESS, GET_CLUBS_FAILURE } from '../actions/football/clubs';
import { GET_LEAGUES_REQUEST, GET_LEAGUES_SUCCESS, GET_LEAGUES_FAILURE } from '../actions/football/leagues';
import { GET_NATIONAL_TEAMS_REQUEST, GET_NATIONAL_TEAMS_SUCCESS, GET_NATIONAL_TEAMS_FAILURE } from '../actions/football/nationalTeams';
import { GET_MATCHES_SUCCESS, GET_LEAGUE_MATCHES_SUCCESS, GET_CLUB_MATCHES_SUCCESS, GET_MATCH_SUCCESS, GET_TOP_MATCHES_SUCCESS, GET_MATCHES_REQUEST, GET_LEAGUE_MATCHES_REQUEST, GET_CLUB_MATCHES_REQUEST, GET_MATCH_FAILURE, GET_LEAGUE_MATCHES_FAILURE, GET_CLUB_MATCHES_FAILURE, GET_MATCH_REQUEST } from '../actions/football/matches';
import { GET_HIGHLIGHTS_SUCCESS } from '../actions/football/highlights';
import { MATCHES_IN_FUTURE, SET_MATCHES_TIME_FILTER } from '../actions/football/matchesPage';
import { GET_TOURNAMENT_SUCCESS, GET_TOURNAMENT_REQUEST, GET_TOURNAMENT_FAILURE } from '../actions/football/match';
import { PUSHER_UPDATE_MATCH } from '../actions/pusher';
import { GET_VIEW_HISTORY_ITEMS_SUCCESS } from '../actions/viewHistory';
import { VH_TYPE_FOOTBALL } from '../containers/account/ViewHistory';
import filter from 'lodash/filter';
import map from 'lodash/map';
import { mergeItems } from './videoItems';

const initialState = {
    isLoading: false,
    clubs: {
        items: {},
        ids: [],
        loading: false,
        error: false,
    },
    nationalTeams: {
        items: {},
        ids: [],
        loading: false,
        error: false,
    },
    leagues: {
        items: {},
        ids: [],
        loading: false,
        error: false,
    },
    highlights: {},
    matches: {},
    mainPage: {
        topMatches: [],
        highlights: [],
        leagues: [],
        clubs: [],
        nationalTeams: [],
    },
    matchesPage: {
        matches: [],
        timeFilter: MATCHES_IN_FUTURE,
        currentClub: null,
        currentTournament: null,
        page: 1,
        hasMore: true,
        loading: false,
        error: '',
    },
    matchPage: {
        isLoading: false,
        tournamentTable: {
            items: {},
            loading: false,
            error: null,
        },
        cupTree: {
            items: {},
            loading: false,
            error: null,
        },
    },
};

export default function football(state = initialState, action) {
    switch (action.type) {
        case GET_MAIN_SUCCESS:
            return {
                ...state,
                clubs: {
                    ...state.clubs,
                    items: { ...state.clubs.items, ...action.response.clubs.items },
                    ids: [...state.clubs.ids, ...action.response.clubs.ids],
                    loading: false,
                },
                leagues: {
                    ...state.leagues,
                    items: { ...state.leagues.items, ...action.response.tournaments.items },
                    ids: [...state.leagues.ids, ...action.response.tournaments.ids],
                    loading: false,
                },
                nationalTeams: {
                    ...state.nationalTeams,
                    items: { ...state.nationalTeams.items, ...action.response.nationalTeams.items },
                    ids: [...state.nationalTeams.ids, ...action.response.nationalTeams.ids],
                    loading: false,
                },
                matches:{ ...state.matches, ...action.response.topMatches.items, ...action.response.highlights.matches.items },
                mainPage:{
                    ...state.mainPage,
                    topMatches: action.response.topMatches.ids,
                    highlights: action.response.highlights.ids,
                    leagues: action.response.tournaments.ids,
                    clubs: map(filter(action.response.clubs.items, item => item.top), item => item.id),
                    nationalTeams: action.response.nationalTeams.ids,
                },
                highlights: { ...state.highlights, ...action.response.highlights.items, ...action.response.highlights.matches.highlights, ...action.response.topMatches.highlights },
            };
        case GET_CLUBS_REQUEST:
            return { ...state, clubs: { ...state.clubs, loading: true, error: false } };
        case GET_LEAGUES_REQUEST:
            return { ...state, leagues: { ...state.leagues, loading: true, error: false } };
        case GET_NATIONAL_TEAMS_REQUEST:
            return { ...state, nationalTeams: { ...state.nationalTeams, loading: true, error: false } };
        case GET_CLUBS_SUCCESS:
            return {
                ...state,
                clubs: {
                    ...state.clubs,
                    items: {
                        ...state.clubs.items,
                        ...action.response.items,
                    },
                    ids: [...state.clubs.ids, ...action.response.ids],
                    loading: false,
                },
            };
        case GET_LEAGUES_SUCCESS:
            return {
                ...state,
                leagues: {
                    ...state.leagues,
                    items: {
                        ...state.leagues.items,
                        ...action.response.items,
                    },
                    ids: [...state.leagues.ids, ...action.response.ids],
                    loading: false,
                },
            };
        case GET_NATIONAL_TEAMS_SUCCESS:
            return {
                ...state,
                nationalTeams: {
                    ...state.nationalTeams,
                    items: {
                        ...state.nationalTeams.items,
                        ...action.response.items,
                    },
                    ids: [...state.nationalTeams.ids, ...action.response.ids],
                    loading: false,
                },
            };
        case GET_CLUBS_FAILURE:
            return { ...state, clubs: { ...state.clubs, loading: false, error: true } };
        case GET_LEAGUES_FAILURE:
            return { ...state, leagues: { ...state.leagues, loading: false, error: true } };
        case GET_NATIONAL_TEAMS_FAILURE:
            return { ...state, nationalTeams: { ...state.nationalTeams, loading: false, error: true } };

        case GET_MATCH_SUCCESS:
            return {
                ...state,
                matches:{ ...state.matches, ...action.response.items },
                highlights:{ ...state.highlights, ...action.response.highlights },
                matchPage: { ...state.matchPage, isLoading: false },
            };

        case PUSHER_UPDATE_MATCH:
            if (action.match) {
                return { ...state, matches: { ...state.matches, [action.match.id]: action.match }, highlights: action.highlight ? { ...state.highlights, [action.highlight.id]: action.highlight } : state.highlights };
            }
            return state;

        case GET_TOP_MATCHES_SUCCESS:
            return { ...state,
                topMatches:[ ...state.topMatches, ...action.response.ids ],
                matches:{ ...state.matches, ...action.response.items },
            };
        case GET_HIGHLIGHTS_SUCCESS:
            return {
                ...state,
                matches:{ ...state.matches, ...action.response.matches.items },
                highlights: { ...state.highlights, ...action.response.items },
            };

        case SET_MATCHES_TIME_FILTER:
            return { ...state, matchesPage: { ...state.matchesPage, timeFilter: action.filter } };

        case GET_MATCHES_REQUEST:
            return {
                ...state,
                matchesPage: { ...state.matchesPage,
                    matches: state.matchesPage.currentClub || state.matchesPage.currentTournament ? [] : state.matchesPage.matches,
                    currentClub: null,
                    currentTournament: null,
                    loading: true,
                },
            };
        case GET_MATCHES_SUCCESS:
            return {
                ...state,
                matches:{ ...state.matches, ...action.response.items },
                highlights:{ ...state.highlights, ...action.response.highlights },
                matchesPage: {
                    ...state.matchesPage,
                    page: action.params.page,
                    hasMore: action.response.hasMore,
                    matches: updateMatchesAccordingToPage(state.matchesPage.matches, action.response.ids, action.params.page),
                    loading: false,
                },
            };
        case GET_LEAGUE_MATCHES_REQUEST:
            return {
                ...state,
                matchesPage: {
                    ...state.matchesPage,
                    matches: state.matchesPage.currentTournament !== action.params.id ? [] : state.matchesPage.matches,
                    currentClub: null,
                    currentTournament: action.params.id,
                    loading: true,
                },
            };
        case GET_LEAGUE_MATCHES_SUCCESS:
            return {
                ...state,
                matches:{ ...state.matches, ...action.response.items },
                highlights:{ ...state.highlights, ...action.response.highlights },
                matchesPage: {
                    ...state.matchesPage,
                    page: action.params.page,
                    hasMore: action.response.hasMore,
                    matches: updateMatchesAccordingToPage(state.matchesPage.matches, action.response.ids, action.params.page),
                    loading: false,
                },
            };
        case GET_CLUB_MATCHES_REQUEST:
            return {
                ...state,
                matchesPage: {
                    ...state.matchesPage,
                    matches: state.matchesPage.currentClub !== action.params.id ? [] : state.matchesPage.matches,
                    currentClub: action.params.id,
                    currentTournament: null,
                    loading: true,
                },
            };
        case GET_CLUB_MATCHES_SUCCESS:
            return {
                ...state,
                matches:{ ...state.matches, ...action.response.items },
                highlights:{ ...state.highlights, ...action.response.highlights },
                matchesPage: {
                    ...state.matchesPage,
                    page: action.params.page,
                    hasMore: action.response.hasMore,
                    matches: updateMatchesAccordingToPage(state.matchesPage.matches, action.response.ids, action.params.page),
                    loading: false,
                },
            };
        case GET_MATCH_FAILURE:
            return { ...state,
                matchesPage: {
                    ...state.matchesPage,
                    loading: false,
                    error: action.message,
                },
                matchPage: { ...state.matchPage, isLoading: false },
            };
        case GET_LEAGUE_MATCHES_FAILURE:
        case GET_CLUB_MATCHES_FAILURE:
            return { ...state,
                matchesPage: {
                    ...state.matchesPage,
                    loading: false,
                    error: action.message,
                },
            };

        case GET_TOURNAMENT_REQUEST:
            return { ...state, matchPage: { ...state.matchPage, tournamentTable: { ...state.matchPage.tournamentTable, loading: true } } };
        case GET_MATCH_REQUEST:
            return { ...state, matchPage: { ...state.matchPage, isLoading: true } };
        case GET_TOURNAMENT_SUCCESS:
            return {
                ...state,
                matchPage: {
                    ...state.matchPage,
                    tournamentTable: {
                        ...state.matchPage.tournamentTable,
                        loading: false,
                        items: action.response.items,
                    },
                },
            };
        case GET_TOURNAMENT_FAILURE:
            return { ...state, matchPage: { ...state.matchPage, tournamentTable: { ...state.matchPage.tournamentTable, loading: false, error: action.error } } };
        case GET_VIEW_HISTORY_ITEMS_SUCCESS:
            return action.params.type !== VH_TYPE_FOOTBALL ? { ...state } : {
                ...state,
                highlights: mergeItems({ ...state.highlights, ...action.response.matches.highlights }, action.response.items, action.response.ids),
                matches: { ...state.matches, ...action.response.matches.items },
            };
        default:
            return state;
    }
}

const updateMatchesAccordingToPage = (stateMatches, actionMatches, page) => {
    if (page > 1) {
        return [ ...stateMatches, ...actionMatches ];
    }
    return [...actionMatches];
};
