import getComponents from './getComponents';

const CORE = 'prismjs/components/prism-core';

export default ({ types: t }, options) => {
    if (typeof options === 'undefined') {
        throw new Error('No configuration passed to babel-plugin-prismjs. Did you forget to provide one?');
    }

    if (!Array.isArray(options.languages) || options.languages.length === 0) {
        throw new Error('No languages passed to babel-plugin-prismjs. Did you forget to include them?');
    }

    return ({
        name: 'prismjs',
        visitor: {
            ImportDeclaration(path, { opts }) {
                if (path.node.source.value !== 'prismjs') {
                    return;
                }

                path.replaceWith(t.importDeclaration(
                    path.node.specifiers,
                    t.stringLiteral(CORE)
                ));

                path.insertAfter(
                    getComponents(opts)
                        .map(component => t.importDeclaration([],t.stringLiteral(component)))
                );
            }
        }
    });
};
