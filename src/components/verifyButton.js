const Captcha = require("captcha-generator-alphanumeric").default;
module.exports = async function(client, con, interaction, data, language) {
    if(data.captcha) {
        let captcha = new Captcha();
        let lol = new client.discord.MessageAttachment(captcha.JPEGStream, "captcha.jpeg")
        let captchaEmbed = new client.discord.MessageEmbed()
            .setTitle(language.components.verifyButton.humanVerify)
        .setColor(data.themecolor || '#FFFFFF')
            .setDescription(language.components.verifyButton.desc1)
        .setTimestamp()
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        await interaction.user.send({ embeds: [captchaEmbed], files: [lol] }).then(async (msg) => {
            await interaction.reply({ content: language.components.verifyButton.content1, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
            const filter = (m) => m.author.id == interaction.user.id;
            const collector = msg.channel.createMessageCollector({ filter, time: 150000 });
            let attempts = 3;
            collector.on('collect', async (m) => {
                if (m.content.toUpperCase() !== captcha.value) {
                    attempts = attempts - 1;
                    if (attempts == 0) {
                        await msg.channel.send({ content: language.components.verifyButton.noleft }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                        return;
                    } else {
                        await msg.channel.send({ content: `${language.components.verifyButton.left1}${attempts}${language.components.verifyButton.left2}` }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                        return;
                    };
                } else {
                    msg.channel.send({ content: language.components.verifyButton.youverifed }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                    await con.query(`SELECT * FROM autoroles WHERE guildid='${interaction.guild.id}' AND verify=true`, async (err, row) => {
                        if(err) throw err;
                        await row.forEach(async (r) => {
                            if(!interaction?.member?.roles?.cache?.has(r.roleid)) {
                                await interaction.member.roles.add(r.roleid).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                            };
                        });
                    });
                    collector.stop();
                };
            });
        }).catch(async (e) => {
            await interaction.reply({ content: language.components.verifyButton.dmsna, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        });
    } else {
        await con.query(`SELECT * FROM autoroles WHERE guildid='${interaction.guild.id}' AND verify=true`, async (err, row) => {
            if(err) throw err;
            await row.forEach(async (r) => {
                if(!interaction?.member?.roles?.cache?.has(r.roleid)) {
                    await interaction.member.roles.add(r.roleid).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
                };
            });
            interaction.reply({ content: language.components.verifyButton.youverifed, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
        });
    };
};