import mongoose from 'mongoose'
import database from './core/database'
import problemStuff from './utils/stuff/problem.stuff'

problemStuff.updateProblemsToDB()

await mongoose.connect(process.env.DB_URI)