declare module "https://esm.sh/@supabase/supabase-js@2.39.0" {
  export { createClient } from "@supabase/supabase-js";
}

declare namespace Deno {
  interface Env {
    get(key: string): string | undefined;
  }

  const env: Env;

  function serve(
    handler: (request: Request) => Response | Promise<Response>,
  ): void;
}
