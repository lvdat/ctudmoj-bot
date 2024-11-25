import api from './api.js'
import db from '../../core/database.js'

class UserStuff {
    /**
     * 
     * @param {String} username 
     * @returns {Object} user info
     */
    async fetchUserInfo (username) {
        try {
            const response = await api().get('/user/' + username)
            return response.data.data.objects
        } catch (error) {
            console.error('Error fetching problems:', error)
            throw error
        }
    }

    /**
     * 
     * @param {String} username 
     * @returns {Array} contest rating history
     */
    async fetchUserRatingInfo (username) {
        try {
            const response = await api().get('/user/' + username)
            return response.data.data.objects.contest
        } catch (error) {
            console.error('Error fetching problems:', error)
            throw error
        }
    }
}

export default new UserStuff()