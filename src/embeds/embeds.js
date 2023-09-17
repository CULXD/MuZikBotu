const Discord = require('discord.js');
const path = require('path');
const dotenv = require('dotenv');
const { time } = require('console');

const ENV = dotenv.config({ path: path.resolve(__dirname, '../../config.env') }).parsed;

const bot_version = require('../../package.json').version;

const bot_name = typeof (process.env.NAME) === 'undefined' ? 'Music Disc' : (ENV.NAME);
const color = typeof (process.env.COLOR) === 'undefined' ? '#FFFFFF' : (ENV.COLOR);


module.exports = {
    Embed_play: function (status, music_title, music_url, music_length, music_thumbnail, settings, loopStatus) {
        const Embed_play = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .addFields({ name: status, value: `**Duration**: \`${music_length}\` | ${settings}`, inline: true })
            .setTimestamp()
            .setFooter({ text: `Döngü: ${loopStatus}` });
        return Embed_play;
    },

    Embed_queue: function (status, nowplay, queueMsg, loopStatus) {
        const Embed_queue = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(status)
            .addFields({ name: nowplay, value: queueMsg })
            .setTimestamp()
            .setFooter({ text: `Döngü: ${loopStatus}` });
        return Embed_queue;
    },

    Embed_remove: function (status, music_title) {
        const Embed_remove = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(status)
            .setDescription(`${music_title}`)
            .setTimestamp()
        return Embed_remove;
    },

    Embed_save: function (music_title, music_url, music_thumbnail, description, loopStatus) {
        const Embed_queue = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: `Döngü: ${loopStatus}` });
        return Embed_queue;
    },

    Embed_search: function (music_title, description) {
        const Embed_cantFindSong = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setDescription(description)
            .setTimestamp()
        return Embed_cantFindSong;
    },

    Embed_help: function (help_title, help_thumbnail, description, cmd_name, cmd_desc) {
        const Embed_help = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(help_title)
            .setThumbnail(help_thumbnail)
            .setDescription(description)
            .addFields({ name: cmd_name, value: cmd_desc})
            .setTimestamp()
        return Embed_help;
    },

    Embed_status: function (uptime, os, node_v, djs_v, cpu, cpu_usage, ram, ping) {
        const Embed_status = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`${bot_name} v${bot_version}`)
            .addFields(
                { name: `⚙️ Sistem`, value: `OS : **${os}**\nNode.js : **${node_v}**\nDiscord.js : **${djs_v}**\nCPU : **${cpu}**\n━━━━━━━━━━━━━━━━━━━━━━`, inline: false },
                { name: `📊 KULLANIM`, value: `CPU : **${cpu_usage}**\nHAFIZA : **${ram}**\nUptime : **${uptime}**\nPING : **${ping}ms**\n━━━━━━━━━━━━━━━━━━━━━━`, inline: false }
            )
            .setTimestamp()
        return Embed_status;
    },

    Embed_server: function (serverlist) {
        const Embed_server = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(` **${bot_name}**`, '')
            .setDescription(serverlist)
        return Embed_server;
    },

    Embed_ping: function (ping) {
        const Embed_ping = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription(`Ping : **${ping}**ms.`)
        return Embed_ping;
    }
}
