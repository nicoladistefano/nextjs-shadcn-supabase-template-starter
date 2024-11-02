"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {createClient} from "../../utils/utils/supabase/server";
import {encodedRedirect} from "../../utils/utils/utils";

export const signUpAction = async (formData: any) => {
    const email = formData.email;
    const password = formData.password;
    const supabase = createClient();
    const origin = headers().get("origin");

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    return supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    }).then((signUpRes) => {
        console.log("signUpRes",signUpRes);
        console.log("userData", formData)
        supabase.from("users").insert([
            {
                email: email,
                first_name: formData.firstName,
                last_name: formData.lastName,
                user_id: signUpRes.data?.user?.id,
            },
        ]).select().then((res) => {
            console.log("usersRes",res);

            if(res && res.data && res?.data.length >= 0) {
                supabase.from("companies").insert([
                    {
                        company_name: formData.companyName,
                        vat_number: formData.vatNumber,
                        address: formData.address,
                        email: email,
                        city: formData.city,
                        user_id: res?.data[0].user_id,
                    },
                ]).then(
                    (res) => {
                        console.log("companiesRes", res);
                    }
                );
            }
        });
    }).catch((error) => {
        console.error(error.code + " " + error.message);
        return encodedRedirect("error", "/sign-up", error.message);
    }).finally(() => {
        return encodedRedirect(
            "success",
            "/sign-up",
            "Thanks for signing up! Please check your email for a verification link.",
        );
    });
};

export const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    console.log("error", error);
    console.log("USer", supabase.auth.getUser())

    if (error) {
        return encodedRedirect("error", "/sign-in", error.message);
    }

    return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const supabase = createClient();
    const origin = headers().get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
        return encodedRedirect("error", "/forgot-password", "Email is required");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
        console.error(error.message);
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Could not reset password",
        );
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect(
        "success",
        "/forgot-password",
        "Check your email for a link to reset your password.",
    );
};

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Password and confirm password are required",
        );
    }

    if (password !== confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Passwords do not match",
        );
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Password update failed",
        );
    }

    encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};

export const getUserData = async () => {
    const supabase = createClient();
    const user = supabase.auth.getUser();
    console.log("user", user);
    return user;
}
