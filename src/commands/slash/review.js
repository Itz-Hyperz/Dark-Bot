exports.run = async function(client, con, interaction, data, language) {

    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="customers" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});

        let service = await interaction.options.getString('service');
        let rating = await interaction.options.getInteger('rating');
        let review = await interaction.options.getString('message');

        if(rating > 5) {
            rating = 5;
        } else if(rating < 1) {
            rating = 1;
        };

        let reviewButtons = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setStyle('PRIMARY')
            .setLabel(`⭐ ${rating}`)
            .setCustomId('reviewRating')
        )
        .addComponents(
            new client.discord.MessageButton()
            .setStyle('SECONDARY')
            .setLabel(language.reviews.reply)
            .setCustomId('reviewReply')
        )

        let reviewEmbed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: `${language.reviews.newReview} ${interaction.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
        .setTitle(service)
        .setDescription(review)
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })

        await interaction.reply({ content: language.reviews.posted, ephemeral: true }).catch(e => {});
        await client.utils.sendLog(client, con, data, 'reviewlogs', reviewEmbed, { components: [reviewButtons] })
    });
};

exports.info = {
    "name": "review",
    "description": "Write a review as a customer.",
    "options": [
      {
        "name": "service",
        "description": "What you purchased / bought.",
        "required": true,
        "type": "STRING"
    },
      {
        "name": "rating",
        "description": "What you rate the product out of 5.",
        "required": true,
        "type": "INTEGER"
    },
      {
        "name": "message",
        "description": "Leave a message with your review.",
        "required": true,
        "type": "STRING"
      }
    ]
}