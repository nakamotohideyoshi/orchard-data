module.exports = {
  failBecauseTailContainsBothParenthesesAndSquareBracketsAndSquareBracketsAreUsedBeforeParens: [{
    'track_name': 'All of Me [Tiësto’s Birthday Treatment Remix] (Radio Edit)'
  }],
  passBecauseTailContainsBothParenthesesAndSquareBracketsAndParensAreUsedBeforeSquareBrackets: [{
    'track_name': 'All of Me (Tiësto’s Birthday Treatment Remix) [Radio Edit]'
  }],
  failBecauseTailContainsBothParenthesesAndSquareBracketsAndThereIsMoreThanOneSetOfParenthesis: [{
    'track_name': 'All of Me (Tiësto’s Birthday Treatment Remix) (Radio Edit)'
  }],
  passBecauseFirstSetOfParenthesisAreNotInTheTail: [{
    'track_name': '(Love Is Like A) Heat Wave (In the Style of Martha Reeves)'
  }],
  passBecauseFirstSetOfBracketsAreNotInTheTail: [{
    'track_name': '[Love Is Like A] Heat Wave (In the Style of Martha Reeves)'
  }],
  passBecauseTailContainsBothParenthesesAndSquareBracketsAndThereIsMoreThanOneSetOfSquareBrackets: [{
    'track_name': 'All of Me (Tiësto’s Birthday Treatment Remix)[Radio Edit][Another Set of Brackets]'
  }],
  failBecauseTailContainsMultipleExplanatoryReferencesAndTheFirstOneIsInSquareBracketsRatherThanParentheses: [{
    'track_name': 'All of Me [Tiësto’s Birthday Treatment Remix] [Radio Edit]'
  }]
}
