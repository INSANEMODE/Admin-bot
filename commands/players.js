const stringtable = require('string-table');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('gets stats for a client')
        
        .addStringOption(option =>
            option.setName('serverid')
                .setDescription('<serverid | ip:port | serial no. from status cmd>')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('page')
                .setDescription('page number')
                .setRequired(false)),

    async execute(interaction) {
    const id = interaction.options.getString('serverid');
    var page = interaction.options.getInteger('page');

    if (id.match(/[a-z]/i) || id <= 0) return interaction.reply('Incorrect Usage. Example:```css\n' + client.config.prefix + 'players <serverid | ip:port | serial no. from status cmd> <page no.>```');
    if (page) {
        if (page <= 0) return interaction.reply('Incorrect Usage. Example:```css\n' + client.config.prefix + 'players <serverid | ip:port | serial no. from status cmd> <page no.>```');
    }

    const id = id;

    if (id.length > 10 && id.length < 20) {
        var serverid = id.replace(/[^0-9]/g, '');
    } else {
        let infos = await client.function.fetchinfo(client.config.admin_id);
        if (infos[5].length >= id) {
            var serverid = infos[5][id - 1].replace(/[^0-9]/g, '');
        } else {
            return interaction.reply('```css\nServer with provided id not found```');
        }
    }

    let data = await client.function.fetchplayers(client.config.webfronturl, serverid);
    if (data === 400) return interaction.reply("Server with provided id not found");
    if (data === 404) return interaction.reply("Cannot establish connection to <" + client.config.webfronturl + ">");

    if (!data[0]) {
        const empty = new MessageEmbed()
            .setColor(client.color)
            .setDescription("```" + data[1][1] + " is empty```")
            .setFooter("ID: " + data[1][0])
        return interaction.reply({ embeds: [empty] });
    }

    let offset;
    let players = [];
    let max = client.config.results_perpage;
    let less = max - 1;

    pgno = Math.ceil(page);
    const maxpages = Math.ceil((data[0].length / max));
    if (pgno > maxpages) { pgno = pgno - (pgno - maxpages) }
    if (!pgno || pgno <= 1) { offset = 1 } else { offset = pgno * max - less }

    for (i = (offset - 1); i <= (offset - 1) + less; i++) {
        if (data[0][i]) {
            players.push({ No: i + 1, Name: "[" + data[0][i][0] + "] " + data[0][i][1], Score: data[0][i][2], Ping: data[0][i][3] });
        }
    }

    let td = stringtable.create(players);

    const plst = new MessageEmbed()
        .setTitle(data[1][1])
        .setColor(client.color)
        .setDescription(`\`\`\`${td}\`\`\``)
        .setFooter(`Page: ${Math.ceil(offset / max)}/${maxpages}`)
    interaction.reply({ embeds: [plst] });
    },
}
