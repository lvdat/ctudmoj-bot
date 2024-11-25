import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import userStuff from '../../utils/stuff/user.stuff.js'
import path from 'path'
import fs from 'fs'

const width = 800
const height = 600
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height })

// Tạo đường dẫn cache
const cacheDir = path.join(process.cwd(), 'cache')
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir) // Tạo thư mục cache nếu chưa tồn tại
}

/**
 * Tạo tên tệp cache từ username.
 * @param {string} username - Tên người dùng hoặc tham số duy nhất
 * @returns {string} - Đường dẫn tới tệp cache
 */
function getCacheFilePath(username) {
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9_-]/g, '_') // Loại bỏ ký tự đặc biệt
    return path.join(cacheDir, `${sanitizedUsername}.png`)
}

async function createRatingChart(contests) {
    const labels = contests.map(contest => contest.key)
    const ratings = contests.map(contest => contest.rating)

    const configuration = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Rating Progression',
                data: ratings,
                borderColor: 'rgba(255, 0, 0, 1)', // Đường line màu đỏ
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 255, 255, 1)', // Node màu trắng
                pointBorderColor: 'rgba(255, 0, 0, 1)', // Viền đỏ
                pointBorderWidth: 2,
                pointRadius: 5, // Node lớn hơn mặc định
                fill: false // Không tô màu dưới đường
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Rating Progression',
                    color: 'rgba(0, 0, 0, 0.8)',
                    font: {
                        size: 18
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Rating'
                    },
                    ticks: {
                        color: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Contest'
                    },
                    ticks: {
                        color: 'rgba(0, 0, 0, 0.8)'
                    }
                }
            },
            layouts: {
                backgroundColor: 'rgba(255, 255, 255, 1)'
            }
        },
        plugins: [{
            beforeDraw: (chart) => {
                const { ctx, chartArea, scales } = chart
                const { left, right, top, bottom } = chartArea
                const yScale = scales.y

                ctx.save()

                // Các miền màu cho trục y (rating)
                const zones = [
                    { min: 0, max: 1200, color: 'rgba(255, 99, 132, 0.8)' }, // Red
                    { min: 1200, max: 1500, color: 'rgba(255, 159, 64, 0.8)' }, // Orange
                    { min: 1500, max: 1800, color: 'rgba(75, 192, 192, 0.8)' }, // Green
                    { min: 1800, max: 2200, color: 'rgba(54, 162, 235, 0.8)' }, // Blue
                    { min: 2200, max: 3000, color: 'rgba(153, 102, 255, 0.8)' } // Purple
                ]

                zones.forEach(zone => {
                    const yMin = yScale.getPixelForValue(zone.min)
                    const yMax = yScale.getPixelForValue(zone.max)

                    ctx.fillStyle = zone.color
                    ctx.fillRect(left, yMax, right - left, yMin - yMax) // Vẽ màu nền dọc theo y
                })

                ctx.restore()
            }
        }]
    }

    return chartJSNodeCanvas.renderToBuffer(configuration)
}


const create = () => {
    const command = new SlashCommandBuilder()
        .setName('rating')
        .setDescription('Xem biểu đồ rating của người dùng CTU DMOJ')
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
    const username = interaction.options.getString('username')

    try {
        // Defer reply để thông báo rằng bot đang xử lý
        await interaction.deferReply()

        // Đường dẫn cache
        const cachePath = getCacheFilePath(username)

        if (fs.existsSync(cachePath)) {
            console.log(`Cache hit: ${cachePath}`)
            // Gửi file cache nếu tồn tại
            const resultEmbed = new EmbedBuilder()
                .setTitle('Rating Progression')
                .setDescription(`Biểu đồ rating của **${username}** qua các contest`)
                .setImage('attachment://rating-chart.png')

            await interaction.editReply({
                embeds: [resultEmbed],
                files: [{ attachment: cachePath, name: 'rating-chart.png' }]
            })
            return
        }

        console.log(`Cache miss: Generating new chart for ${username}`)

        // Fetch rating data từ API
        let contests = await userStuff.fetchUserRatingInfo(username) // Sử dụng await để giải quyết Promise

        contests = contests.filter(
            contest => contest.rating !== null
        )
        console.log('contests: ' + JSON.stringify(contests, null, 2))

        // Tạo biểu đồ từ dữ liệu
        const chartBuffer = await createRatingChart(contests)

        // Lưu biểu đồ vào cache
        fs.writeFileSync(cachePath, chartBuffer)

        // Tạo Embed và gửi biểu đồ
        const resultEmbed = new EmbedBuilder()
            .setTitle('Rating Progression')
            .setDescription(`Biểu đồ rating của **${username}** qua các contest`)
            .setImage('attachment://rating-chart.png')

        await interaction.editReply({
            embeds: [resultEmbed],
            files: [{ attachment: cachePath, name: 'rating-chart.png' }]
        })
    } catch (error) {
        console.error('Error handling /rating command:', error)

        // Nếu xảy ra lỗi, chỉnh sửa tin nhắn thông báo lỗi
        await interaction.editReply({
            content: 'Đã xảy ra lỗi khi xử lý lệnh. Vui lòng thử lại sau.',
            embeds: [] // Xóa các embed cũ
        })
    }
}

export { create, invoke }
