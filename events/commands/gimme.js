import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'

const create = () => {
    const command = new SlashCommandBuilder()
        .setName('gimme')
        .setDescription('Đề xuất một bài')
        .addStringOption(option => 
            option.setName('problemid').setDescription('ID của bài cần đề xuất').setRequired(true)
        )

    return command.toJSON()
}

/**
 *
 * @param {import('discord.js').Interaction} interaction
 */
const invoke = async (interaction) => {

}

export { create, invoke }