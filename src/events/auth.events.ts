import { appEvents } from "../lib/events";
import { logger } from "../lib/logger";

export const AUTH_EVENTS = {
  USER_REGISTERED: 'auth:user-registered',
  USER_LOGGED_IN: 'auth:user-logged-in',
  USER_LOGGED_OUT: 'auth:user-logged-out',
  USER_LOGIN_FAILED: 'auth:user-login-faied'
}

appEvents.on(AUTH_EVENTS.USER_LOGGED_IN, (data) => {
  try {
    logger.info(`User ${data.email} logged in.`)
  } catch {
    logger.error(`Unable to emit USER_LOGGED_IN ${data} `)
  }
})

appEvents.on(AUTH_EVENTS.USER_LOGIN_FAILED, (data) => {
  try {
    logger.info(`User login failed - event emiited. ${JSON.stringify(data)}`)
  } catch {
    logger.error(`Unable to emit USER_LOGIN_FAILED ${data}`)
  }
})

appEvents.on(AUTH_EVENTS.USER_REGISTERED, (data) => {
  try {
    logger.info(`User Successfully Registered - Welcome ${data.name}`)
  } catch {
    logger.error(`Unable to emit USER_REGISTERED ${data}`)
  }
})