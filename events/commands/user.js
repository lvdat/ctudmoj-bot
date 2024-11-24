import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'

const create = () => {
    const command = new SlashCommandBuilder()
        .setName('user')
        .setDescription('Xem thông tin người dùng cùng các submit mới nhất')
        .addStringOption((option) =>
            option
                .setName('username')
                .setDescription('Username tài khoản CTUDMOJ')
                .setRequired(true)
        )

    return command.toJSON()
}

/**
 *
 * @param {import('discord.js').Interaction} interaction
 */
const invoke = async (interaction) => {}

export { create, invoke }
