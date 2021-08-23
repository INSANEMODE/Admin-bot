const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle('🏓 Pong : ' + Math.floor(interaction.client.ws.ping) + 'ms')
            .setColor(interaction.client.color)
        interaction.reply({ embeds: [embed] });
	},
};
