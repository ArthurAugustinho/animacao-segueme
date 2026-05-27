"use client";

import { useActionState } from "react";
import { atualizarLogo } from "@/lib/actions";
import type { AtualizarLogoState } from "@/lib/actions";

export function LogoForm() {
  const [state, formAction, pending] = useActionState<
    AtualizarLogoState,
    FormData
  >(atualizarLogo, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.erro && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.erro}
        </p>
      )}

      <div>
        <label
          htmlFor="arquivo"
          className="mb-1.5 block text-sm font-medium text-segueme-ink"
        >
          Nova logo
        </label>
        <input
          id="arquivo"
          type="file"
          name="arquivo"
          accept="image/png,image/svg+xml,image/jpeg,image/webp"
          required
          className="block w-full text-sm text-segueme-muted
            file:mr-3 file:cursor-pointer file:rounded-lg
            file:border file:border-segueme-line file:bg-white
            file:px-4 file:py-2 file:text-sm file:font-medium
            file:text-segueme-ink hover:file:bg-segueme-cream"
        />
        <p className="mt-1.5 text-xs text-segueme-muted">
          PNG, SVG, JPG ou WEBP · máx. 500 KB
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-segueme-ink px-5 py-2.5 text-sm font-medium text-segueme-cream hover:bg-black disabled:opacity-50"
      >
        {pending ? "Salvando…" : "Salvar logo"}
      </button>
    </form>
  );
}
