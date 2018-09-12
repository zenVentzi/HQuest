const path = require('path');

module.exports = {
    extends: [
        "airbnb",
        "prettier",
        "prettier/react"
    ],
    rules: {
        "no-console": 0,
        "no-unreachable": 1,
        "react/require-default-props": 0,
        "react/prefer-stateless-function": 0,
        "react/sort-comp": 0,
        "no-unused-vars": 1,
        "arrow-body-style": 0,
        'no-underscore-dangle': 0,
        "import/prefer-default-export": 0,
        'no-plusplus': 1,
        "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
        "linebreak-style": ["error", "windows"],
        "jsx-a11y/anchor-is-valid": ["error", { "components": ["Link"], "specialLink": ["to"] }],
        "react/prop-types": "off",
        "no-debugger": "off",
        "prettier/prettier": [
            "error",
            {
                "trailingComma": "es5",
                "singleQuote": true,
                "printWidth": 80
            }
        ]
    },
    'settings': {
        'import/resolver': {
            webpack: {
            config: path.join(__dirname, './webpack/config.js')
        }
      },
    },
    env: {
        "browser": true,
        "es6": true,
        "jest": true,
    },
    parser: "babel-eslint",
    plugins: [
        "prettier"
    ]
};