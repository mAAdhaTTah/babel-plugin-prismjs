/* eslint-env mocha */
import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformSync } from '@babel/core';
import plugin from '../src/index';

describe('PrismJS Configuration', () => {
    const fixturesDir = path.join(__dirname, 'fixtures');

    fs.readdirSync(fixturesDir).map(caseName => {
        const fixtureDir = path.join(fixturesDir, caseName);
        const expectedFile = path.join(fixtureDir, 'expected.js');
        const optionsFile = path.join(fixtureDir, 'options.json');

        it(`should work with ${caseName.split('-').join(' ')}`, () => {
            const actual = transformSync('import Prism from "prismjs";', {
                plugins: [
                    [plugin, require(optionsFile)]
                ],
                babelrc: false
            }).code;
            const expected = fs.readFileSync(expectedFile).toString();
            assert.equal(actual.trim(), expected.trim());
        });
    });
});
