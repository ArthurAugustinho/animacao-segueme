import { buscarConfiguracao } from "@/lib/db/queries";
import { restaurarLogoPadrao } from "@/lib/actions";
import { LogoForm } from "@/components/admin/logo-form";
import { LogoSegueMe } from "@/components/logo-segueme";
import { formatarData } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const config = await buscarConfiguracao();
  const temLogoCustomizada = config.logoDataUri !== null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-segueme-ink">
        Configurações
      </h1>
      <p className="mt-1 text-sm text-segueme-muted">
        Personalize a logo exibida no site público.
      </p>

      {/* Preview */}
      <section className="mt-8 rounded-xl border border-segueme-line bg-white p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-segueme-brown">
          Logo atual
        </h2>

        <div className="mt-4 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-segueme-line bg-segueme-cream p-2">
            {temLogoCustomizada ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logoDataUri!}
                className="h-full w-full object-contain"
                alt="Logo atual"
              />
            ) : (
              <LogoSegueMe className="h-full w-full" />
            )}
          </div>

          <div className="space-y-1 text-sm">
            <p>
              <span className="text-segueme-muted">Status: </span>
              {temLogoCustomizada ? (
                <span className="rounded-full bg-segueme-yellow px-2 py-0.5 text-xs font-semibold text-segueme-ink">
                  Personalizada
                </span>
              ) : (
                <span className="rounded-full bg-segueme-line px-2 py-0.5 text-xs font-semibold text-segueme-ink">
                  Padrão
                </span>
              )}
            </p>
            {temLogoCustomizada && (
              <>
                <p>
                  <span className="text-segueme-muted">Formato: </span>
                  <span className="text-segueme-ink">{config.logoMimeType}</span>
                </p>
                <p>
                  <span className="text-segueme-muted">Tamanho: </span>
                  <span className="text-segueme-ink">
                    {formatarTamanho(config.logoTamanhoBytes)}
                  </span>
                </p>
                <p>
                  <span className="text-segueme-muted">Atualizado em: </span>
                  <span className="text-segueme-ink">
                    {formatarData(config.atualizadoEm)}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        {temLogoCustomizada && (
          <div className="mt-5 border-t border-segueme-line pt-5">
            <form action={restaurarLogoPadrao}>
              <button
                type="submit"
                className="rounded-lg border border-segueme-line px-4 py-2 text-sm font-medium text-segueme-muted hover:border-segueme-ink hover:text-segueme-ink"
              >
                Restaurar logo padrão
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Upload */}
      <section className="mt-6 rounded-xl border border-segueme-line bg-white p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-segueme-brown">
          {temLogoCustomizada ? "Substituir logo" : "Enviar logo personalizada"}
        </h2>
        <LogoForm />
      </section>
    </div>
  );
}

function formatarTamanho(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
