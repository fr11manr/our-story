type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#f3bbc6]/75">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">{title}</h1>
      {description ? <p className="mt-5 text-base leading-8 text-white/62 sm:text-lg">{description}</p> : null}
    </div>
  );
}
