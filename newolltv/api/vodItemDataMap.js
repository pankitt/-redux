import map from 'lodash/map';
import { dataMap, BOOL, STOI, FN } from './dataMap';

const schema = {
    HD: ['isHD', BOOL],
    actors: ['actors', null], // "",
    age: ['age', null], // null,
    audioLangs: ['audioLangs', null], // "",
    available_to: ['availableTo', null], // 1546293599,
    // categories: ['categories', null], // ["18"],
    collection_ids: ['collectionIds', FN, data => map(data, v => parseInt(v, 10))], // ["130349"],
    country: ['country', null], // "",
    cover: ['cover', null], // "https://s0.ollcdn.net/i/40/c0/87/40c087smurfiky-zaterianaja-derevnia-224x300.jpg",
    descr: ['description', null], // "Одного разу Смурфетта помічає в селі таємничу істоту, яка зникає в чарівному лісі. Разом з братами вона відправляється в темні і небезпечні хащі на пошуки цієї істоти. Друзів чекають неймовірні пригоди і нові відкриття.",
    directors: ['directors', null], // "",
    duration: ['duration', STOI], // "5176",
    // for_children: 0,
    // genre: "",
    genres_ids: ['genresIds', null], // [],
    genres_map: ['genres', null], // {},
    id: ['id', STOI], // "220076",
    is_amedia: ['isAmedia', BOOL], // 0,
    is_favorite: ['isFavorite', BOOL], // 0,
    // is_free: ['', BOOL], // 1,
    is_ivi: ['isIvi', BOOL], // 0,
    is_premium: ['isPremium', BOOL], // 0,
    is_purchased: ['isPurchased', BOOL], // 1,
    itemFrames: ['itemFrames', null], // ["https://s0.ollcdn.net/i/de/62/2d/de622d-220076.jpg", ''],
    // item_type: 1,
    // match_id: null,
    original_title: ['originalTitle', null], // null,
    poster: ['poster', null], // "https://i.ollcdn.net/689b7328741e19f1fb1dbe3b0f474dd9d37a0e85/i/no-poster.jpg",
    seek_time: ['seekTime', null],
    src: ['src', null], // "https://s0.ollcdn.net/i/40/c0/87/40c087smurfiky-zaterianaja-derevnia-224x300.jpg",
    subtitleLangs: ['subtitleLangs', null], // "",
    subs: ['subs', null],
    title: ['title', null], // "Смурфики затерянная деревня",
    trailers: ['trailers', FN, parseTrailers],
    type_id: ['typeId', STOI],
    under_parental_protect: ['underParentalProtect', BOOL], // 0,
    url: ['url', null], // "/films/220076-smurfiki-zateryannaya-derevnya",
    vod_markers: ['vodMarkers', null], // [],
    view_date: ['viewDate', null],
    view_percentage: ['viewPercentage', null],
    year: ['year', STOI], // "2017",
    year_end: ['yearEnd', STOI],
    additional_cover: ['additionalCover', null],
    cover_v2_large: ['coverLarge', null],
    last_seen: ['lastSeen', STOI],
    seriesInfo: ['seriesInfo', FN, parseSeriesInfo], // переделывается позже в редюсере videoItems
};

export function vodItemDataMap(response) {
    return dataMap(response.data, schema);
    // const item = response.data;
    // let year, yearEnd;
    // if (item.year_end) {
    //     yearEnd = parseInt(item.year_end, 10);
    // }
    // if (item.year) {
    //     year = parseInt(item.year, 10);
    // }
    //
    // const result = {
    //     id: parseInt(item.id, 10),
    //     age: item.age,
    //     actors: item.actors,
    //     audioLangs: item.audioLangs,
    //     // ageLimitName: item.age_limit_name,
    //     collectionIds: map(item.collection_ids, id => parseInt(id, 10)),
    //     // cost: item.cost,
    //     // costCurrency: item.cost_currency,
    //     country: item.country,
    //     description: item.descr,
    //     duration: item.duration,
    //     directors: item.directors,
    //     // genre: item.genre,
    //     genresIds: item.genres_ids,
    //     genres: item.genres_map,
    //     hasAudiotracks: item.has_audiotracks,
    //     hasSubtitles: item.has_subtitles,
    //     isHD: !!item.HD,
    //     isAmedia: !!item.is_amedia,
    //     isDvr: !!item.is_dvr,
    //     isFavorite: !!item.is_favorite,
    //     // isFootball: !!item.is_football,
    //     isPurchased: !!item.is_free,
    //     isIvi: !!item.is_ivi,
    //     isLive: !!item.is_live,
    //     isPremium: !!item.is_premium,
    //     itemFrames: item.itemFrames,
    //     // isSubscription: !!item.is_subscription,
    //     // isSubscriptionPaid: !!item.is_subscription_paid,
    //     lastSeen: item.last_seen,
    //     seriesInfo: parseSeriesInfo(item.seriesInfo),
    //     order: item.order,
    //     originalTitle: item.original_title,
    //     poster: item.poster,
    //     rating: item.rating,
    //     ratingUser: item.rating_user,
    //     // releaseDate: item.release_date,
    //     src: item.src,
    //     srcSmall: item.src_small,
    //     subs: item.subs,
    //     subsType: item.subs_type,
    //     title: item.title,
    //     typeId: item.type_id,
    //     underParentalProtect: item.under_parental_protect,
    //     vodMarkers: item.vod_markers,
    //     year,
    //     yearEnd,
    //     trailers: parseTrailers(item.trailers),
    //     subtitleLangs: item.subtitleLangs,
    //     url: item.url,
    // };

    // if (item.additional_cover) {
    //     result.additionalCover = item.additional_cover;
    // }
    //
    // if (item.cover_v2_large) {
    //     result.coverLarge = item.cover_v2_large;
    // }
    //
    // return result;
}

export function mediaDataMap(response) {
    const {
        audio_languages: audioLanguages,
        category_name: category_Name,
        end_time: endTime,
        end_time_ts: endTimeTs,
        id,
        is_audio_available: isAudioAvailable,
        is_episode: isEpisode,
        is_favorite: isFavorite,
        is_live: isLive,
        is_music_clip: isMusicClip,
        is_purchased: isPurchased,
        ivi_id: iviId,
        media_url: mediaUrl,
        seek_time: seekTime,
        start_time: startTime,
        start_time_ts: startTimeTs,
        start_with_max_quality: startWithMaxQuality,
        stat: {
            host,
            port,
            interval,
            uniqid,
        },
        subtitle_url: subtitleUrl,
        timeshift_duration: timeshiftDuration,
        title,
        under_parental_protect: underParentalProtect,
    } = response.data;
    let iviData;
    if (response.data.ivi_data) {
        iviData = {
            appVersion: response.data.ivi_data.app_version,
            uid: response.data.ivi_data.iviuid.toString(),
            k1: response.data.ivi_data.k1,
            k2: response.data.ivi_data.k2,
            key: response.data.ivi_data.key,
            session: response.data.ivi_data.session,
            status: response.data.ivi_data.status,
            subsite: response.data.ivi_data.subsite,
        };
    }

    return {
        audioLanguages,
        category_Name,
        endTime,
        endTimeTs,
        id: +id,
        isAudioAvailable,
        isEpisode,
        isFavorite,
        isLive,
        isMusicClip,
        isPurchased,
        iviId,
        iviData,
        mediaUrl,
        seekTime,
        startTime,
        startTimeTs,
        startWithMaxQuality,
        stat: {
            host,
            port,
            interval,
            uniqid,
        },
        subtitleUrl,
        timeshiftDuration,
        title,
        underParentalProtect,
    };
}

function parseTrailers(trailers) {
    if (!trailers) {
        return [];
    }
    return map(trailers, trailer => ({ id: parseInt(trailer.id, 10) }));
}

function parseSeriesInfo(seriesInfo) {
    if (!seriesInfo) {
        return;
    }
    if (seriesInfo.seasons) {
        return { seasons: parseSeasons(seriesInfo.seasons) };
    }
    if (seriesInfo.series) {
        return { series: parseSeries(seriesInfo.series) };
    }
    return;
}

function parseSeasons(seasons) {
    return map(seasons, season => {
        return {
            id: +season.season_id,
            title: season.title,
            series: parseSeries(season.series),
        };
    });
}

function parseSeries(data) {
    return map(data, series => ({
        id: +parseInt(series.series_id, 10),
        availableTo: series.available_to,
        duration: +series.duration,
        isPurchased: !!series.is_purchased,
        // lang: "",
        seekTime: series.seek_time,
        poster: series.series_poster,
        title: series.title,
        underParentalProtect: !!series.under_parental_protect,
        viewPercentage: series.view_percentage,
        url: series.url,
    }));
}
