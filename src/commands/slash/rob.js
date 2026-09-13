exports.run = async function(client, con, interaction, data, language) {
    let user = await interaction.options.getUser('user');
    await con.query(`SELECT * FROM economyusers WHERE guildid='${interaction.guild.id}' AND userid='${user.id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0].robCooldown == 'true') return interaction.reply({ content: language.economy.rob.cooldown, ephemeral: true }).catch(e => {});
        let thetake;
        if(row[0].balance <= 10) return interaction.reply({ content: language.economy.rob.tooLittleMoney, ephemeral: true }).catch(e => {});
        if(row[0].balance < 50) {
            thetake = 19
        } else if(row[0].balance < 100) {
            thetake = 53
        } else if(row[0].balance < 150) {
            thetake = 78
        } else if(row[0].balance < 200) {
            thetake = 89
        } else if(row[0].balance < 250) {
            thetake = 127
        } else if(row[0].balance < 500) {
            thetake = 200
        } else if(row[0].balance < 750) {
            thetake = 346
        } else if(row[0].balance < 1000) {
            thetake = 476
        } else {
            thetake = 865
        }
        setTimeout(async () => {
            await con.query(`UPDATE economyusers SET balance = balance + ${thetake}, robCooldown='true' WHERE userid='${interaction.user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
                if(err) throw err;
            });
            await con.query(`UPDATE economyusers SET balance = balance - ${thetake} WHERE userid='${user.id}' AND guildid='${interaction.guild.id}'`, async (err, row) => {
                if(err) throw err;
            });
            interaction.reply({ content: `${language.economy.rob.robbed} ${user.tag} ${language.economy.rob.for} ${data.currency}${thetake}` }).catch(e => {});
            let logembed = new client.discord.MessageEmbed()
            .setColor(data.themecolor || '#FFFFFF')
            .setAuthor({ name: `${interaction.user.tag} - ${language.economy.rob.robbery}`, iconURL: client.user.displayAvatarURL() })
            .addFields(
                { name: language.economy.rob.amount, value: `${data.currency}${thetake}`, inline: true },
                { name: language.economy.rob.from, value: `${user.tag}`, inline: true },
            )
            .setTimestamp()
            await client.utils.sendLog(client, con, data, 'economylogs', logembed);
            setTimeout(async () => {
                await con.query(`UPDATE economyusers SET robCooldown='false' WHERE userid='${interaction.user.id}'`, async (err, row) => {
                    if(err) throw err;
                });
            }, 7200000)
        }, 200)
    });
};

exports.info = {
    "name": "rob",
    "description": "Rob a user.",
    "options": [
      {
        "name": "user",
        "description": "The user to rob.",
        "required": true,
        "type": "USER"
      }
    ]
}