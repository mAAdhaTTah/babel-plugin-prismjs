import config from 'prismjs/components.js';

const getPath = (type, name) =>
    `prismjs/${config[`${type}`].meta.path.replace(/\{id\}/g, name)}`;

const getRequire = (type, name) => config[type][name].require;
const getNoCSS = (type, name) => config[type][name].noCSS;

const getTheme = theme => {
    if (theme === 'default') {
        theme = 'prism';
    } else {
        theme = `prism-${theme}`
    }

    return getPath('themes', theme);
};

const getDependencies = (type, css) => function getDependencies(deps, require) {
    if (!require) {
        return deps;
    }

    if (!Array.isArray(require)) {
        require = [require];
    }

    return require.reduce((deps, name) => {
        deps = getDependencies(deps, getRequire(type, name));

        if (deps.indexOf(getPath(type, name)) === -1) {
            const add = [];

            if (css && type === 'plugins' && !getNoCSS(type, name)) {
                add.push(getPath(type, name) + '.css')
            }

            add.push(getPath(type, name));

            deps = [...deps, ...add];
        }

        return deps;
    }, deps);
};

export default ({ languages = [], plugins = [], theme, css = false } = {}) => [
    ...languages.reduce(getDependencies('languages'), []),
    ...plugins.reduce(getDependencies('plugins', css), []),
    ...(css && theme ? [getTheme(theme)] : [])
];
