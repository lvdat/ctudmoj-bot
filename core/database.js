import mongoose from 'mongoose'

const ProblemSchema = new mongoose.Schema({
    code: String,
    name: String,
    types: Array,
    group: String,
    points: Number,
    partial: Boolean,
    is_organization_private: Boolean,
    is_public: Boolean
})

const ConnectSchema = new mongoose.Schema(
    {
        discordId: String,
        ojUsername: String
    },
    {
        timestamps: true
    }
)

const ContestSchema = new mongoose.Schema({
    key: String,
    name: String,
    start_time: String,
    end_time: String,
    time_limit: Number,
    is_rated: Boolean,
    rate_all: Boolean,
    tags: Array
})

const UserSchema = new mongoose.Schema({
    ojId: Number,
    username: String,
    display_name: String,
    points: String,
    performance_points: String,
    problem_count: Number,
    solved_problems: Array,
    rank: String,
    rating: Number,
    organizations: Array,
    contests: Array
})

const Problem = mongoose.model('Problem', ProblemSchema)
const Connect = mongoose.model('Connect', ConnectSchema)
const Contest = mongoose.model('Contest', ContestSchema)
const User = mongoose.model('User', UserSchema)

export default { Problem, Connect, Contest, User }
