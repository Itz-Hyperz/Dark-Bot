exports.run = async function(client, con, interaction, data, language) {
    if(!interaction?.member?.voice?.channel) return interaction.reply({ content: language.noVoiceChannel, ephemeral: true }).catch(e => {});
    let game = interaction.options.get("game")?.value;
    let code = await client.games.createTogetherCode(interaction.member.voice.channelId, game)  
    return interaction.reply({ content: `${language.games.yourLink} ${code.code}`, ephemeral: true });
};

exports.info = {
    "name": "games",
    "description": "Select a game to play in your voice channel.",
    "options": [
      {
        "name": "game",
        "description": "Select a game to play.",
        "required": true,
        "type": "STRING",
        "choices": [
          {
            "name": "Poker",
            "value": "poker"
        },
          {
            "name": "Youtube",
            "value": "youtube"
        },
          {
            "name": "Chess",
            "value": "chess"
        },
          {
            "name": "Betrayal",
            "value": "betrayal"
        },
          {
            "name": "Fishing",
            "value": "fishing"
        },
          {
            "name": "Crazy 8's",
            "value": "ocho"
        },
          {
            "name": "Checkers",
            "value": "checkers"
        },
          {
            "name": "Letter Tile",
            "value": "lettertile"
        },
          {
            "name": "Word Snack",
            "value": "wordsnack"
        },
          {
            "name": "Doodle Crew",
            "value": "doodlecrew"
        },
          {
            "name": "Spell Cast",
            "value": "spellcast"
        },
          {
            "name": "Sketch Heads",
            "value": "Sketch Heads"
          }
        ]
      }
    ]
}