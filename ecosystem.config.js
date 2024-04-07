module.exports = {
    apps: [
        {
            name: "ml-tracker",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 8888",
            watch: false,
        },
    ],
};