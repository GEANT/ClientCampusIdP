export const GENERAL_ERROR = "GENERAL_ERROR"
export function throwError(message) {
  return {
    type: GENERAL_ERROR,
    message
  }
}

export const HIDE_MESSAGE = "HIDE_MESSAGE"
export function hideError() {
  return {
    type: HIDE_MESSAGE
  }
}