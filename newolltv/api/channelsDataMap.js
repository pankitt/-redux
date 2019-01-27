import moment from 'moment';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import find from 'lodash/find';

export function channelsDataMap(response) {
    let channels = {}, ids = [], genres = {}, genresIds = [];
    if (response.data.channels) {
        forEach(response.data.channels.items, item => {
            const channel = channelDataMap(item);
            ids.push(channel.id);
            channels[channel.id] = channel;
        });
    }
    if (response.data.genres) {
        forEach(response.data.genres.items, item => {
            genresIds.push(item.id);
            genres[item.id] = item;
        });
    }

    return { channels, ids, genres, genresIds };
}

export function radioDataMap(response) {
    let radio = {}, ids = [], genres = {}, genresIds = [];
    if (response.data.radio) {
        forEach(response.data.radio.items, item => {
            const channel = channelDataMap(item);
            channel.poster = item.icon200;
            ids.push(channel.id);
            radio[channel.id] = channel;
        });
    }
    if (response.data.genres) {
        forEach(response.data.genres.items, item => {
            genresIds.push(item.id);
            genres[item.id] = item;
        });
    }

    return { radio, ids, genres, genresIds };
}

function channelDataMap(data) {
    const nextThree = data.nextThree.map(program => programDataMap(program));
    const now = Date.now();
    const currentProgram = find(nextThree, program => program.start <= now && now < program.stop);
    return {
        id: data.item_id,
        title: data.title,
        description: data.descr,
        poster: data.poster,
        hd: data.hd,
        isPurchased: !!data.is_free,
        isOwn: !!data.own_channel,
        isOwnStream: !!data.own_stream_channel,
        isUnderParentalProtect: !!data.under_parental_protect,
        isFavorite: !!data.is_favorite,
        genres: data.genres,
        subs: data.subs,
        nextThree,
        currentProgramId: currentProgram ? currentProgram.id : 0,
    };
}

export function epgDataMap(response) {
    let l = response.data.length,
        items = {},
        ids = new Array(l),
        item;
    for (let i = 0; i < l; i++) {
        item = programDataMap(response.data[i]);
        ids[i] = item.id;
        items[item.id] = item;
    }
    return { items, ids, hasMore: response.hasMore };
}

function programDataMap(item) {
    const id = item.programm_id;
    const start = item.start_ts * 1000;
    const startDate = moment(start);
    const stop = item.stop_ts * 1000;
    return {
        id,
        mediaId: item.id_item,
        title: item.name,
        description: item.description,
        start,
        startTime: startDate.format('HH:mm'),
        startDate: +startDate.startOf('day'),
        stop,
        dvr: stop > Date.now() ? -1 : item.dvr, // @TODO remove assign -1 after #20738 future will released,
    };
}


export function channelNextThreeProgramDataMap(response) {
    return {
        channelsNextTreeProgram : map(response.data, channel => ({ id: channel.id, nextThree: channel.nextThree.map(program => programDataMap(program)) })),
    };
}
