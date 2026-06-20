const technologies = [
  { name: "React", category: "Frontend" },
  { name: "Vue.js", category: "Frontend" },
  { name: "Angular", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Laravel", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "AWS", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "Flutter", category: "Mobile" },
];

const TechSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm mb-4 block">التقنيات</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            نستخدم <span className="gradient-text">أحدث التقنيات</span>
          </h2>
          <p className="text-muted-foreground">
            نعتمد على أفضل الأدوات والتقنيات العالمية لضمان جودة وأداء عالي
          </p>
        </div>

        {/* Tech Grid */}
        <div className="flex flex-wrap justify-center gap-4">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="px-6 py-3 rounded-full bg-muted/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
            >
              <span className="font-medium group-hover:text-primary transition-colors">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSection;
