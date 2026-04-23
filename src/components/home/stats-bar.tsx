const stats = [
  { value: "1,200+", label: "Vehicles Revved" },
  { value: "4.9/5", label: "Miami Reviews" },
  { value: "100%", label: "Mobile Service" },
  { value: "2HR", label: "Avg Response" },
];

export function StatsBar() {
  return (
    <div className="bg-surface-container-lowest border-y border-outline-variant py-8">
      <div className="max-w-[1280px] mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-primary-container font-headline not-italic">
              {stat.value}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-outline">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
