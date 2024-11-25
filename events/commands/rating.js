import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import fs from 'fs'

const width = 800
const height = 600
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height })

// async function createRatingChart(contests) {
//     const labels = contests.map(contest => contest.key)
//     const ratings = contests.map(contest => contest.rating)

//     const configuration = {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'Rating Progression',
//                 data: ratings,
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 borderWidth: 2,
//                 fill: true,
//             }]
//         },
//         options: {
//             plugins: {
//                 title: {
//                     display: true,
//                     text: 'Rating Progression'
//                 }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: false
//                 }
//             }
//         }
//     }

//     return chartJSNodeCanvas.renderToBuffer(configuration)
// }

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
    const data = {
        contests: [
            { key: 'cictcpc23qual', rating: 1743 },
            { key: 'cictcpc23_final', rating: 1967 },
            { key: 'roadtohue1', rating: 2129 },
            { key: 'roadtohue2', rating: 2236 },
            { key: 'roadtohue3', rating: 2285 },
            { key: 'roadtohue4', rating: 2296 },
            { key: 'roadtohanoi01', rating: 2245 },
            { key: 'roadtohanoi02', rating: 2295 },
            { key: 'roadtohanoi04', rating: 2313 },
            { key: 'cictcpc24_vongloai', rating: 2381 },
            { key: 'cictcpc2024_chungket', rating: 2361 }
        ]
    }
    const chartBuffer = await createRatingChart(data.contests)
    // Lưu hình ảnh tạm thời
    const filePath = './rating-chart.png'
    fs.writeFileSync(filePath, chartBuffer)

    // Tạo embed và gửi biểu đồ
    const embed = new EmbedBuilder()
        .setTitle('Rating Progression')
        .setDescription('Biểu đồ rating qua các contest')
        .setImage('attachment://rating-chart.png')
    
    await interaction.reply({
        embeds: [embed],
        files: [{ attachment: filePath, name: 'rating-chart.png' }]
    })
}

export { create, invoke }
