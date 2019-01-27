
export function clearMeta() {
    const meta = document.head.getElementsByTagName('meta');
    for (let i = 0; i < meta.length; i++) {
        let metaEl = meta[i];
        if (metaEl.getAttribute('charset') || metaEl.getAttribute('name') === 'viewport' || metaEl.getAttribute('name') === 'google-site-verification' || metaEl.getAttribute('name') === 'yandex-verification') {
            continue;
        }
        // console.log(metaEl);
        document.head.removeChild(metaEl);
    }
}

export function addMeta(meta, og) {
    clearMeta();
    for (let name in meta) {
        let metaEl = document.createElement('meta');
        // console.log('name', name, 'content', meta[name]);
        metaEl.setAttribute('name', name);
        metaEl.content = meta[name];
        document.head.appendChild(metaEl);
    }
    if (og) {
        addOpenGraph(og);
    }
}

function addOpenGraph(data) {
    for (let property in data) {
        let value = data[property];
        if (typeof value === 'object') {
            for (let structuredProperty in value) {
                let metaEl = document.createElement('meta');
                metaEl.setAttribute('property', `og:${property}:${structuredProperty}`);
                metaEl.content = value[structuredProperty];
                document.head.appendChild(metaEl);
            }
        } else {
            let metaEl = document.createElement('meta');
            metaEl.setAttribute('property', `og:${property}`);
            metaEl.content = value;
            document.head.appendChild(metaEl);
        }
    }
}

export function clearCanonical() {
    const link = document.head.getElementsByTagName('link');
    for (let i = 0; i < link.length; i++) {
        let linkEl = link[i];
        if (linkEl.getAttribute('rel') === 'stylesheet' || linkEl.getAttribute('rel') === 'shortcut icon') {
            continue;
        }
        // console.log(linkEl);
        document.head.removeChild(linkEl);
    }
}

export function addCanonical(pathname) {
    clearCanonical();
    let linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'canonical');
    linkEl.setAttribute('href', 'https://oll.tv/' + pathname);
    document.head.appendChild(linkEl);
}
