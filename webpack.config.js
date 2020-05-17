const path = require("path");

module.exports = 
{
    watch:true, // Cette commande permet de faire en sorte que webpack observe les évolutions de script et lance le build dès qu'il y a enregistrement d'une modification. 
    entry:["babel-polyfill","./src/main.js"],
    mode: 'development',
    output:
    {
        path: path.resolve(__dirname, "dist"),
        filename : "bundle.js"
    },
    devServer:{
        contentBase:path.resolve(__dirname, "dist"),
        open:true
    },
    module:{
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
}