import getComponents from './getComponents';

const CORE = 'prismjs/components/prism-core';

export default ({ types: t }) => ({
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

            for (const component of getComponents(opts).reverse()) {
                path.insertAfter(
                    t.importDeclaration([],t.stringLiteral(component))
                );
            }
        }
    }
});
