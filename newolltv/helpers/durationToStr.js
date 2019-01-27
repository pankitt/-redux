export default function durationToStr(duration, withHours = false) {
    return (withHours ? ('0' + (duration / 3600 | 0).toString()).slice(-2) + ':' : '')  +
        ('0' + (duration / 60 % 60 | 0).toString()).slice(-2) + ':' +
        ('0' + (duration % 60 | 0).toString()).slice(-2);
}