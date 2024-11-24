const once = false
const name = 'interactionCreate'

/**
 *
 * @param {import("discord.js").Interaction} interaction
 */
async function invoke(interaction) {
    if (interaction.isChatInputCommand()) {
        ;(await import(`#commands/${interaction.commandName}`)).invoke(interaction)
        console.log(
            `[${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}] ${interaction.user.tag} used /${interaction.commandName}`
        )
    }
}

export { once, name, invoke }
