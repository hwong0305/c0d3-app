jest.mock('bcrypt')
jest.mock('../dbload')
jest.mock('../mattermost')
import bcrypt from 'bcrypt'
import db from '../dbload'
import { login, logout, signup } from './authController'
import { chatSignUp } from '../mattermost'

describe('auth controller', () => {
  let userArgs
  beforeEach(() => {
    jest.clearAllMocks()
    userArgs = {
      username: 'testuser',
      password: 'c0d3reallyhard',
      firstName: 'testuser1',
      lastName: 'testuser1',
      email: 'testuser@c0d3.com'
    }
  })

  test('Login - should throw error when session is null', async () => {
    return expect(
      login({}, userArgs, { req: { session: null } })
    ).rejects.toThrowError('')
  })

  test('Login - should throw error if user cannot be found', async () => {
    db.User.findOne = jest.fn().mockReturnValue(null)
    return expect(
      login({}, userArgs, {
        req: { session: {}, uid: 'abc', logger: { error: jest.fn() } }
      })
    ).rejects.toThrowError('User does not exist')
  })

  test('Login - should throw error if password is invalid', async () => {
    db.User.findOne = jest.fn().mockReturnValue({})
    bcrypt.compare = jest.fn().mockReturnValue(false)
    return expect(
      login({}, userArgs, {
        req: { session: {}, uid: 'abc', logger: { error: jest.fn() } }
      })
    ).rejects.toThrowError('Password is invalid')
  })

  test('Login - should return success true if successful login', async () => {
    db.User.findOne = jest.fn().mockReturnValue({ username: 'testuser' })
    bcrypt.compare = jest.fn().mockReturnValue(true)
    const result = await login({}, userArgs, {
      req: { session: {}, uid: 'abc', logger: { error: jest.fn() } }
    })
    expect(result).toEqual({
      success: true,
      username: 'testuser'
    })
  })

  test('Logout - should reject with error', async () => {
    const session = null
    logout({}, {}, { req: { session } }).catch(e => {
      expect(e).toEqual({
        success: false,
        error: 'Session Error'
      })
    })
  })

  test('Logout - should reject with error if destroy encounters error', async () => {
    const session = {
      destroy: inputCb => {
        inputCb({ message: 'OWNED BY TEST' })
      }
    }
    logout(
      {},
      {},
      { req: { session, uid: 'abc', logger: { error: jest.fn() } } }
    ).catch(e => {
      expect(e).toEqual({
        success: false,
        error: 'OWNED BY TEST'
      })
    })
  })

  test('Logout - should resolve with success true if destroy has no error', async () => {
    const session = {
      destroy: inputCb => {
        inputCb(false)
      }
    }
    const result = await logout(
      {},
      {},
      { req: { session }, uid: 'abc', logger: { error: jest.fn() } }
    )
    expect(result).toEqual({
      success: true
    })
  })

  test('Signup - should reject if user information is incomplete', async () => {
    return expect(
      signup(
        {},
        {},
        { req: { session: {}, uid: 'abc', logger: { error: jest.fn() } } }
      )
    ).rejects.toThrowError('Register form is not completely filled out')
  })

  test('Signup - should reject if user already exists', async () => {
    db.User.findOne = jest.fn().mockReturnValue({ username: 'c0d3user' })
    return expect(
      signup({}, userArgs, {
        req: { session: {}, uid: 'abc', logger: { error: jest.fn() } }
      })
    ).rejects.toThrowError('User already exists')
  })

  test('Signup - should reject on second findOne. The first request checks for username, second request checks for email', async () => {
    db.User.findOne = jest
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValue({ username: 'c0d3user' }) // Second call for User.findOne checks for email
    return expect(
      signup({}, userArgs, {
        req: { session: {}, uid: 'abc', logger: { error: jest.fn() } }
      })
    ).rejects.toThrowError('Email already exists')
  })

  test('Signup - should not create user if chat signup responds with 401 or 403', async () => {
    db.User.findOne = jest.fn().mockReturnValue(null)
    db.User.create = jest.fn()

    chatSignUp.mockRejectedValue(
      'Invalid or missing parameter in mattermost request'
    )

    await expect(
      signup({}, userArgs, {
        req: { session: {}, uid: 'abc', logger: { error: jest.fn() } }
      })
    ).rejects.toThrowError('Invalid or missing parameter in mattermost request')

    expect(db.User.create).not.toBeCalled()
  })

  test('Signup - should not create user if chat signup throws an error', async () => {
    db.User.findOne = jest.fn().mockReturnValue(null)
    db.User.create = jest.fn()

    chatSignUp.mockRejectedValueOnce('Mattermost Error')

    await expect(
      signup({}, userArgs, {
        req: { session: {}, uid: 'abc', logger: { error: jest.fn() } }
      })
    ).rejects.toThrow('Mattermost Error')

    expect(db.User.create).not.toBeCalled()
  })

  test('Signup - should resolve with success true if signup successful ', async () => {
    db.User.findOne = jest.fn().mockReturnValue(null)
    db.User.create = jest.fn().mockReturnValue({ username: 'user' })
    chatSignUp.mockResolvedValueOnce({
      success: true
    })
    const result = await signup({}, userArgs, {
      req: { session: {}, uid: 'abc', logger: { error: jest.fn() } }
    })
    expect(result).toEqual({
      username: 'user'
    })
  })
})
