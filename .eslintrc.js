module.exports = {
    extends: "airbnb",
    rules:{
        "linebreak-style": ["error", "windows"],
        "jsx-a11y/anchor-is-valid": [ "error", { "components": [ "Link" ], "specialLink": [ "to" ] } ]
    },
    env: {
        "browser": true,
        "es6": true,
    },
    parser: "babel-eslint",
    // parserOptions: {
    //     sourceType: "module"
    //   }
};