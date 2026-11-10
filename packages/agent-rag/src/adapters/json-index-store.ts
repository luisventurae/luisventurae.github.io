import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import type { IndexStore, IndexedChunk, RagIndex } from '../core/ports.ts'
import type { Chunk } from '../core/types.ts'

const VERSION = 1

interface StoredEntry extends Chunk {
  vector: string | null
}

interface StoredIndex {
  version: number
  model: string | null
  built_at: number
  file_hashes: Record<string, string>
  entries: StoredEntry[]
}

/** Persists the index as JSON (vectors as base64 Float32), replacing the file atomically. */
export function createJsonIndexStore(file_path: string): IndexStore {
  return {
    async load() {
      try {
        const parsed: unknown = JSON.parse(await readFile(file_path, 'utf8'))
        return isStoredIndex(parsed) ? fromStored(parsed) : null
      } catch {
        return null
      }
    },
    async save(index) {
      await mkdir(dirname(file_path), { recursive: true })
      const temporary = `${file_path}.${process.pid}.tmp`
      await writeFile(temporary, JSON.stringify(toStored(index)))
      await rename(temporary, file_path)
    },
  }
}

function toStored(index: RagIndex): StoredIndex {
  return {
    version: VERSION,
    model: index.model,
    built_at: index.built_at,
    file_hashes: index.file_hashes,
    entries: index.entries.map((entry) => ({
      ...entry,
      vector: entry.vector ? encodeVector(entry.vector) : null,
    })),
  }
}

function fromStored(stored: StoredIndex): RagIndex {
  return {
    model: stored.model,
    built_at: stored.built_at,
    file_hashes: stored.file_hashes,
    entries: stored.entries.map((entry): IndexedChunk => ({
      ...entry,
      vector: entry.vector ? decodeVector(entry.vector) : null,
    })),
  }
}

function isStoredIndex(value: unknown): value is StoredIndex {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { version?: unknown }).version === VERSION &&
    Array.isArray((value as { entries?: unknown }).entries)
  )
}

function encodeVector(vector: Float32Array): string {
  return Buffer.from(vector.buffer, vector.byteOffset, vector.byteLength).toString('base64')
}

function decodeVector(encoded: string): Float32Array {
  const bytes = Buffer.from(encoded, 'base64')
  return new Float32Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))
}
