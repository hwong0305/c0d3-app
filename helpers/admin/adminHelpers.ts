import { reach } from 'yup'

// creates usuable array from graphql data to use as a prop when using FormCard component
export const getPropertyArr = (options: any, deleteProps?: string[]) => {
  options.hasOwnProperty('__typename') && delete options.__typename
  ;(deleteProps || []).forEach(prop => delete options[prop])

  const keys = Object.keys(options)

  const res = keys.map((type: any) => {
    const value = options[type] === 0 ? '0' : `${options[type] || ''}`
    return {
      title: type,
      value,
      type: type === 'description' ? 'MD_INPUT' : 'TEXT_AREA'
    }
  })

  return res
}

// turns the array used in FormCard component into an object, to be used when making mutation requests
export const makeGraphqlVariable = (options: any, addProp?: any) => {
  const res = options.reduce((acc: any, option: any) => {
    acc[option.title] = option.value
    return acc
  }, {})

  if (res.hasOwnProperty('order')) {
    // undefined marks order as empty. Or else it will be NaN, and
    // Yup will give out a typeError instead of a Required error
    res.order = res.order === '' ? undefined : parseInt(res.order)
  }

  if (res.hasOwnProperty('id')) {
    res.id = parseInt(res.id ? res.id + '' : '')
  }

  if (addProp) {
    const keys = Object.keys(addProp)
    keys.forEach((propertyName: string) => {
      res[propertyName] = addProp[propertyName]
    })
  }

  return { variables: res }
}

export const errorCheckSingleField = async (
  properties: any,
  propertyIndex: number,
  schema: any
) => {
  // use makeGraphqlVariable to convert properties into an
  // object key-value format for error checking with Yup
  const data = makeGraphqlVariable(properties).variables
  let valid = true

  // title is the name of field being checked
  const { title } = properties[propertyIndex]
  try {
    await reach(schema, title).validate(data[title])
  } catch (err) {
    valid = false
    properties[propertyIndex].error = err.message
  }

  // remove error message(if present) if field is valid
  if (valid) {
    properties[propertyIndex].hasOwnProperty('error') &&
      delete properties[propertyIndex].error
  }

  return valid
}

export const errorCheckAllFields = async (properties: any, schema: any) => {
  // use makeGraphqlVariable to convert properties into an
  // object key-value format for error checking with Yup
  const data = makeGraphqlVariable(properties).variables
  let allValid = true

  try {
    await schema.validate(data, { abortEarly: false })
  } catch (err) {
    // errors is an array of error messages
    // inner is an array of objects containing more error information
    const { errors, inner } = err

    inner.some((innerObj: any, errorIndex: number) => {
      // get index of property with title equal to value of innerObj.path
      const titleIndex = properties.findIndex(
        (property: any) => property.title === innerObj.path
      )

      //add error message to field
      properties[titleIndex].error = errors[errorIndex]
    })

    allValid = false
  }

  return allValid
}
