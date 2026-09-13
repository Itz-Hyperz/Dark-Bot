const _config = {

    // Client Settings (REQUIRED)
    token: "YOUR_BOT_TOKEN", // The token from your Discord Dev Portal
    aboutServer: "", // A brief description of your community (Not Required)
    date_format: "MM-DD-YYYY HH:mm", // The date format for the bot

    // Application Settings (REQUIRED)
    themeColor: "blue", // The theme color for the main logger (blue, red, green, yellow, magenta)
    port: "8080", // The port for the bot to listen on
    debugmode: false, // Toggles the logging of errors and excess information

    // MySQL Settings (REQUIRED)
    database: {
        host: "localhost", // The IP of your SQL Server
        user: "root", // The username for your SQL Server
        password: "", // The password for of the user for your SQL Server
        database: "darkbot" // The database designated for the bot
    },

    botOwners: ["704094587836301392", "YOUR_USER_ID"], // The owner Ids of the bot
    defaultLanguage: "english", // The default language for the bot
    cardBgURL: "https://cdn.hyperz.net/main/84VWyU.png", // The URL of the background image for the welcome/leave card (DEFAULT)
    guildLogs: "CHANNEl_ID_HERE", // The ID of the channel to log guild creations/deletions

    // Slash Commands Settings
    commands: {
        ephemeral: false // Will make most slash commands ephemeral (Recommended: false)
    },

    // Presence Settings (REQUIRED)
    presence: {
        name: `Dark Bot`,
        type: "WATCHING",
        status: "dnd"
    }

}

module.exports = _config