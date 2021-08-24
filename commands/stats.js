const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('gets stats for a client')
        
        .addStringOption(option =>
            option.setName('clientid')
                .setDescription('<Client Id> use /find <name> to get')
                .setRequired(true)),

    async execute(interaction) {
    var clientid = interaction.options.getString('clientid');
    const response = await fetch(interaction.client.config.webfronturl + '/api/stats/' + clientid)
        .then((res) => res.json())
        .catch(() => { console.log('\x1b[31mWarning: ' + interaction.client.config.webfronturl + ' not reachable\x1b[0m') });

    if (!response) return interaction.reply({ephemeral: true, content:"Cannot establish connection to <" + interaction.client.config.webfronturl + ">"});
    if (!response.length) return interaction.reply({ephemeral: true, content:"No stats found for client id " + clientid})

    let max = response.length;
    let statmsg = new MessageEmbed()
        .setColor(interaction.client.color)
        .setFooter(interaction.client.footer)
        .setThumbnail(interaction.client.thumbnail)
        .setTitle(response[0].name.replace(/\^[0-9:;c]/g, '') + "'s Stat");

    for (i = 0; i < max; i++) {
        if (response[i]) {
            statmsg.addField("⫸ " + (response[i].serverGame.length === 0 ? "Unknown Game" : interaction.client.function.getgame(response[i].serverGame)[0]), "🔹 Rank: **#** " + response[i].ranking + "\n🔸 KD: " + ((response[i].kills === 0) && (response[i].deaths === 0) ? 0 : (response[i].kills / response[i].deaths).toFixed(2)) + "\n🔹 Kills: " + response[i].kills + "\n🔸 Deaths: " + response[i].deaths + "\n🔹 Performance: " + response[i].performance + "\n🔸 Time played: " + interaction.client.function.timeformat(response[i].totalSecondsPlayed), false);
        }
    }
    interaction.reply({ embeds: [statmsg] });
    },
};
