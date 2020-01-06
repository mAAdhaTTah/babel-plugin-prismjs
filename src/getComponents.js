import config from 'prismjs/components.js';
import getLoader from 'prismjs/dependencies.js';

const getPath = type => name =>
    `prismjs/${config[type].meta.path.replace(/\{id\}/g, name)}`;

const getNoCSS = (type, name) => config[type][name].noCSS;

const getThemePath = theme => {
    if (theme === 'default') {
        theme = 'prism';
    } else {
        theme = `prism-${theme}`;
    }

    return getPath('themes')(theme);
};

const getPluginPath = getPath('plugins');

export default ({ languages = [], plugins = [], theme, css = false } = {}) => [
    ...getLoader(config, languages).getIds().map(getPath('languages')),
    ...getLoader(config, plugins).getIds().reduce((deps, dep) => {
        const add = [getPluginPath(dep)];

        if (css && !getNoCSS('plugins', dep)) {
            add.unshift(getPluginPath(dep) + '.css');
        }

        return [...deps, ...add];
    }, []),
    ...(css && theme ? [getThemePath(theme)] : [])
];
