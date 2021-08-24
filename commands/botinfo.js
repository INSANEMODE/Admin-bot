const os = require('os');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('Gets info for the bot.'),
    
    async execute(interaction){
    let delay = ms => new Promise(res => setTimeout(res, ms));

    function cpuaverage() {
        var totalIdle = 0, totalTick = 0;
        var cpus = os.cpus();
        for (var i = 0, len = cpus.length; i < len; i++) {
            var cpu = cpus[i];
            for (type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        }
        return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
    }

    async function msg() {
        var startMeasure = cpuaverage();
        await delay(100);
        var endMeasure = cpuaverage();
        var percentagecpu = 100 - ~~(100 * (endMeasure.idle - startMeasure.idle) / (endMeasure.total - startMeasure.total));

        let emb = new MessageEmbed()
            .setTitle("Bot Info")
            .setColor(interaction.client.color)
            .setThumbnail(interaction.client.thumbnail)
            .addField("Bot's memory usage [" + ((process.memoryUsage().heapUsed / os.totalmem()) * 100).toFixed(2) + "%]", (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB / " + (((os.totalmem() / 1024) / 1024) / 1024).toFixed(2) + " GB", true)
            .addField("Cpu usage [" + percentagecpu + "%]", (process.cpuUsage().user / 1024 / 1024).toFixed(2) + " MB | " + os.cpus().length + (os.cpus().length === 1 ? " Core" : " Cores"), true)
            .addField("\u200b", "\u200b", true)
            .addField("Mem usage [" + Math.floor(((os.totalmem() - os.freemem()) / os.totalmem()) * 100) + "%]", ((((os.totalmem() - os.freemem()) / 1024) / 1024) / 1024).toFixed(2) + " GB / " + (((os.totalmem() / 1024) / 1024) / 1024).toFixed(2) + " GB", true)
            .addField("Node Js version", process.versions.node, true)
            .addField("\u200b", "\u200b", true)
            .addField("Platform", process.platform.replace(/win32/g, "Windows"), true)
            .addField("Architecture", os.arch(), true)
            .addField("\u200b", "\u200b", true)
            .addField("Bot's Uptime", interaction.client.function.timeformat(interaction.client.uptime / 1000), false)
            .setFooter(interaction.client.footer)
        interaction.reply({ embeds: [emb] });
        
    }

    if (interaction.client.config.ownerid)
        if (interaction.member.id === interaction.client.config.ownerid) msg();
        else interaction.reply('```css\nThis command is locked for owner```');
    else msg();
    },
};


