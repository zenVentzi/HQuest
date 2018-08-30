const path = require('path');

module.exports = {
    extends: [
        "airbnb",
        "prettier",
        "prettier/react"
    ],
    rules: {
        "no-console": "off",
        // "arrow-body-style": 0,
        'no-underscore-dangle': 'off',
        'no-plusplus': 'off',
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
    },
    parser: "babel-eslint",
    plugins: [
        "prettier"
    ]
};