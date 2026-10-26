import { test } from "node:test";
import assert from "node:assert/strict";
import { groupDigits, itemErrors } from "./item-check.ts";

test("正しい数量・単価はエラーなし（カンマ・小数2桁・単価未入力はOK）", () => {
  assert.deepEqual(itemErrors({ quantity: "12.5", unitPrice: "1,200" }), {});
  assert.deepEqual(itemErrors({ quantity: "1", unitPrice: "" }), {});
});

test("数量が0以下・不正なら数量エラー（プレビュー合計から外れる）", () => {
  for (const quantity of ["-2", "0", "", "abc", "1.234"]) {
    assert.ok(itemErrors({ quantity, unitPrice: "1000" }).quantity, quantity);
  }
});

test("単価が負・小数・10億超なら単価エラー", () => {
  for (const unitPrice of ["-1", "100.5", "1000000001"]) {
    assert.ok(itemErrors({ quantity: "1", unitPrice }).unitPrice, unitPrice);
  }
});

test("単価欄は整数のときだけ3桁区切りにし、読めない値はそのまま残す", () => {
  assert.equal(groupDigits("180000"), "180,000");
  assert.equal(groupDigits(" 1,2000 "), "12,000");
  for (const raw of ["", "abc", "100.5", "-1"]) assert.equal(groupDigits(raw), raw);
  // 区切った値も検証を通る
  assert.deepEqual(itemErrors({ quantity: "1", unitPrice: groupDigits("1000000000") }), {});
});
