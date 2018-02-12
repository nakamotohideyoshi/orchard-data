let constants = {
  // user-visible strings for dataset status
  STATUS_OK: 'Success',
  STATUS_IN_PROGRESS: 'In progress',
  STATUS_FAIL: 'Fail',

  // in dataset tsv file
  MAX_FIELDS: 52
}

module.exports =
  Object.freeze(constants) // freeze prevents changes by users
