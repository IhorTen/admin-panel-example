var version = require("./version")

module.exports = (shipit) => {
    const directories = {
        production: {
            dir: "/home/guest/app"
        }
    }

    shipit.initConfig({
        production: {
            servers: [
                {
                    host: "35.225.166.74",
                    user: "guest"
                }
            ]
        }
    })

    shipit.task("deploy", async () => {
        var dirname = directories[shipit.environment].dir
        try {
            await shipit.remote("rm -rf ssr", { cwd: dirname })
        } catch (e) {
            // fall silently
        }
        await shipit.copyToRemote("package.json", dirname)
        await shipit.copyToRemote("./ssr/dist", `${dirname}/ssr`)
        await shipit.copyToRemote(`./dist/${version.v()}`, `${dirname}/dist`)
        await shipit.remote("pm2 restart ssr", { cwd: dirname })
    })

    shipit.task("deploy:static", async () => {
        var dirname = directories[shipit.environment].dir
        try {
            await shipit.remote("rm -rf static", { cwd: dirname })
        } catch (e) {}
        await shipit.copyToRemote("./static", dirname)
    })
}