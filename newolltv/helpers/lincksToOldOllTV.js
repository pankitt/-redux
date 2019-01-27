export function goPayment(subsId) {
    document.cookie = `payBackUrl=${window.location.href}; path=/`;
    window.location.assign('http://' + window.location.hostname + '/payment/' + subsId);
}
