exports.run = async function(client, con, interaction, data, language) {

        const https = require('https');
        const url = `https://www.reddit.com/r/meme/hot/.json?limit=100`

        await interaction.reply({ content: language.meme.grabbing }).catch(e => {})
        
        setTimeout(async function() {
            https.get(url, (result) => {
                var body = ''
                result.on('data', (chunk) => {
                    body += chunk
                })
    
                result.on('end', () => {
                    var response = JSON.parse(body)
                    var index = response.data.children[Math.floor(Math.random() * 99) + 1].data
    
                    if (index.post_hint !== 'image') {
    
                        const textembed = new client.discord.MessageEmbed()
                            .setColor(`${data.themecolor || '#FFFFFF'}`)
                            .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({dynamic: true})}` })
                            .setTimestamp()
                            
    
                        interaction.editReply({ content: language.meme.hereYaGo, embeds: [textembed] }).catch(e => {})
                    }
    
                    var image = index.preview.images[0].source.url.replace('&amp;', '&')
    
                    if (index.post_hint !== 'image') {
                        const textembed = new client.discord.MessageEmbed()
                            .setColor(`${data.themecolor || '#FFFFFF'}`)
                            .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({dynamic: true})}` })
                            .setTimestamp()
    
                            interaction.editReply({ content: language.meme.hereYaGo, embeds: [textembed] }).catch(e => {})
                    }
                    const imageembed = new client.discord.MessageEmbed()
                        .setImage(image)
                        .setColor(`${data.themecolor || '#FFFFFF'}`)
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({dynamic: true})}` })
                        .setTimestamp()
                        
                        interaction.editReply({ content: language.meme.hereYaGo, embeds: [imageembed] }).catch(e => {})
                }).on('error', function (e) {
                    if(client.config.debugmode) return console.log(e);
                });
            });
        }, 2500);

}

exports.info = {
    "name": "meme",
    "description": "Get a meme!"
}