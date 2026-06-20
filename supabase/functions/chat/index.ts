import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `أنت المساعد الذكي لشركة أكواد تيكنولوجي، شركة برمجة متخصصة في تطوير البرمجيات والتطبيقات.

معلومات عن الشركة:
- نقدم خدمات: تطوير تطبيقات الموبايل، تطوير المواقع، حلول ERP، الذكاء الاصطناعي، الحوسبة السحابية، الأمن السيبراني، التسويق الرقمي، والدعم الفني
- نستخدم أحدث التقنيات: React, Flutter, Node.js, Python, وغيرها
- لدينا خبرة واسعة في خدمة العملاء من مختلف القطاعات
- من عملائنا: FIS, FIS Fashion, FIS Gold, FIS Learning

قواعد التعامل المهمة:
1. كن مهذباً ولطيفاً دائماً مهما كان أسلوب العميل
2. إذا استخدم العميل ألفاظاً غير لائقة أو شتائم، تجاهل الإساءة تماماً ورد بلطف شديد مثل: "أفهم أنك قد تكون منزعجاً، وأنا هنا لمساعدتك. كيف يمكنني خدمتك اليوم؟"
3. لا ترد أبداً بشكل سلبي أو عدواني
4. حول أي سلبية من العميل إلى إيجابية واعرض المساعدة
5. حافظ على الاحترافية في جميع الردود
6. قدم معلومات مفيدة عن خدمات الشركة
7. إذا لم تعرف إجابة، وجه العميل للتواصل المباشر مع الشركة
8. استخدم اللغة العربية بشكل أساسي

أمثلة للتعامل مع العملاء الغاضبين:
- إذا قال العميل كلاماً سيئاً: "أقدر تواصلك معنا! أنا هنا لمساعدتك بكل سرور. ما الذي يمكنني تقديمه لك؟"
- إذا كان منزعجاً: "أتفهم شعورك تماماً، ودعني أساعدك في حل هذا الأمر."

أجب بإيجاز ووضوح، واستخدم لغة ودية ومهنية.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, sessionId } = body as { messages?: unknown; sessionId?: unknown };

    // Validate messages: array, max 20 items, each {role: 'user'|'assistant', content: string <= 2000 chars}
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedMessages: { role: "user" | "assistant"; content: string }[] = [];
    for (const m of messages) {
      if (
        !m || typeof m !== "object" ||
        (m as any).role !== "user" && (m as any).role !== "assistant" ||
        typeof (m as any).content !== "string" ||
        (m as any).content.length === 0 ||
        (m as any).content.length > 2000
      ) {
        return new Response(JSON.stringify({ error: "Invalid message format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      sanitizedMessages.push({ role: (m as any).role, content: (m as any).content });
    }

    const safeSessionId = typeof sessionId === "string" && sessionId.length > 0 && sessionId.length <= 100
      ? sessionId
      : null;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Initialize Supabase client for saving messages
    let supabase = null;
    let conversationId = null;

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Get or create conversation
      if (safeSessionId) {
        const { data: existingConv } = await supabase
          .from("chat_conversations")
          .select("id")
          .eq("session_id", safeSessionId)
          .single();

        if (existingConv) {
          conversationId = existingConv.id;
        } else {
          const { data: newConv } = await supabase
            .from("chat_conversations")
            .insert({ session_id: safeSessionId })
            .select("id")
            .single();
          conversationId = newConv?.id;
        }

        // Save user message
        if (conversationId && sanitizedMessages.length > 0) {
          const lastMessage = sanitizedMessages[sanitizedMessages.length - 1];
          if (lastMessage.role === "user") {
            await supabase.from("chat_messages").insert({
              conversation_id: conversationId,
              role: "user",
              content: lastMessage.content,
            });
          }
        }
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...sanitizedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "الخدمة مشغولة حالياً، يرجى المحاولة لاحقاً" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى التواصل مع الإدارة" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "حدث خطأ في الخدمة" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For streaming, we need to collect the response to save it
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullAssistantContent = "";

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(encoder.encode(chunk));

            // Parse the chunk to extract content for saving
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const jsonStr = line.slice(6).trim();
                  if (jsonStr) {
                    const parsed = JSON.parse(jsonStr);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      fullAssistantContent += content;
                    }
                  }
                } catch {
                  // Ignore parse errors for partial chunks
                }
              }
            }
          }

          // Save assistant response after streaming completes
          if (supabase && conversationId && fullAssistantContent) {
            await supabase.from("chat_messages").insert({
              conversation_id: conversationId,
              role: "assistant",
              content: fullAssistantContent,
            });
          }

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: "حدث خطأ غير متوقع" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
