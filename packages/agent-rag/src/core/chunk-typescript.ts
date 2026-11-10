import ts from 'typescript'

import type { Chunk, ChunkKind, SourceFile } from './types.ts'

const MAX_LINES = 60
const OVERLAP_LINES = 8
const SUITE_CALL = /^(test\.)?describe(\.\w+)?$/
const TEST_PATH = /\.test\.tsx?$|(^|\/)e2e\//

/** Splits a TypeScript/TSX file into one chunk per top-level declaration, with line ranges. */
export function chunkTypeScript(file: SourceFile): Chunk[] {
  const kind: ChunkKind = TEST_PATH.test(file.path) ? 'test' : 'code'
  const script_kind = file.path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const source = ts.createSourceFile(
    file.path,
    file.content,
    ts.ScriptTarget.Latest,
    true,
    script_kind,
  )
  const lines = file.content.split('\n')
  const pieces: Piece[] = []
  for (const statement of source.statements) collect(statement, source, '', pieces)

  return pieces.flatMap((piece) =>
    windowPiece(piece, lines).map((window, position) => ({
      id: `${file.path}:${window.start_line}:${position}`,
      path: file.path,
      kind,
      symbol: window.symbol,
      start_line: window.start_line,
      end_line: window.end_line,
      text: `${file.path} › ${window.symbol}\n${lines.slice(window.start_line - 1, window.end_line).join('\n')}`,
    })),
  )
}

interface Piece {
  symbol: string
  start_line: number
  end_line: number
}

function collect(node: ts.Statement, source: ts.SourceFile, prefix: string, out: Piece[]): void {
  if (ts.isImportDeclaration(node)) return
  const start_line = source.getLineAndCharacterOfPosition(node.getStart(source, true)).line + 1
  const end_line = source.getLineAndCharacterOfPosition(node.getEnd()).line + 1
  const symbol = `${prefix}${symbolOf(node, source)}`

  const body = end_line - start_line + 1 > MAX_LINES ? nestedStatements(node) : undefined
  if (body && body.length > 0) {
    for (const child of body) collect(child, source, `${symbol} › `, out)
    return
  }
  out.push({ symbol, start_line, end_line })
}

/** Test suites (`describe(..., () => { ... })`) are split into their cases. */
function nestedStatements(node: ts.Statement): readonly ts.Statement[] | undefined {
  if (!ts.isExpressionStatement(node) || !ts.isCallExpression(node.expression)) return undefined
  if (!SUITE_CALL.test(node.expression.expression.getText())) return undefined
  const callback = node.expression.arguments.find(
    (argument): argument is ts.ArrowFunction | ts.FunctionExpression =>
      ts.isArrowFunction(argument) || ts.isFunctionExpression(argument),
  )
  return callback && ts.isBlock(callback.body) ? callback.body.statements : undefined
}

function symbolOf(node: ts.Statement, source: ts.SourceFile): string {
  if (
    (ts.isFunctionDeclaration(node) ||
      ts.isClassDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isEnumDeclaration(node)) &&
    node.name
  ) {
    return node.name.text
  }
  if (ts.isVariableStatement(node)) {
    return node.declarationList.declarations.map((item) => item.name.getText(source)).join(', ')
  }
  if (ts.isExpressionStatement(node) && ts.isCallExpression(node.expression)) {
    return describeCall(node.expression, source)
  }
  return ts.isExportAssignment(node) ? 'default' : 'statement'
}

function describeCall(call: ts.CallExpression, source: ts.SourceFile): string {
  const callee = call.expression.getText(source)
  const first = call.arguments[0]
  return first && ts.isStringLiteralLike(first) ? `${callee}('${first.text}')` : `${callee}()`
}

function windowPiece(piece: Piece, lines: string[]): Piece[] {
  if (piece.end_line - piece.start_line + 1 <= MAX_LINES) return [piece]
  const windows: Piece[] = []
  const step = MAX_LINES - OVERLAP_LINES
  for (let start = piece.start_line; start <= piece.end_line; start += step) {
    const end = Math.min(start + MAX_LINES - 1, piece.end_line, lines.length)
    windows.push({ symbol: `${piece.symbol} (L${start}-${end})`, start_line: start, end_line: end })
    if (end >= piece.end_line) break
  }
  return windows
}
