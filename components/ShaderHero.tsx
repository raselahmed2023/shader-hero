import AuroraShader from "./AuroraShader";

export default function ShaderHero() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <AuroraShader />

      <div className="absolute inset-0 bg-black/20" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200">
            Signature Shader
          </p>

          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
            Creative frontend,
            <br />
            shaped by light.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
            I build interactive interfaces where design,
            motion and code meet — powered here by a custom
            GLSL aurora shader.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#about"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Explore the shader
            </a>

            <span className="flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-slate-200 backdrop-blur">
              GLSL · R3F · Interactive
            </span>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="relative z-10 border-t border-white/10 bg-slate-950/85 px-6 py-16 backdrop-blur-xl sm:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            The shader uses time to animate layered sine waves,
            resolution to keep the pattern proportional on every
            screen, and mouse position to gently bend the color
            field toward the cursor.
          </p>
        </div>
      </section>
    </main>
  );
}