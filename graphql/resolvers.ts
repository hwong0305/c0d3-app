import db from '../helpers/dbload'
import { login, logout, signup } from '../helpers/controllers/loginController'
import { LoggedRequest } from '../@types/helpers'
import { changePw, reqPwReset } from '../helpers/controllers/passwordController'
import _ from 'lodash'

const { User, Submission, Lesson, UserLesson } = db

type Submission = {
  lessonId: string
}

export default {
  Query: {
    lessons() {
      return Lesson.findAll({
        include: ['challenges'],
        order: [['order', 'ASC']]
      })
    },
    submissions(_parent: void, arg: Submission, _context: LoggedRequest) {
      const { lessonId } = arg
      return Submission.findAll({
        where: {
          status: 'open',
          lessonId
        }
      })
    },
    async session(_parent: void, _args: void, context: LoggedRequest) {
      const userId = _.get(context, 'req.session.userId', false)

      if (!userId) {
        return null
      }

      // FYI: The reason we are querying with parallelized promises:
      // https://github.com/garageScript/c0d3-app/wiki/Sequelize-Query-Performance
      const [user, submissions, lessonStatus] = await Promise.all([
        User.findOne({ where: { id: userId } }),
        Submission.findAll({
          where: { userId },
          include: [{ model: User, as: 'reviewer' }]
        }),
        UserLesson.findAll({ where: { userId } })
      ])

      if (!user) {
        return null
      }

      return {
        user,
        submissions,
        lessonStatus
      }
    }
  },

  Mutation: {
    changePw,
    login,
    logout,
    reqPwReset,
    signup
  }
}
