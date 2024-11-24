import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'

const create = () => {
    const command = new SlashCommandBuilder()
        .setName('vc')
        .setDescription('Đề xuất một cuộc thi')
        .addStringOption(option => 
            option.setName('contestid').setDescription('ID của contest cần đề xuất').setRequired(true)
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