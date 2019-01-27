export function inflect(count, forms) {
    let modulo = count % 10;
    if (!modulo || modulo > 4 || ((count % 100) > 10 && (count % 100) < 20)) {
        return forms[2];
    }
    return modulo === 1 ? forms[0] : forms[1];
}
