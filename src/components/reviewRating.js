module.exports = async function(client, con, interaction, data, language) {
    let images = [
        "https://media2.giphy.com/media/r7hpLp34YmADINI2W0/giphy.gif",
        "https://c.tenor.com/GAFexEI2-SUAAAAC/kung-fu-panda-review.gif",
        "https://c.tenor.com/_KZCGAjNRQUAAAAC/kitty-review-kitty.gif",
        "https://c.tenor.com/84A1BDpAuDQAAAAC/caroline-cameron-sportsnet.gif"
    ];
    let selected = await client.utils.maths(images)
    await interaction.reply({ content: selected, ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};