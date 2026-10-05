import { supabase } from "../config/database";

export const authController = {
	register: async ({ body }: { body: any }) => {
		const { email, password, username } = body;

		if (!email || !password || !username) {
			return { success: false, error: "All fields (email, password, username) are required" };
		}

		try {
			const { data: authData, error: authError } = await supabase.auth.admin.createUser({
				email,
				password,
				email_confirm: true,
			});

			if (authError) {
				return { success: false, error: authError.message };
			}

			if (!authData.user) {
				return { success: false, error: "Failed to create user" };
			}

			const { data: userData, error: userError } = await supabase
				.from("users")
				.insert([
					{
						id: authData.user.id,
						email,
						username,
						avatar_url: null,
					},
				])
				.select()
				.single();

			if (userError) {
				return {
					success: false,
					error: `The user was created in Auth, but a database error occurred.: ${userError.message}`,
				};
			}

			return {
				success: true,
				message: "The user has been successfully registered!",
				user: userData,
			};
		} catch (error: any) {
			return { success: false, error: error.message || "Server error when logging in" };
		}
	},

	login: async ({ body }: { body: any }) => {
		const { email, password } = body;

		if (!email || !password) {
			return { success: false, error: "Email and password are required" };
		}

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				return { success: false, error: error.message };
			}

			const { data: userData } = await supabase.from("users").select("*").eq("id", data.user?.id).single();

			return {
				success: true,
				message: "Successful login",
				token: data.session?.access_token,
				user: userData,
			};
		} catch (error: any) {
			return { success: false, error: error.message || "Server error when logging in" };
		}
	},
};
