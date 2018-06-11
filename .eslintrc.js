module.exports = {
    extends: [
        "airbnb",
        "prettier",
        "prettier/react"
    ],
    rules:{
        "linebreak-style": ["error", "windows"],
        "jsx-a11y/anchor-is-valid": [ "error", { "components": [ "Link" ], "specialLink": [ "to" ] } ],
        "prettier/prettier": [
            "error",
            {
                "trailingComma": "es5",
                "singleQuote": true,
                "printWidth": 120
            }
        ]
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