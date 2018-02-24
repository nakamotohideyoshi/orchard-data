module.exports = {

  'stripParentheses':function(string) {

    let tokens = '{}()[]';
    let parentheses = [];

    string.split('').forEach(_char => {

      if(tokens.indexOf(_char) !== -1) { parentheses.push(_char); };

    });

    return parentheses.join("");

  },

  'parenthesesAreBalanced': function(string) {

    let parentheses = "[]{}()";
    let stack = [];
    let i;
    let character;
    let bracePosition;

    for(i = 0; character = string[i]; i++) {

      bracePosition = parentheses.indexOf(character);

      if(bracePosition === -1) { continue; }

      if(bracePosition % 2 === 0) { stack.push(bracePosition + 1); }// push next expected brace position

      else {

        if(stack.pop() !== bracePosition) { return false; }

      }

    }

    return stack.length === 0;

  },

  'getTextInBetween': function(string) {

    let parenthesesRegExp = /(\(|\{|\[)([^)]+)(\)|\]|\})/g;
    let match = string.match(parenthesesRegExp);

    if(match) { return match[0]; }
    else return '';

  },

};
