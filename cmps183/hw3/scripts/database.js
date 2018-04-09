function canUseLocalStorage() {
    try {
        localStorage.setItem('test', 'b');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

function canUseSessionStorage() {
    try {
        sessionStorage.setItem('test', 'b');
        sessionStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

function storageWrapper(store) {
    const storeString = store.getItem('store');
    const str = storeString ? JSON.parse(storeString) : [];
    window.onbeforeunload = function () {
        store.setItem('store', JSON.stringify(str));
    };
    return str;
}

function urlWrapper() {
    const links = document.getElementsByTagName('a');
    const store = new URL(window.location.href).searchParams.get('store');
    const args = store ? JSON.parse(decodeURI(store)) : [];
    links.forEach(l => {
        l.onclick = (event) => {
            event.target.href = `${event.target.href}?store=${encodeURI(JSON.stringify(args))}`
        }
    })
    return args;
}

const DB = canUseLocalStorage() ? storageWrapper(localStorage) :
    canUseSessionStorage() ? storageWrapper(sessionStorage) :
        urlWrapper();





