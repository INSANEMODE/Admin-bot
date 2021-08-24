const fetch = require('node-fetch');
const stringtable = require('string-table');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('find')
		.setDescription('searches for a user')
        
        .addStringOption(option =>
            option.setName('user')
                .setDescription('<name | xuid>')
                .setRequired(true)),

    async execute(interaction) {
    var user = interaction.options.getString('user');
    let query;
    if (isNaN(user)) query = "name=" + user;
    else query = "xuid=" + user;

    let response = await fetch(interaction.client.config.webfronturl + '/api/client/find?' + query)
        .catch(() => { console.log('\x1b[31mWarning: ' + interaction.client.config.webfronturl + ' not reachable\x1b[0m') });

    if (!response) return interaction.reply({ephemeral: true, content:"Cannot establish connection to <" + interaction.client.config.webfronturl + ">"});
    if (response.status === 400) return interaction.reply("The length of 'Name' must be at least 3 characters");

    let data = await response.json();
    if (data.totalFoundClients === 0) return interaction.reply({ephemeral: true, content:"No players found with provided " + (isNaN(user) ? 'name' : 'xuid')});

    let arr = data.clients.map(obj => { return { Name: obj.name.replace(/\^[0-9:;c]/g, ''), ClientId: obj.clientId, XUID: obj.xuid } });
    let tad = stringtable.create(arr);

    const fnd = new MessageEmbed()
        .setTitle('Client Search Results')
        .setColor(interaction.client.color)
        .setDescription(`\`\`\`${tad}\`\`\``)
        .setFooter(interaction.client.footer)
    interaction.reply({ embeds: [fnd] });
    },
};

