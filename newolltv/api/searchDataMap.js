import moment from 'moment';
// import matchesDataMap from './football/matchesDataMap';

export function searchSuggestDataMap(response) {
    return response;
}

export function searchChannelsDataMap(response) {
    return channelsDataMap(response.data);
}

export function searchFootballDataMap(response) {
    return footballDataMap(response.data);
}

export function searchEPGDataMap(response) {
    return epgDataMap(response.data);
}

export function searchSeriesDataMap(response) {
    return seriesDataMap(response.data);
}

export function searchDataMap(response) {
    let data = response.data;
    if (response.data.epg) {
        data = { ...data, epg: epgDataMap(response.data.epg) };
    }
    if (response.data.channels) {
        data =  { ...data, channels: channelsDataMap(response.data.channels) };
    }
    if (response.data.football) {
        data =  { ...data, football: footballDataMap(response.data.football) };
    }
    if (response.data.series) {
        data =  { ...data, series: seriesDataMap(response.data.series) };
    }
    return data;
}


function footballDataMap(football) {
    let l = football.items.length,
        items = new Array(l), date, now = Date.now(), match, item = {};
    for (let i = 0; i < l; i++) {
        match = football.items[i];

        item.startedAt = match.start_ts;

        date = moment(item.startedAt * 1000);

        if (date.isSame(now, 'year')) {
            item.webStartDayMonthShort = date.format('D MMM, dd');
            item.webStartDayMonthLong = date.format('D MMMM, dd');
        } else {
            item.webStartDayMonthShort = date.format('D MMM YYYY');
            item.webStartDayMonthLong = date.format('D MMMM YYYY');
        }

        item.webStartTS = +date;

        item = {
            ...match,
            webStart : date.toISOString(),
            webStartData : date.format('YYYY-MM-DD'),
            webStartHour : date.format('HH'),
            webStartMinute : date.format('mm'),
            webStartDay : date.format('dd'),
            tournamentName: match.tournament,
            awayTeam: match.away_team.title,
            awayTeamLogo:  match.away_team.logo,
            awayTeamScored: match.away_team.scored,
            homeTeam: match.home_team.title,
            homeTeamLogo: match.home_team.logo,
            homeTeamScored: match.home_team.scored,
            liveStatus: match.live_status,
            liveTypeId: match.live_type_id,
        };
        items[i] = item;
    }
    return { items, hasMore: football.hasMore, total: football.total };
}

function channelsDataMap(channels) {
    let l = channels.items.length,
        items = new Array(l),
        channel;

    for (let i = 0; i < l; i++) {
        channel = channels.items[i];
        const nextThree = channel.nextThree.map(program => programDataMap(program));
        const now = Date.now();
        const currentProgram = find(nextThree, program => program.start <= now && now < program.stop);
        items[i] = {
            id: channel.id,
            poster: channel.poster,
            nextThree,
            currentProgramId: currentProgram ? currentProgram.id : 0,
        };
    }
    return { items, hasMore: channels.hasMore, total: channels.total };
}


function epgDataMap(epg) {
    let l = epg.items.length,
        items = new Array(l);
    for (let i = 0; i < l; i++) {
        items[i] = programDataMap(epg.items[i]);
    }
    return { items, hasMore: epg.hasMore, total: epg.total };
}

function programDataMap(item) {
    const id = item.id;
    const start = item.start_ts * 1000;
    const startDate = moment(start);
    const stop = item.stop_ts * 1000;
    return {
        id,
        title: item.name || item.title,
        poster: item.poster,
        channelId: item.channel_id,
        start,
        startTime: startDate.format('HH:mm'),
        startDate: +startDate.startOf('day'),
        stop,
        dvr: stop > Date.now() ? -1 : item.dvr,
    };
}

function seriesDataMap(series) {
    let l = series.items.length,
        items = new Array(l),
        item;

    for (let i = 0; i < l; i++) {
        item = series.items[i];
        items[i] = {
            genresIds: item.genres_ids,
            genres: item.genres_map,
            id: item.id,
            isAmedia: item.is_amedia,
            additionalCover: item.src,
            src: item.src,
            title: item.title,
            url: item.url,
            year: item.year,
        };
    }
    return { items, hasMore: series.hasMore, total: series.total };
}
