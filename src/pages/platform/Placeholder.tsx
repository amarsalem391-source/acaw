export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">قريبًا — هذا القسم قيد التطوير</p>
      </div>
    </div>
  );
}
