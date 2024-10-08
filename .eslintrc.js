module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["plugin:react/recommended", "airbnb"],
    parser: "babel-eslint",
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
        requireConfigFile: false, // This is important for @babel/eslint-parser
    },
    plugins: ["react"],
    rules: {
        "import/prefer-default-export": "off",
        "import/no-unresolved": "off",
        "react/jsx-filename-extension": "off",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "import/export": "off",
        "class-methods-use-this": "off",
        semi: "off",
        indent: "off",
        "react/jsx-indent": "off",
        camelcase: "off",
        "comma-spacing": "off",
        "import/no-cycle": "off",
        "arrow-parens": "off",
        "global-require": "off",
        "react/jsx-props-no-spreading": "off",
        "react/no-unescaped-entities": "off",
        // "no-use-before-define": "off",
        "max-len": "off",
        "arrow-body-style": "off",
        "react/destructuring-assignment": "off",
        "padded-blocks": "off",
        "react/jsx-closing-tag-location": "off",
        "react/jsx-indent-props": "off",
        "operator-linebreak": "off",
        "import/order": "off",
        "import/no-useless-path-segments": "off",
        "prefer-promise-reject-errors": "off",
        "implicit-arrow-linebreak": "off",
        "react/function-component-definition": "off",
        // 'object-curly-newline': 'off',
        "no-underscore-dangle": "off",
        "no-confusing-arrow": "off",
        "react/no-array-index-key": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-noninteractive-element-to-interactive-role": "off",
        "no-param-reassign": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "no-shadow": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/interactive-supports-focus": "off",
        "react/jsx-no-useless-fragment": "off",
        // 'react/jsx-closing-bracket-location': 'off',
        "react/no-unstable-nested-components": "off",
        "prefer-regex-literals": "off",
        "react/jsx-wrap-multilines": "off",
        "no-promise-executor-return": "off",
        // "jsx-a11y/anchor-is-valid": "off",
        "import/named": "off",
        "react/jsx-one-expression-per-line": "off",
        "no-unused-vars": "off",
        "object-curly-newline": "off",
        "react/jsx-curly-brace-presence": "off",
        "react/self-closing-comp": "off",
        quotes: "off",
        "import/no-duplicates": "off",
        eqeqeq: "off",
        "no-trailing-spaces": "off",
        "no-multiple-empty-lines": "off",
        "eol-last": "off",
        "no-empty-pattern": "off",
        "prefer-const": "off",
        "no-console": "off",
        "no-tabs": "off",
        "react/no-danger": "off",
        "linebreak-style": "off",
        // 'react/jsx-curly-newline': 'off',
        // 'template-curly-spacing': 'off',
        "function-paren-newline": "off",
        "template-curly-spacing": "off",
        "spaced-comment": "off",
        "react/jsx-boolean-value": "off",
        "react/jsx-first-prop-new-line": "off",
        "react/jsx-max-props-per-line": "off",
        "react/button-has-type": "off",
        "comma-dangle": "off",
        "react/jsx-tag-spacing": "off",
        "prefer-template": "off",
        "no-multi-spaces": "off",
        "no-plusplus": "off",
        "import/textensions": "off",
        "jsx-quotes": "off",
        "object-shorthand": "off",
        "import/extensions": "off",
        "react/jsx-closing-bracket-location": "off",
        "import/no-mutable-exports": "off",
        "object-curly-spacing": "off",
        "keyword-spacing": "off",
        "space-before-blocks": "off",
        "prefer-arrow-callback": "off",
        "key-spacing": "off",
        "react/jsx-props-no-multi-spaces": "off",
        "no-unneeded-ternary": "off",
        "consistent-return": "off",
        "no-else-return": "off",
        "jsx-a11y/control-has-associated-label": "off",
        "react/jsx-pascal-case": "off",
        "react/jsx-curly-newline": "off",
        // "no-undef": "off",
        "jsx-a11y/anchor-is-valid": "off",
        "react/jsx-no-bind": "off",
        "no-nested-ternary": "off",
        "react/jsx-curly-spacing": "off",
        "react/no-unknown-property": "off",
        "import/no-extraneous-dependencies": "off",
    },
};
