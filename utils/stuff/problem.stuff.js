import api from './api.js'
import db from '../../core/database.js'

class ProblemStuff {
    /**
     * 
     * @returns {Array} all problems from API
     */
    async fetchAllProblems() {
        try {
            const response = await api().get('/problems')
            return response.data.data.objects
        } catch (error) {
            console.error('Error fetching problems:', error)
            throw error
        }
    }
    async updateProblemsToDB() {
        try {
            const problems = await this.fetchAllProblems()

            for (const problem of problems) {
                const existingProblem = await db.Problem.findOne({ code: problem.code })
                if (existingProblem) {
                    console.log(`Problem already exists: ${problem.code}`)
                    continue // Skip adding the problem if it already exists
                }

                await db.Problem.create(problem)
                console.log(`Added problem: ${problem.code}`)
            }
        } catch (error) {
            console.error('Error updating problems to the database:', error)
        }
    }
}

export default new ProblemStuff()
