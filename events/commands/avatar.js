import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'

const create = () => {
    const command = new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Lấy avatar của thành viên')
        .addUserOption((option) =>
            option.setName('user').setDescription('Người dùng cần lấy avatar').setRequired(false)
        )

    return command.toJSON()
}

/**
 *
 * @param {import('discord.js').Interaction} interaction
 */
const invoke = async (interaction) => {
    const user = interaction.options.getUser('user') || interaction.user
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 })

    const avatarEmbed = new EmbedBuilder()
        .setColor(0x1d82b6)
        .setTitle(`Hình đại diện của ${user.displayName}`)
        .setImage(avatarUrl)
        .setTimestamp()

    await interaction.reply({
        embeds: [avatarEmbed]
    })
}

export { create, invoke }
