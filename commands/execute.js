const dbutils = require('../include/dbutils');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('execute')
		.setDescription('gets game servers status')
        
        .addStringOption(option =>
            option.setName('id')
                .setDescription('<serverid | ip:port | serial no. from status cmd>')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('command')
                .setDescription('!<command>')
                .setRequired(true)),

    async execute(interaction) {
    const id = interaction.options.getString('id');
    const command = interaction.options.getString('command');
    if (id.match(/[a-z]/i)) return interaction.reply({ephemeral: true, content:'Incorrect Usage. Example:```css\n' + interaction.client.config.prefix + 'execute <serverid | ip:port | serial no. from status cmd> <!help>```'});

    let dbresponse = await dbutils.getData(interaction.member.id);
    if (!dbresponse) return interaction.reply({ephemeral: true, content:"You need to login to use this command.\nType: `" + interaction.client.config.prefix + "login`"});

    

    if (id.length > 10 && id.length < 20) {
        var serverid = id.replace(/[^0-9]/g, '');
    } 
    else {
        let infos = await interaction.client.function.fetchinfo(interaction.client.config.admin_id);

        if (infos[5].length >= id) {
            let conf = new MessageEmbed()
                .setColor(interaction.client.color)
                .setTitle("Confirmation")
                .setDescription("Do you want to execute this command in " + infos[0][id - 1].replace(/[0-9]+\. /g, '') + "?\n\n click the ``yes`` button to confirm or no to cancel.")
                .setFooter("Server Id: " + infos[5][id - 1].replace(/[^0-9]/g, ''))
            let button1 = new MessageButton()
                .setCustomId('yes')
                .setLabel('Yes')
                .setStyle('PRIMARY')
            let button2 = new MessageButton()
                .setCustomId('no')
                .setLabel('No')
                .setStyle('SECONDARY')
            let row = new MessageActionRow()
            .addComponents([button1, button2]
            );
            let snt = await interaction.reply({ ephemeral: true, embeds: [conf], components: [row] });


                const filter = i => (i.customId === 'yes' || i.customId === 'no') && i.user.id === interaction.user.id;

                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

                collector.on('collect', async i => {
                    if (i.customId === 'yes') {
                        await i.update({ content: 'yes', components: [] });
                    }
                    if (i.customId === 'no') {
                        await i.update({ content: 'no', components: [] });
                    }
                });
                collector.on('end', async (collected) => {
                    button = collected.first().customId;
                    if(button === 'yes')
                    {
                        var serverid = infos[5][id - 1].replace(/[^0-9]/g, '');
                        let data = await interaction.client.function.execute(interaction.client.config.webfronturl, serverid, dbresponse.cookie, command);

                        
                        if (data[0] === 404) return interaction.followUp({ephemeral: true, content:"Cannot establish connection to <" + interaction.client.config.webfronturl + ">"});
                        if (data[0] === 401) return interaction.followUp({ephemeral: true, content:'Your Stored login has been expired. Kindly login again using ' + interaction.client.config.prefix + 'login'});
                        if (data[0] === 400) return interaction.followUp(data[1]);
                    
                        let outmsg = new MessageEmbed()
                            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ format: "png" }))
                            .setColor(interaction.client.color)
                            .setDescription(data[2].toString())
                            .setFooter('Executed in ' + data[1] + ' ms')
                            interaction.followUp({ embeds: [outmsg] });
                    }
                    else if(button === 'no')
                    {
                        return interaction.followUp({ephemeral: true, content:"Execution Cancelled"});
                    }
                
                });


            
        } else {
            return interaction.followUp({ephemeral: true, content:'```css\nServer with provided id not found```'});
        }
    }



    },
};
