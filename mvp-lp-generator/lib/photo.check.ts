// 写真の入力チェックの最小確認: `npm run check`（Node 24 の型除去で直接実行）
import assert from 'node:assert/strict'
import { isSamplePhotoPath, photoError } from './photo.ts'

const MB = 1024 * 1024
assert.equal(photoError({ type: 'image/jpeg', size: 2 * MB }), null)
assert.equal(photoError({ type: 'image/webp', size: 8 * MB }), null)
assert.match(photoError({ type: 'image/png', size: 8 * MB + 1 }) ?? '', /8MB/)
assert.match(photoError({ type: 'image/png', size: 0 }) ?? '', /空/)
assert.match(photoError({ type: 'image/svg+xml', size: 100 }) ?? '', /画像ファイル/)
assert.match(photoError({ type: 'text/plain', size: 100 }) ?? '', /画像ファイル/)
assert.match(photoError({ type: '', size: 100 }) ?? '', /画像ファイル/)

assert.ok(isSamplePhotoPath('/samples/komorebi-coffee.webp'))
assert.ok(!isSamplePhotoPath('https://example.com/a.webp'))
assert.ok(!isSamplePhotoPath('blob:http://localhost/abc'))
assert.ok(!isSamplePhotoPath('/samples/../secret.webp'))
assert.ok(!isSamplePhotoPath(undefined))

console.log('photo checks: ok')
