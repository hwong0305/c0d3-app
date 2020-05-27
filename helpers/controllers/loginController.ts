import db from '../dbload'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { UserInputError, AuthenticationError } from 'apollo-server-micro'
import { signupValidation } from '../formValidation'
import { chatSignUp } from '../mattermost'
import { Context } from '../../@types/helpers'
import { sendSignupEmail } from '../mail'
import { encode } from '../encoding'

const { User } = db

type Login = {
  username: string
  password: string
}

type SignUp = {
  firstName: string
  lastName: string
  username: string
  password: string
  email: string
}

export const login = async (_parent: void, arg: Login, ctx: Context) => {
  const { req } = ctx
  try {
    const { session } = req
    const { username, password } = arg

    if (!session) {
      throw new Error('Session Error')
    }

    const user = await User.findOne({ where: { username } })
    if (!user) {
      throw new UserInputError('User does not exist')
    }

    const validLogin = await bcrypt.compare(password, user.password)
    if (!validLogin) {
      throw new AuthenticationError('Password is invalid')
    }

    session.userId = user.id
    return {
      success: true,
      username: user.username
    }
  } catch (err) {
    if (!err.extensions) {
      req.error(err)
    }
    throw new Error(err)
  }
}

export const logout = async (_parent: void, _: void, ctx: Context) => {
  const { req } = ctx
  const { session } = req
  return new Promise(async (resolve, reject) => {
    if (!session) {
      return reject({
        success: false,
        error: 'Session Error'
      })
    }

    session.destroy(err => {
      if (err) {
        req.error(err)
        return reject({
          success: false,
          error: err.message
        })
      }

      resolve({
        success: true
      })
    })
  })
}

export const signup = async (_parent: void, arg: SignUp, ctx: Context) => {
  const { req } = ctx
  try {
    const { session } = req
    // const { firstName, lastName, username, password, email } = arg
    const { firstName, lastName, username, email } = arg

    if (!session) {
      throw new Error('Session Error')
    }

    const validEntry = await signupValidation.isValid({
      firstName,
      lastName,
      username,
      email
    })
    if (!validEntry) {
      throw new UserInputError('Register form is not completely filled out')
    }

    // Check for existing user or email
    const existingUser = await User.findOne({
      where: { username }
    })

    if (existingUser) {
      throw new UserInputError('User already exists')
    }

    const existingEmail = await User.findOne({
      where: { email }
    })

    if (existingEmail) {
      throw new UserInputError('Email already exists')
    }

    // await chatSignUp(username, password, email)
    await chatSignUp(username, email)

    const THREE_DAYS = 1000 * 60 * 60 * 24 * 3
    const name = `${firstName} ${lastName}`
    const userRecord = await User.create({
      name,
      username,
      email,
      // password,
      expiration: new Date(Date.now() + THREE_DAYS)
    })

    const encodedToken = encode({ userId: userRecord.id, token: nanoid() })
    userRecord.forgotToken = encodedToken
    await userRecord.save()

    sendSignupEmail(userRecord.email, userRecord.forgotToken)

    return {
      success: true,
      username: userRecord.username
    }
  } catch (err) {
    if (!err.extensions) {
      req.error(err)
    }
    throw new Error(err)
  }
}
