const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('gets detailed info for a server')
        
        .addIntegerOption(option =>
            option.setName('server')
                .setDescription('use a server number from /status')
                .setRequired(true)),

    async execute(interaction) {
    var server = interaction.options.getInteger('server');
    let infos = await interaction.client.function.fetchinfo(interaction.client.config.admin_id);
    if (!infos) return interaction.reply({ephemeral: true, content:'```css\nInstance with the provided admin id is not found```'});

    let sername = infos[0];
    let inp = server - 1;

    if (!sername[inp]) return interaction.reply({ephemeral: true, content:'```css\nInstance with the provided server number is not found use status to get all avaiable numbers```'});
    let data = interaction.client.function.getinfo(infos[6][inp], infos[5][inp], infos[4][inp]);
    let mapdata = interaction.client.function.getmap(infos[3][inp], infos[7][inp]);

    let msg = new MessageEmbed()
        .setTitle('Serverinfo')
        .setColor(interaction.client.color)
        .setThumbnail(mapdata[1].replace(/na/g, interaction.client.thumbnail))
        .addField('Hostname', sername[inp].replace(/[0-9]+\. /g, '🔹 '), false)
        .addField('Players', infos[1][inp] + '/' + infos[2][inp], true)
        .addField('Gametype', interaction.client.function.getmode(infos[4][inp]).toString(), true)
        .addField('Map', mapdata[0], false)
        .addField('Client', data[0] + ' [[Connect](https://applauncher.herokuapp.com/redirect?url=' + data[1] + ')]', true)
        .setFooter('ID: ' + infos[5][inp].replace(/[^0-9]/g, ''), interaction.client.function.getgame(infos[7][inp])[1].replace(/ukn/g, interaction.client.thumbnail))
    interaction.reply({ embeds: [msg] });
    },
};
