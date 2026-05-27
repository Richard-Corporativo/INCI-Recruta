/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: CORS_HEADERS });
    }

    try {
        // 1. Verificar session do chamador
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
            });
        }

        const callerToken = authHeader.replace("Bearer ", "");
        const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // 2. Resolver identidade do chamador via JWT
        const { data: { user: callerAuth }, error: authError } = await serviceClient.auth.getUser(callerToken);
        if (authError || !callerAuth) {
            return new Response(JSON.stringify({ error: "Invalid token" }), {
                status: 401, headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
            });
        }

        // 3. Validar role do chamador via company_members (não user_metadata)
        const { data: callerMember } = await serviceClient
            .from("company_members")
            .select("role, company_id")
            .eq("user_id", callerAuth.id)
            .eq("status", "active")
            .maybeSingle();

        const allowedRoles = ["owner", "admin"];
        if (!callerMember || !allowedRoles.includes(callerMember.role)) {
            return new Response(JSON.stringify({ error: "Forbidden: insufficient role" }), {
                status: 403, headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
            });
        }

        const callerCompanyId = callerMember.company_id;

        // 4. Ler payload
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return new Response(JSON.stringify({ error: "Missing required field: id" }), {
                status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
            });
        }

        // 5. Confirmar que o usuário alvo pertence à mesma empresa do chamador
        const { data: targetUser } = await serviceClient
            .from("users")
            .select("id, company_id")
            .eq("id", id)
            .eq("company_id", callerCompanyId)
            .maybeSingle();

        if (!targetUser) {
            return new Response(JSON.stringify({ error: "User not found or access denied" }), {
                status: 403, headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
            });
        }

        // 6. Campos permitidos para atualização (excluir company_id e id para evitar cross-tenant)
        const { id: _id, company_id: _cid, ...safeUpdates } = updates;

        const { data: updated, error: updateError } = await serviceClient
            .from("users")
            .update({ ...safeUpdates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .eq("company_id", callerCompanyId)
            .select()
            .single();

        if (updateError) {
            return new Response(JSON.stringify({ error: updateError.message }), {
                status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
            });
        }

        // 7. Sincronizar role em company_members se foi alterado
        if (safeUpdates.role) {
            await serviceClient
                .from("company_members")
                .update({ role: safeUpdates.role })
                .eq("user_id", id)
                .eq("company_id", callerCompanyId);
        }

        return new Response(JSON.stringify(updated), {
            status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });

    } catch (err: any) {
        console.error("[update-user-admin] Unexpected error:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
    }
});
