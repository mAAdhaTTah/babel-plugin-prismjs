import config from 'prismjs/components.js';
import getLoader from 'prismjs/dependencies.js';

const getPath = type => name =>
    `prismjs/${config[type].meta.path.replace(/\{id\}/g, name)}`;

const isPlugin = dep => config.plugins[dep] != null;
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
const getLanguagePath = getPath('languages');

export default ({ languages = [], plugins = [], theme, css = false } = {}) => [
    ...getLoader(config, [...languages, ...plugins]).getIds().reduce((deps, dep) => {
        // Plugins can have language dependencies.
        const add = [isPlugin(dep) ? getPluginPath(dep) : getLanguagePath(dep)];

        if (css && isPlugin(dep) && !getNoCSS('plugins', dep)) {
            add.unshift(getPluginPath(dep) + '.css');
        }

        return [...deps, ...add];
    }, []),
    ...(css && theme ? [getThemePath(theme)] : [])
];
