import { createClient } from "@supabase/supabase-js";

const SERVER_TRANSLATIONS = {
	os: {
		fieldsRequired: "Дӕ хорзӕхӕй, баффысс ацы дыууӕ полейы!",
		usernameTaken: "Ацы фӕсном («Архайагы ном») занят у, равзар æндæр",
		userNotFound: "Ахæм фæсномæй архайæг нæ разынд",
		wrongPassword: "Сусæг дих (пароль) раст нæу! Сгæрс ут!",
		serverError: "Сервер фæллад у, фæстæдæр бавзар",
		regSuccess: "Ӕнтыстджынӕй регистраци рацыдтӕ!",
		authSuccess: "Уæлахиз бацыд!",
	},
	en: {
		fieldsRequired: "Username and password are required!",
		usernameTaken: "This username is already taken",
		userNotFound: "User with this username not found",
		wrongPassword: "Invalid password! Please try again !",
		serverError: "Internal server error, try again later",
		regSuccess: "Successfully registered!",
		authSuccess: "Successful login!",
	},
};

export const authController = {
	register: async ({ body }: { body: any }) => {
		const { username, password, lang } = body;
		const currentLang = lang === "en" ? "en" : "os";
		const t = SERVER_TRANSLATIONS[currentLang];

		if (!username || !password) {
			return { success: false, error: t.fieldsRequired };
		}

		try {
			const cleanUsername = username.trim();

			const supabaseUrl = Bun.env.SUPABASE_URL;
			const supabaseServiceKey = Bun.env.SUPABASE_SERVICE_ROLE_KEY;

			if (!supabaseUrl || !supabaseServiceKey) {
				return { success: false, error: "Critical error: Supabase keys not found" };
			}

			const freshSupabase = createClient(supabaseUrl, supabaseServiceKey, {
				auth: { persistSession: false },
			});

			const { data: existingUser } = await freshSupabase
				.from("users")
				.select("username")
				.eq("username", cleanUsername)
				.maybeSingle();

			if (existingUser) {
				return { success: false, error: t.usernameTaken };
			}

			const virtualEmail = `${cleanUsername.toLowerCase()}@letstalk.local`;

			const { data: authData, error: authError } = await freshSupabase.auth.admin.createUser({
				email: virtualEmail,
				password: password,
				email_confirm: true,
			});

			if (authError) {
				return {
					success: false,
					error:
						authError.message === "Password should be at least 6 characters" && currentLang === "os"
							? "Сусæг дих хъуамæ 6 символæй къаддæр ма уа ❌"
							: authError.message,
				};
			}

			const { error: userError } = await freshSupabase.from("users").insert([
				{
					id: authData.user!.id,
					email: virtualEmail,
					username: cleanUsername,
					avatar_url: null,
				},
			]);

			if (userError) {
				return { success: false, error: userError.message };
			}

			return {
				success: true,
				message: t.regSuccess,
			};
		} catch (error: any) {
			return { success: false, error: t.serverError };
		}
	},

	login: async ({ body }: { body: any }) => {
		const { username, password, lang } = body;
		const currentLang = lang === "en" ? "en" : "os";
		const t = SERVER_TRANSLATIONS[currentLang];

		if (!username || !password) {
			return { success: false, error: t.fieldsRequired };
		}

		try {
			const cleanUsername = username.trim();

			const supabaseUrl = Bun.env.SUPABASE_URL;
			const supabaseServiceKey = Bun.env.SUPABASE_SERVICE_ROLE_KEY;

			if (!supabaseUrl || !supabaseServiceKey) {
				return { success: false, error: "Critical error: Supabase keys not found" };
			}

			const freshSupabase = createClient(supabaseUrl, supabaseServiceKey, {
				auth: { persistSession: false },
			});

			const { data: foundUser, error: findError } = await freshSupabase
				.from("users")
				.select("email, username")
				.eq("username", cleanUsername)
				.maybeSingle();

			if (findError || !foundUser) {
				return { success: false, error: t.userNotFound };
			}

			const { data, error } = await freshSupabase.auth.signInWithPassword({
				email: foundUser.email,
				password,
			});

			if (error) {
				if (error.message === "Invalid login credentials") {
					return { success: false, error: t.wrongPassword };
				}
				return { success: false, error: error.message };
			}

			const { data: userData } = await freshSupabase.from("users").select("*").eq("id", data.user?.id).single();

			return {
				success: true,
				message: t.authSuccess,
				token: data.session?.access_token,
				user: userData,
			};
		} catch (error: any) {
			return { success: false, error: t.serverError };
		}
	},
};
