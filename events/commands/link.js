import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import db from '../../core/database.js'

const create = () => {
    const command = new SlashCommandBuilder()
        .setName('link')
        .setDescription('Liên kết tài khoản Discord với CTU DMOJ')
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
const invoke = async (interaction) => {
    db.sequelize.sync()
}

export { create, invoke }
