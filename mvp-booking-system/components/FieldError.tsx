'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

type Errors = Record<string, string>;
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const ErrorsContext = createContext<Errors>({});
export const FieldErrorsProvider = ErrorsContext.Provider;

function messageFor(el: Control): string {
  // ラベルの先頭のテキスト（「任意」の印は含めない）
  const label = el.labels?.[0]?.firstChild?.textContent?.trim() ?? '';
  if (el.validity.valueMissing) {
    return el instanceof HTMLSelectElement || el.type === 'date' ? `${label}を選んでください` : `${label}を入力してください`;
  }
  if (el.validity.typeMismatch) return `${label}の形式が正しくありません`;
  return el.validationMessage;
}

/**
 * 必須チェックはブラウザ標準（required / type）のまま使い、吹き出しの代わりに入力欄の下へ1行で出す。
 * 返す ref を form に付ける。invalid は泡立たないので capture で拾う。
 */
export function useFieldErrors() {
  const [errors, setErrors] = useState<Errors>({});
  const focusedThisSubmit = useRef(false);

  const ref = useCallback((form: HTMLFormElement | null) => {
    if (!form) return;
    const onInvalid = (e: Event) => {
      const el = e.target as Control;
      e.preventDefault(); // ブラウザ標準の吹き出しを出さない
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', `${el.id}-error`);
      setErrors(prev => ({ ...prev, [el.id]: messageFor(el) }));
      // 吹き出しを止めるとフォーカスも移らないので、最初の1件へ自分で移す
      if (!focusedThisSubmit.current) {
        focusedThisSubmit.current = true;
        el.focus();
        setTimeout(() => { focusedThisSubmit.current = false; });
      }
    };
    const onInput = (e: Event) => {
      const el = e.target as Control;
      if (el.getAttribute('aria-describedby') !== `${el.id}-error`) return;
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
      setErrors(({ [el.id]: _, ...rest }) => rest);
    };
    form.addEventListener('invalid', onInvalid, true);
    form.addEventListener('input', onInput);
    return () => {
      form.removeEventListener('invalid', onInvalid, true);
      form.removeEventListener('input', onInput);
      setErrors({}); // 入力欄が消えたら（戻る・申し込み完了）エラーも消す
    };
  }, []);

  return { errors, ref };
}

/** 入力欄の下に出す1行のエラー。見た目は二重予約のエラーと揃える */
export function FieldError({ id }: { id: string }) {
  const message = useContext(ErrorsContext)[id];
  if (!message) return null;
  return <p id={`${id}-error`} className="mt-1.5 text-sm text-attn font-medium">{message}</p>;
}
