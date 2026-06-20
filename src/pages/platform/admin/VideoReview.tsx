import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function VideoReview() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [reason, setReason] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const load = async () => {
    const q = supabase.from("lessons").select("*, courses(title, instructor_id)").order("created_at", { ascending: false });
    const { data } = filter === "all" ? await q : await q.eq("status", filter);
    setList(data || []);
  };
  useEffect(() => { load(); }, [filter]);

  const approve = async (id: string) => {
    const { error } = await supabase.from("lessons").update({ status: "approved", reviewed_by: user?.id, reviewed_at: new Date().toISOString(), reject_reason: null }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("تم الاعتماد"); load(); }
  };
  const reject = async (id: string) => {
    const r = reason[id] || "غير مناسب";
    const { error } = await supabase.from("lessons").update({ status: "rejected", reviewed_by: user?.id, reviewed_at: new Date().toISOString(), reject_reason: r }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("تم الرفض"); load(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f === "pending" ? "بانتظار" : f === "approved" ? "معتمد" : f === "rejected" ? "مرفوض" : "الكل"}
          </Button>
        ))}
      </div>
      {list.length === 0 && <Card className="p-6 text-muted-foreground">لا توجد فيديوهات.</Card>}
      {list.map((l) => (
        <Card key={l.id} className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold">{l.title}</div>
              <div className="text-xs text-muted-foreground">دورة: {l.courses?.title}</div>
              <a href={l.video_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline break-all">{l.video_url}</a>
            </div>
            <Badge variant={l.status === "approved" ? "default" : l.status === "rejected" ? "destructive" : "secondary"}>{l.status}</Badge>
          </div>
          {l.status === "pending" && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="سبب الرفض (اختياري)" value={reason[l.id] || ""} onChange={(e) => setReason({ ...reason, [l.id]: e.target.value })} />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => approve(l.id)}>اعتماد</Button>
                <Button size="sm" variant="destructive" onClick={() => reject(l.id)}>رفض</Button>
              </div>
            </div>
          )}
          {l.reject_reason && <div className="text-xs text-red-500">سبب الرفض: {l.reject_reason}</div>}
        </Card>
      ))}
    </div>
  );
}
