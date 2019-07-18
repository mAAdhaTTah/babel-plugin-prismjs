import config from 'prismjs/components.js';

const getPath = type => name =>
    `prismjs/${config[type].meta.path.replace(/\{id\}/g, name)}`;

const getName = (type, name) => {
    if (type !== 'languages') {
        return name;
    }

    if (typeof config[type][name] !== 'undefined') {
        return name;
    }

    for (const key in config.languages) {
        if (key === 'meta') {
            continue;
        }

        const { alias } = config.languages[key];

        if (typeof alias === 'string' && alias === name) {
            return key;
        }

        if (Array.isArray(alias) && alias.includes(name)) {
            return key;
        }
    }

    throw new Error(`Language ${name} is invalid. Is this a typo?`);
};
const getRequire = (type, name) => config[type][name].require;
const getPeers = (type, name) => config[type][name].peerDependencies;
const getNoCSS = (type, name) => config[type][name].noCSS;

const getTheme = theme => {
    if (theme === 'default') {
        theme = 'prism';
    } else {
        theme = `prism-${theme}`;
    }

    return getPath('themes')(theme);
};

const getDependencies = (type) => function getDependencies(deps, newDeps) {
    if (!newDeps) {
        return deps;
    }

    if (!Array.isArray(newDeps)) {
        newDeps = [newDeps];
    }

    deps = newDeps.reduce((deps, dep) => {
        dep = getName(type, dep);
        deps = getDependencies(deps, getRequire(type, dep));

        if (!deps.includes(dep)) {
            deps.push(dep);
        }

        return deps;
    }, deps);

    if (type === 'languages') {
        deps.sort((a, b) => {
            const aPeers = getPeers(type, a);
            const bPeers = getPeers(type, b);

            if (aPeers && aPeers.includes(b)) {
                return 1;
            }

            if (bPeers && bPeers.includes(a)) {
                return -1;
            }
            return 0;
        });
    }

    return deps;
};

export default ({ languages = [], plugins = [], theme, css = false } = {}) => [
    ...languages.reduce(getDependencies('languages'), []).map(getPath('languages')),
    ...plugins.reduce(getDependencies('plugins'), []).reduce((deps, dep) => {
        const add = [getPath('plugins')(dep)];

        if (css && !getNoCSS('plugins', dep)) {
            add.unshift(getPath('plugins')(dep) + '.css');
        }

        return [...deps, ...add];
    }, []),
    ...(css && theme ? [getTheme(theme)] : [])
];
