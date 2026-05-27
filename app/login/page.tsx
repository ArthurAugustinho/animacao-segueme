import { signIn } from "@/auth";
import { Header } from "@/components/header";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-md flex-col px-4 pt-16 sm:px-6">
        <div className="rounded-xl border border-segueme-line bg-white p-8 shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-segueme-ink">
            Acesso restrito
          </h1>
          <p className="mt-2 text-sm text-segueme-muted">
            Apenas o administrador autorizado pode editar roteiros.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/admin" });
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-segueme-ink px-4 py-3 text-sm font-medium text-segueme-cream transition-colors hover:bg-black"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.09 3.29 9.4 7.86 10.93.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.69-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.45.11-3.03 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.74.11 3.03.74.8 1.18 1.83 1.18 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12.02C23.5 5.66 18.35.5 12 .5z" />
              </svg>
              Entrar com GitHub
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
