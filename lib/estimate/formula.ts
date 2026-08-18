export interface FormulaVariables {
  p: number
  h: number
}

type Token =
  | { type: 'number'; value: number }
  | { type: 'variable'; value: keyof FormulaVariables }
  | { type: 'operator'; value: '+' | '-' | '*' | '/' }
  | { type: 'leftParen' }
  | { type: 'rightParen' }

function tokenize(formula: string): Token[] {
  const tokens: Token[] = []
  let index = 0

  while (index < formula.length) {
    const character = formula[index]

    if (/\s/.test(character)) {
      index += 1
      continue
    }

    if (/[0-9.]/.test(character)) {
      let rawNumber = ''
      while (index < formula.length && /[0-9.]/.test(formula[index])) {
        rawNumber += formula[index]
        index += 1
      }

      if ((rawNumber.match(/\./g) ?? []).length > 1) {
        throw new Error('잘못된 숫자 형식입니다.')
      }

      const value = Number(rawNumber)
      if (!Number.isFinite(value)) {
        throw new Error('유효하지 않은 숫자입니다.')
      }

      tokens.push({ type: 'number', value })
      continue
    }

    if (character === 'p' || character === 'h') {
      tokens.push({ type: 'variable', value: character })
      index += 1
      continue
    }

    if (character === '+' || character === '-' || character === '*' || character === '/') {
      tokens.push({ type: 'operator', value: character })
      index += 1
      continue
    }

    if (character === '(') {
      tokens.push({ type: 'leftParen' })
      index += 1
      continue
    }

    if (character === ')') {
      tokens.push({ type: 'rightParen' })
      index += 1
      continue
    }

    throw new Error(`허용되지 않은 문자입니다: ${character}`)
  }

  return tokens
}

class FormulaParser {
  private index = 0

  constructor(
    private readonly tokens: Token[],
    private readonly variables: FormulaVariables
  ) {}

  parse(): number {
    const value = this.parseExpression()
    if (this.index !== this.tokens.length) {
      throw new Error('수식 끝에 해석할 수 없는 값이 있습니다.')
    }
    return value
  }

  private parseExpression(): number {
    let value = this.parseTerm()

    while (this.matchOperator('+') || this.matchOperator('-')) {
      const operator = (this.tokens[this.index - 1] as Extract<Token, { type: 'operator' }>).value
      const right = this.parseTerm()
      value = operator === '+' ? value + right : value - right
    }

    return value
  }

  private parseTerm(): number {
    let value = this.parseFactor()

    while (this.matchOperator('*') || this.matchOperator('/')) {
      const operator = (this.tokens[this.index - 1] as Extract<Token, { type: 'operator' }>).value
      const right = this.parseFactor()
      if (operator === '/' && right === 0) {
        throw new Error('0으로 나눌 수 없습니다.')
      }
      value = operator === '*' ? value * right : value / right
    }

    return value
  }

  private parseFactor(): number {
    if (this.matchOperator('+')) return this.parseFactor()
    if (this.matchOperator('-')) return -this.parseFactor()

    const token = this.tokens[this.index]
    if (!token) throw new Error('수식이 완성되지 않았습니다.')

    if (token.type === 'number') {
      this.index += 1
      return token.value
    }

    if (token.type === 'variable') {
      this.index += 1
      return this.variables[token.value]
    }

    if (token.type === 'leftParen') {
      this.index += 1
      const value = this.parseExpression()
      if (this.tokens[this.index]?.type !== 'rightParen') {
        throw new Error('닫는 괄호가 필요합니다.')
      }
      this.index += 1
      return value
    }

    throw new Error('숫자, 변수 또는 괄호가 필요합니다.')
  }

  private matchOperator(operator: Extract<Token, { type: 'operator' }>['value']): boolean {
    const token = this.tokens[this.index]
    if (token?.type !== 'operator' || token.value !== operator) return false
    this.index += 1
    return true
  }
}

export function evaluateMaterialFormula(
  formula: string | null | undefined,
  variables: FormulaVariables,
  fallback = 1
): number {
  if (!formula?.trim()) return fallback

  try {
    const result = new FormulaParser(tokenize(formula), variables).parse()
    return Number.isFinite(result)
      ? Math.round(Math.max(0, result) * 1000) / 1000
      : fallback
  } catch {
    return fallback
  }
}
