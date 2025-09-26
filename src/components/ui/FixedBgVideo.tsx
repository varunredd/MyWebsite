// Reuse your grading/overlays from CyberpunkBgVideo if you like
export default function FixedBgVideo() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        // gentle grade so content remains readable
        style={{ filter: "brightness(.72) contrast(1.06) saturate(1.04)" }}
      >
        <source src="/assets/cyberpunk-track.webm" type="video/webm" />
        <source src="/assets/cyberpunk-track.mp4" type="video/mp4" />
      </video>

      {/* overlays (tweak strength to taste) */}
      <div className="absolute inset-0 mix-blend-multiply bg-[#070b14]/55" />
      <div className="absolute inset-0 bg-[radial-gradient(85%_70%_at_50%_18%,rgba(0,0,0,.75)_0%,rgba(0,0,0,.65)_40%,rgba(0,0,0,.45)_60%,rgba(0,0,0,.2)_80%,rgba(0,0,0,0)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.45)_0%,rgba(0,0,0,.25)_14%,rgba(0,0,0,0)_28%,rgba(0,0,0,0)_72%,rgba(0,0,0,.25)_86%,rgba(0,0,0,.45)_100%)]" />
      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.045]"
        style={{ backgroundImage: "url(/assets/noise.png)" }}
      />
    </div>
  );
}
