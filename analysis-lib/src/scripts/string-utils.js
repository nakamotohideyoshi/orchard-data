'use strict'

const stringUtils = {

  'stripParentheses': function (string) {
    let tokens = '{}()[]'
    let parentheses = []

    string.split('').forEach(_char => {
      if (tokens.indexOf(_char) !== -1) { parentheses.push(_char) };
    })

    return parentheses.join('')
  },

  'parenthesesAreBalanced': function (string) {
    let parentheses = '[]{}()'
    let stack = []
    let i
    let character
    let bracePosition

    for (i = 0; i < string.length; i++) {
      character = string[i]
      bracePosition = parentheses.indexOf(character)

      if (bracePosition === -1) {
        continue
      }

      if (bracePosition % 2 === 0) {
        // push next expected brace position
        stack.push(bracePosition + 1)
      } else if (stack.pop() !== bracePosition) {
        return false
      }
    }

    return stack.length === 0
  },

  'getTextBetweenParentheses': function (string) {
    let parenthesesRegExp = /(\(|\{|\[)([^)]+)(\)|\]|\})/g
    let match = string.match(parenthesesRegExp)

    if (match) { return match } else return ''
  },

  'stringToTitleCase': function (string) {
    return string.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    })
  },

  'capitalize': function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },

  'stopWords': {

    'english': ['a', 'an', 'and', 'n', "n'", 'as', 'but', 'bat', 'for', 'from', 'nor', 'of', 'or', 'so', 'the', 'da', 'to', 'yet', 'at', 'by', 'for', 'fo', "fo'", 'from', 'in', 'into', 'in2', 'of', 'off', 'on', 'onto', 'on2', 'out', 'over', 'to', 'up', 'with'],

    'portuguese': ['a', 'das', 'nas', 'pela', 'à', 'de', 'no', 'pelas', 'ao', 'do', 'nos', 'pelo', 'aos', 'dos', 'o', 'pelos', 'as', 'e', 'os', 'por', 'pra', 'pro', 'às', 'em', 'ou', 'um', 'da', 'na', 'para', 'uma'],

    'spanish': ['a', 'e', 'las', 'por', 'al', 'el', 'los', 'un', 'de', 'en', 'o', 'una', 'del', 'la', 'para', 'y']

  },

  'isSentenceCase': function (sentence) {
    const _sentence = sentence.toLowerCase()
    const sentenceCase = stringUtils.capitalize(_sentence)
    return sentenceCase === sentence
  },

  'isTitleCase': function (sentence) {
    const titleCase = stringUtils.stringToTitleCase(sentence)
    return titleCase === sentence
  }

}

module.exports = stringUtils
