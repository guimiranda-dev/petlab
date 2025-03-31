"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login({ email }: { email: string }) {
	const supabase = await createClient();

	const response = await supabase.auth.signInWithOtp({
		email,
		options: {
			shouldCreateUser: false,
		},
	});

	return response;
}

export async function verifyOTP({
	code,
	email,
}: {
	code: string;
	email: string;
}) {
	const supabase = await createClient();

	const response = await supabase.auth.verifyOtp({
		email,
		token: code,
		type: "email",
	});

	return response;
}

export async function logout() {
	const supabase = await createClient();

	await supabase.auth.signOut();

	revalidatePath("/", "layout");
	redirect("/login");
}
