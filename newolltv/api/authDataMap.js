export default function authDataMap(response) {
    return {
        id: response.data.userId,
        phoneNumber: response.data.login,
        pusherData: response.data.pusher_data,
        senderWidget: response.data.senderWidget,
        trialDuration: response.data.trial_duration | 0,
        specialOffer: response.data.special_offer,
        redirectTo: response.data.redirectTo,
        hasLocalCDN: !!response.data.hasLocalCDN,
    };
}
