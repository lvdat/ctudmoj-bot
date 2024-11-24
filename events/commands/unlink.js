import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'

const create = () => {
    const command = new SlashCommandBuilder()
        .setName('unlink')
        .setDescription('Gỡ liên kết tài khoản Discord với CTU DMOJ')

    return command.toJSON()
}

/**
 *
 * @param {import('discord.js').Interaction} interaction
 */
const invoke = async (interaction) => {

}

export { create, invoke }