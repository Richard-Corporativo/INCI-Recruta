/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ALLOWED_ORIGINS = [
    Deno.env.get("SITE_URL"),
    "https://recruta.incibrasil.com.br",
].filter(Boolean) as string[];

function getCorsHeaders(origin: string | null): Record<string, string> {
    const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] ?? "";
    return {
        "Access-Control-Allow-Origin": allowed,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
}

Deno.serve(async (req: Request) => {
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    if (req.method === "OPTIONS") {
        if (origin && !ALLOWED_ORIGINS.includes(origin)) {
            return new Response("Forbidden", { status: 403 });
        }
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // 1. Verificar session do chamador
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        const callerToken = authHeader.replace("Bearer ", "");
        const callerClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // 2. Resolver identidade do chamador via JWT
        const { data: { user: callerAuth }, error: authError } = await callerClient.auth.getUser(callerToken);
        if (authError || !callerAuth) {
            return new Response(JSON.stringify({ error: "Invalid token" }), {
                status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // 3. Validar role do chamador via company_members (não user_metadata)
        const { data: callerMember } = await callerClient
            .from("company_members")
            .select("role, company_id")
            .eq("user_id", callerAuth.id)
            .eq("status", "active")
            .maybeSingle();

        const allowedRoles = ["owner", "admin"];
        if (!callerMember || !allowedRoles.includes(callerMember.role)) {
            return new Response(JSON.stringify({ error: "Forbidden: insufficient role" }), {
                status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        const callerCompanyId = callerMember.company_id;

        // 4. Ler payload
        const body = await req.json();
        const { name, email, password, role, department, status } = body;

        if (!name || !email || !password || !role) {
            return new Response(JSON.stringify({ error: "Missing required fields: name, email, password, role" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // 5. Criar usuário no Supabase Auth
        const { data: newAuth, error: createError } = await callerClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: name }
        });

        if (createError || !newAuth.user) {
            return new Response(JSON.stringify({ error: createError?.message || "Failed to create auth user" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        const userId = newAuth.user.id;

        // 6. Inserir perfil na tabela users (com company_id do chamador)
        const { data: newUser, error: userError } = await callerClient
            .from("users")
            .insert({
                id: userId,
                name,
                email,
                role,
                department: department ?? null,
                status: status ?? "active",
                company_id: callerCompanyId,
            })
            .select()
            .single();

        if (userError) {
            // Rollback: remover auth user criado
            await callerClient.auth.admin.deleteUser(userId);
            return new Response(JSON.stringify({ error: userError.message }), {
                status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // 7. Inserir em company_members
        await callerClient
            .from("company_members")
            .insert({
                user_id: userId,
                company_id: callerCompanyId,
                role,
                status: "active",
            });

        return new Response(JSON.stringify(newUser), {
            status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (err: any) {
        console.error("[create-user-admin] Unexpected error:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});
