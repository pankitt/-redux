import Blowfish from '../utils/blowfish.min';

let BF_K,
    BS = 8,
    K1 = [],
    K2 = [];

export function initializeBlowfish(k, k1, k2) {
    let K = [];
    for (let i = 0; i < (2 * 128 / 8); i += 2) {
        K.push(parseInt(k.slice(i, i + 2), 16));
    }
    BF_K = new Blowfish();
    BF_K.init(K);
    K1 = [];
    K2 = [];

    for (let i = 0; i < (2 * 64 / 8); i += 2) {
        K1.push(parseInt(k1.slice(i, i + 2), 16));
        K2.push(parseInt(k2.slice(i, i + 2), 16));
    }
}

export function cmacbf(data) {
    let prev = [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        last_i, chunk, chunk_raw, n, ciphertext, k;

    if (data.length % BS === 0) {
        last_i = data.length - BS;
    } else {
        last_i = data.length - (data.length % BS);
    }
    for (let i = 0; i < last_i; i += BS) {
        chunk_raw = data.slice(i, i + BS);
        chunk = [];
        for (n = 0; n < chunk_raw.length; n++) {
            chunk.push(chunk_raw.charCodeAt(n) ^ prev[n]);
        }
        ciphertext = BF_K.encrypt_block(chunk);
        prev = [
            ciphertext[3], ciphertext[2], ciphertext[1], ciphertext[0],
            ciphertext[7], ciphertext[6], ciphertext[5], ciphertext[4],
        ];
    }
    let last = data.slice(last_i);
    if (last.length === BS) {
        k = K1;
    } else {
        k = K2;
        last += '\x80';
        for (n = 0; n < BS - last.length; n++) {
            last += '\x00';
        }
    }
    let tag = [];
    for (n = 0; n < BS; n++) {
        tag.push(last.charCodeAt(n) ^ prev[n] ^ k[n]);
    }
    let result = BF_K.encrypt_block(tag);
    result = [
        result[3], result[2], result[1], result[0],
        result[7], result[6], result[5], result[4],
    ];
    let result_hex = '';
    for (n = 0; n < result.length; n++) {
        let i = result[n].toString(16);
        if (i.length === 1) {
            i = '0' + i;
        }
        result_hex += i;
    }
    return result_hex;
}