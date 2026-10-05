import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Bun.env.SUPABASE_URL;
const supabaseServiceKey = Bun.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
	throw new Error("Critical error: Supabase environment variables not found in .env file");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
	auth: {
		persistSession: false,
	},
});

console.log("✅ Supabase client initialization was successful.");
