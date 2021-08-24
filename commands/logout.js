const fetch = require('node-fetch');
const dbutils = require('../include/dbutils');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('logout')
		.setDescription('log out of the bot'),


    async execute(interaction) {
    let dbres = await dbutils.getData(interaction.member.id);
    if (!dbres) return interaction.reply({ephemeral: true, content:"You are not logged in"});

    const response = await fetch(interaction.client.config.webfronturl + '/api/client/' + dbres.client_id + '/logout', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': dbres.cookie } })
        .catch(() => { console.log('\x1b[31mWarning: ' + interaction.client.config.webfronturl + ' not reachable\x1b[0m') });

    if (!response) return interaction.reply({ephemeral: true, content:"Cannot establish connection to <" + interaction.client.config.webfronturl + ">"});
    if (!(response.status == 200)) return interaction.reply({ephemeral: true, content:"Failed to logout please try again later"});

    dbutils.deleteData(interaction.member.id);
    interaction.reply({ephemeral: true, content:"You have been successfully logged out!"});
    },
};

