const fetch = require('node-fetch');
const dbutils = require('../include/dbutils');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('login')
		.setDescription('!rt in game, or request token on webfront to get login info')
        
        .addIntegerOption(option =>
            option.setName('clientid')
                .setDescription('client id')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('token')
                .setDescription('login token')
                .setRequired(false)),

    async execute(interaction) {
    var clientid = interaction.options.getInteger('clientid');
    var token = interaction.options.getString('token');
    // let strdmsg = await message.author.send("➤ Please send your id and password in this format : YourId Password\n➤ Example: ```234 supersecretpass```")
    //     .catch(() => message.reply("📬 Your DM is closed. Kindly make sure your DM is open."));

    // if (strdmsg.channel.type != 'DM') return;

    // message.channel.send("🔐 You are asked for id and password for <" + interaction.client.config.webfronturl + ">");

    // const answer = await message.author.dmChannel.awaitMessages({ filter: m => m.content.split(' ').length === 2, max: 1, time: 30000, errors: ["time"] })
    //     .catch(() => {
    //         strdmsg.edit("Timeout! login create cancelled");
    //     });

    // if (!answer) return;
    // let info = answer.first().content.split(' ');
    if (isNaN(clientid)) return interaction.reply({ephemeral: true, content:"Incorrect login details provided. Client id must be a number. Login create cancelled"});

    const response = await fetch(interaction.client.config.webfronturl + '/api/client/' + clientid + '/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: `{"password":"` + token + `"}` })
        .catch(() => { console.log('\x1b[31mWarning: ' + interaction.client.config.webfronturl + ' not reachable\x1b[0m') });

    if (!response) return interaction.reply({ephemeral: true, content:"Cannot establish connection to <" + interaction.client.config.webfronturl + ">"});
    if (!(response.status == 200)) return interaction.reply({ephemeral: true, content:"Incorrect login details provided. Login create cancelled"});

    var value = response.headers.get('set-cookie').split(';').findIndex(element => element.includes(".AspNetCore.Cookies"));
    dbutils.insertData(interaction.member.id, clientid, response.headers.get('set-cookie').split(';')[value]);

    interaction.reply({ephemeral: true, content:"Success! your login is successfully stored.\nNote: We do not know or store your id and password"});
    },
};

