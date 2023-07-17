const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Colors, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const main_config = require('../../assets/main_config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Test Command')
    .setDefaultMemberPermissions(null),
  permissions: ['ADMINISTRATOR'],
  execute: async (interaction) => {
    const userEmbed = new EmbedBuilder()
      .setDescription("> Du hast erfolgreich die Regeln gesendet!")
      .setColor(Colors.Green)
      .setTimestamp()
      .setFooter({
        text: main_config.defaultFooter,
        iconURL: 'https://media.discordapp.net/attachments/1042537693608947843/1129722079919484989/mn_server_logo_animated.gif'
      });


    const publicEmbed = new EmbedBuilder()
      .setTitle("Mongo (-) Rules")
      .setTimestamp()
      .addFields(
        { name: '**1:** Be respectful', value: '> Treat others with respect, kindness, and empathy. Avoid offensive language, personal attacks, and discrimination.', inline: false },
        { name: '**2:** Use appropriate channels', value: '> Post messages in the relevant channels to keep discussions organized and easily searchable. Avoid spamming or posting unrelated content.', inline: false },
        { name: '**3:** Stay on topic', value: '> Keep conversations focused on the subject at hand. Avoid derailing discussions with unrelated or off-topic comments.', inline: false },
        { name: '**4:** Use clear and concise language', value: '> Communicate your thoughts and ideas clearly to avoid confusion. Use proper grammar and punctuation.', inline: false },
        { name: '**5:** Listen actively', value: '> Pay attention to what others are saying and respond accordingly. Avoid interrupting or dominating conversations.', inline: false },
        { name: '**6:** Be open-minded', value: '> Respect different opinions and perspectives. Engage in constructive discussions, and be willing to reconsider your viewpoint if presented with valid arguments.', inline: false },
        { name: '**7:** Use appropriate tone', value: '> Consider the tone of your messages and strive to maintain a friendly and positive atmosphere. Avoid excessive use of capital letters or aggressive language.', inline: false },
        { name: '**8:** Provide constructive feedback', value: '> If you have feedback to offer, do so in a constructive and respectful manner. Focus on the issue at hand rather than attacking the person.', inline: false },
        { name: '**9:** Use appropriate humor', value: '> Humor can be a great way to connect, but be mindful of cultural differences and sensitive topics. Avoid jokes that may offend or hurt others.', inline: false },
        { name: '**10:** Report issues', value: '>  If you encounter any violations of the rules or witness inappropriate behavior, report it to the moderators or administrators. Help maintain a safe and welcoming community.', inline: false },
      )
      .setFooter({
        text: main_config.defaultFooter,
        iconURL: 'https://media.discordapp.net/attachments/1042537693608947843/1129722079919484989/mn_server_logo_animated.gif'
      });

    const row = new ActionRowBuilder().addComponents(new ButtonBuilder()
      .setLabel('Accept rules')
      .setStyle('Link')
      .setURL('https://discord.com/oauth2/authorize?client_id=1129711538287149147&redirect_uri=http%3A%2F%2Flocalhost%3A1337%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify'))


    await interaction.channel.send({ embeds: [publicEmbed], components: [row] });
    await interaction.reply({
      embeds: [userEmbed],
      ephemeral: true,
    });
  }
};