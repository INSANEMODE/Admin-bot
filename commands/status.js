const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('gets game servers status')
        
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('gets the specified page number')
                .setRequired(false)),

    async execute(interaction) {
    var page = interaction.options.getInteger('page');
    //if (args[0] && isNaN(args[0])) return interaction.reply('```css\nFormat:\nstatus <page number>```');
    let infos = await interaction.client.function.fetchinfo(interaction.client.config.admin_id);
    if (!infos) return interaction.reply('```css\nInstance with the provided admin id is not found```');

    let offset;
    let sername = infos[0];
    let onlineplayers = infos[1];
    let totalplayers = infos[2];
    let mapcode = infos[3];
    let gamename = infos[7];
    let max = interaction.client.config.results_perpage;
    let less = max - 1;

    let stat = new MessageEmbed()
        .setTitle('Status')
        .setColor(interaction.client.color)
        .setThumbnail(interaction.client.thumbnail);

    page = Math.ceil(page);
    const maxpages = Math.ceil((totalplayers.length / max));
    if (page > maxpages) { page = page - (page - maxpages) }
    if (!page || page <= 1) { offset = 1 } else { offset = page * max - less }

    for (i = (offset - 1); i <= (offset - 1) + less; i++) {
        if (sername[i]) {
            stat.addField(sername[i], interaction.client.function.getmap(mapcode[i], gamename[i])[0] + ' - ' + onlineplayers[i] + '/' + totalplayers[i], false);
        }
    }

    stat.setFooter(`Page: ${Math.ceil(offset / max)}/${maxpages}`);
    interaction.reply({ embeds: [stat] });
    },
};

