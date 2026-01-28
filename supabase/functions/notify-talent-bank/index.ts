import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RH_NOTIFICATIONS_EMAIL = Deno.env.get("RH_NOTIFICATIONS_EMAIL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface Candidate {
    name: string;
    email: string;
    location?: string;
    applied_at: string;
    id: string;
}

Deno.serve(async (req) => {
    // CORS handling
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
            }
        });
    }

    try {
        const { candidate }: { candidate: Candidate } = await req.json();

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Supabase internal config missing");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // 1. Spam Protection (Debounce: 10 minutes)
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

        const { data: existingLogs } = await supabase
            .from('notification_logs')
            .select('id')
            .eq('email', candidate.email)
            .eq('notification_type', 'talent_bank_registration')
            .gt('sent_at', tenMinutesAgo)
            .maybeSingle();

        if (existingLogs) {
            console.log(`Notification for ${candidate.email} suppressed (debounced).`);
            return new Response(JSON.stringify({ message: "Notification debounced" }), {
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                status: 200,
            });
        }

        if (!RH_NOTIFICATIONS_EMAIL) {
            console.error("RH_NOTIFICATIONS_EMAIL not configured");
            return new Response(JSON.stringify({ error: "Configuration missing" }), { status: 500 });
        }

        if (!RESEND_API_KEY) {
            console.warn("RESEND_API_KEY not found. Logging notification to console for now.");
            console.log(`[NOTIFICATION MOCK] To: ${RH_NOTIFICATIONS_EMAIL}`);

            // Still log to table to maintain the debounce logic
            await supabase.from('notification_logs').insert({
                email: candidate.email,
                notification_type: 'talent_bank_registration'
            });

            return new Response(JSON.stringify({ message: "Mocked notification success" }), {
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                status: 200,
            });
        }

        // 2. Send email via Resend
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "INCI Recruta <noreply@incirecruta.com.br>",
                to: [RH_NOTIFICATIONS_EMAIL],
                subject: "Novo cadastro no Banco de Talentos",
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #3b82f6; color: white; padding: 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 20px;">Novo Talento Identificado!</h1>
            </div>
            <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
              <p>Olá Equipe de RH,</p>
              <p>Um novo profissional acaba de se cadastrar em seu <strong>Banco de Talentos</strong> (candidatura espontânea).</p>
              
              <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 4px 0;"><strong>Nome:</strong> ${candidate.name}</p>
                <p style="margin: 4px 0;"><strong>E-mail:</strong> ${candidate.email}</p>
                <p style="margin: 4px 0;"><strong>Localização:</strong> ${candidate.location || "Não informada"}</p>
                <p style="margin: 4px 0;"><strong>Data:</strong> ${new Date(candidate.applied_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
              </div>

              <p style="font-size: 14px; color: #64748b;">Esse profissional fez um cadastro espontâneo e não está vinculado a uma vaga específica no momento.</p>

              <div style="text-align: center; margin-top: 32px;">
                <a href="https://incirecruta.com.br/admin/talent-bank?id=${candidate.id}" 
                   style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                   Visualizar Perfil no Admin
                </a>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
              &copy; 2026 INCI Recruta - Sistema ATS
            </div>
          </div>
        `,
            }),
        });

        const result = await res.json();

        if (res.ok) {
            // 3. Log the successful notification
            await supabase.from('notification_logs').insert({
                email: candidate.email,
                notification_type: 'talent_bank_registration'
            });
        }

        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            status: 200,
        });

    } catch (error) {
        console.error("Error in Edge Function:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            status: 400,
        });
    }
});
