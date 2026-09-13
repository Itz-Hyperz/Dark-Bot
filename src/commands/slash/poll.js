const options = [
    {
      "name": "question",
      "description": "The question of the poll.",
      "required": true,
      "type": "STRING"
    },
    {
      "name": "option_1",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    },
    {
      "name": "option_2",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    },
    {
      "name": "option_3",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    },
    {
      "name": "option_4",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    },
    {
      "name": "option_5",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    },
    {
      "name": "option_6",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    },
    {
      "name": "option_7",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    },
    {
      "name": "option_8",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    },
    {
      "name": "option_9",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    },
    {
      "name": "option_10",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    }
  ]
exports.run = async function(client, con, interaction, data, language) {
    await con.query(`SELECT * FROM perms WHERE guildid="${interaction.guild.id}" AND permtype="mod" OR guildid="${interaction.guild.id}" AND permtype="admin"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return interaction.reply({ content: language.noPermissions, ephemeral: true }).catch(e => {});
        let granted = 0;
        await row.forEach(async (r) => {
            if(interaction.member.roles.cache.has(r.roleid)) {
                granted = 1;
            }
        });
        if(granted == 0) return interaction.reply({ content: language.missingPermissions, ephemeral: true }).catch(e => {});
        let question;
        let pick = [];
        let r = [];
        await options.forEach(async (o) => {
            if(o.name == 'question') {
                question = await interaction.options.getString('question');
            } else {
                let option = await interaction.options.getString(o.name);
                if(option != undefined) {
                    switch(o.name) {
                        case 'option_1':
                            pick.push(`1️⃣ **-** ${option}`);
                            r.push('1️⃣');
                            break;
                        case 'option_2':
                            pick.push(`2️⃣ **-** ${option}`);
                            r.push('2️⃣');
                            break;
                        case 'option_3':
                            pick.push(`3️⃣ **-** ${option}`);
                            r.push('3️⃣');
                            break;
                        case 'option_4':
                            pick.push(`4️⃣ **-** ${option}`);
                            r.push('4️⃣');
                            break;
                        case 'option_5':
                            pick.push(`5️⃣ **-** ${option}`);
                            r.push('5️⃣');
                            break;
                        case 'option_6':
                            pick.push(`6️⃣ **-** ${option}`);
                            r.push('6️⃣');
                            break;
                        case 'option_7':
                            pick.push(`7️⃣ **-** ${option}`);
                            r.push('7️⃣');
                            break;
                        case 'option_8':
                            pick.push(`8️⃣ **-** ${option}`);
                            r.push('8️⃣');
                            break;
                        case 'option_9':
                            pick.push(`9️⃣ **-** ${option}`);
                            r.push('9️⃣');
                            break;
                        case 'option_10':
                            pick.push(`🔟 **-** ${option}`);
                            r.push('🔟');
                            break;
                    };
                };
            };
        });
        if(!question.includes('?') && !question.includes('!') && !question.includes('.') ) {
            question = question + '?';
        };
        let pollEmbed = new client.discord.MessageEmbed()
        .setColor(data.themecolor || '#FFFFFF')
        .setAuthor({ name: question })
        .setDescription(pick.join('\n'));
        await interaction.reply({ content: language.poll.posted, ephemeral: true }).catch(e => {})
        await interaction.channel.send({ embeds: [pollEmbed] }).then(async (m) => {
            await r.forEach(async (e) => {
                await m.react(e).catch(e => {});
            });
        }).catch(e => {});
    });
};

exports.info = {
  "name": "poll",
  "description": "Create a poll.",
  "options": [
    {
      "name": "question",
      "description": "The question of the poll.",
      "required": true,
      "type": "STRING"
  },
    {
      "name": "option_1",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
  },
    {
      "name": "option_2",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
  },
    {
      "name": "option_3",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
  },
    {
      "name": "option_4",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
  },
    {
      "name": "option_5",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
  },
    {
      "name": "option_6",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
  },
    {
      "name": "option_7",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
  },
    {
      "name": "option_8",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
  },
    {
      "name": "option_9",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
  },
    {
      "name": "option_10",
      "description": "An option for the poll.",
      "required": false,
      "type": "STRING"
    }
  ]
}