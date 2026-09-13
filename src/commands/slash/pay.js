exports.run = async function(client, con, interaction, data, language) {
    let amount = await interaction.options.getString('amount');
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="tickets" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        let deEmbeds = [];
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        if(data.paypal != 'NA') {
            let paypalEmbed = new client.discord.MessageEmbed()
            .setColor(`#427ef5`)
            .setTitle(`PayPal ${language.payments.payment}`)
            .setThumbnail(`https://img.icons8.com/color/452/paypal.png`)
            .setDescription(`**PayPal: ||${data.paypal}||**\n${language.payments.notify}`)
            deEmbeds.push(paypalEmbed)
        };
        if(data.cashapp != 'NA') {
            let cashappEmbed = new client.discord.MessageEmbed()
            .setColor(`#0be000`)
            .setTitle(`Cash App ${language.payments.payment}`)
            .setThumbnail(`https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Square_Cash_app_logo.svg/1200px-Square_Cash_app_logo.svg.png`)
            .setDescription(`**CashApp: ||${data.cashapp}||**\n${language.payments.notify}`)
            deEmbeds.push(cashappEmbed)
        };
        if(data.custompay != 'NA') {
            let customEmbed = new client.discord.MessageEmbed()
            .setColor(`#0f0f0f`)
            .setTitle(language.payments.otherOption)
            .setDescription(`**${language.payments.payment}: ||${data.custom}||**\n${language.payments.notify}`)
            deEmbeds.push(customEmbed)
        };
        let embed = new client.discord.MessageEmbed()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setColor(data.themecolor || '#FFFFFF')
        .setDescription(`**${language.payments.pleasePay} \`${amount}\` ${language.payments.location}**`)
        deEmbeds.push(embed);
        setTimeout(async () => {
            await interaction.reply({ embeds: deEmbeds, ephemeral: false }).catch(e => { if(client.config.debugmode) console.log(e) });
        }, 100)
    });
};

exports.info = {
    "name": "pay",
    "description": "Ask a user to agree to your terms of service.",
    "options": [
      {
        "name": "amount",
        "description": "Please provide the amount and the currency the user should pay.",
        "required": true,
        "type": "STRING"
      }
    ]
}