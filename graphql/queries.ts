import { gql } from 'apollo-boost'

export const LOGOUT_USER = gql`
  mutation {
    logout {
      success
      username
      error
    }
  }
`

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      username
      error
    }
  }
`

export const SIGNUP_USER = gql`
  mutation signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $username: String!
    $password: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      username: $username
      password: $password
    ) {
      success
      username
      error
    }
  }
`

export const GET_SUBMISSIONS = gql`
  query submissions($in: LessonId) {
    submissions(input: $in) {
      status
    }
  }
`

export const GET_APP = gql`
  query {
    lessons {
      id
      title
      description
      docUrl
      githubUrl
      videoUrl
      order
      challenges {
        id
        title
        description
        order
      }
      chatUrl
    }
    session {
      user {
        id
        username
        emailVerificationToken
      }
      submissions {
        id
        status
        mrUrl
        diff
        viewCount
        comment
        order
        challengeId
        lessonId
        reviewer {
          id
          username
        }
        createdAt
        updatedAt
      }
      lessonStatus {
        lessonId
        isPassed
        isTeaching
        isEnrolled
      }
    }
  }
`

export const GET_SESSION = gql`
  {
    session {
      user {
        id
        username
      }
    }
  }
`

export const CONFIRM_EMAIL = gql`
  mutation confirmEmail($confirm: String!) {
    confirmEmail(confirmEmail: $confirm) {
      success
    }
  }
`
