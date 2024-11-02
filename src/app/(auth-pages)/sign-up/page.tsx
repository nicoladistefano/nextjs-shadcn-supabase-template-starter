"use client";

import React from 'react';
import {zodResolver} from "@hookform/resolvers/zod";
import {ControllerRenderProps, useForm} from "react-hook-form";
import * as z from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {signUpAction} from "@/actions/auth-actions";

const companySignupSchema = z.object({
    companyName: z.string().min(2, "Il nome dell'azienda deve avere almeno 2 caratteri"),
    email: z.string().email("Inserisci un indirizzo email valido"),
    lastName: z.string().min(1, "Inserisci un nome valido"),
    firstName: z.string().min(1, "Inserisci un cognome valido"),
    password: z.string().min(8, "La password deve avere almeno 8 caratteri"),
    vatNumber: z.string().min(11, "La partita IVA deve avere 11 caratteri").max(11, "La partita IVA deve avere 11 caratteri"),
    address: z.string().min(5, "L'indirizzo deve avere almeno 5 caratteri"),
    city: z.string().min(1, "La città è obbligatoria"),
});

type CompanySignupForm = z.infer<typeof companySignupSchema>;

export default function CompanySignup() {
    const form = useForm<CompanySignupForm>({
        resolver: zodResolver(companySignupSchema),
        defaultValues: {
            companyName: "",
            email: "",
            password: "",
            vatNumber: "",
            address: "",
            firstName: "",
            lastName: "",
            city: "",
        },
    });

    async function onSubmit(values: CompanySignupForm) {
        // Qui puoi chiamare la tua funzione signUpAction con i valori del form
        const data: any = {
            companyName: values.companyName,
            email: values.email,
            password: values.password,
            vatNumber: values.vatNumber,
            address: values.address,
            firstName: values.firstName,
            lastName: values.lastName,
            city: values.city
        }
        signUpAction(data).then(() => {
            // Redirect to login page
        });
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center">Registrazione Azienda</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({field}: { field: ControllerRenderProps<CompanySignupForm, "firstName"> }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({field}: { field: ControllerRenderProps<CompanySignupForm, "lastName"> }) => (
                            <FormItem>
                                <FormLabel>Cognome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Cognome" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({field}: { field: ControllerRenderProps<CompanySignupForm, "companyName"> }) => (
                            <FormItem>
                                <FormLabel>Nome Azienda</FormLabel>
                                <FormControl>
                                    <Input placeholder="Inserisci il nome dell'azienda" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vatNumber"
                        render={({field}: { field: ControllerRenderProps<CompanySignupForm, "vatNumber"> }) => (
                            <FormItem>
                                <FormLabel>Partita IVA</FormLabel>
                                <FormControl>
                                    <Input placeholder="Inserisci la partita IVA" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({field}: { field: ControllerRenderProps<CompanySignupForm, "address"> }) => (
                            <FormItem>
                                <FormLabel>Indirizzo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Inserisci l'indirizzo dell'azienda" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({field}: { field: ControllerRenderProps<CompanySignupForm, "city"> }) => (
                            <FormItem>
                                <FormLabel>Città</FormLabel>
                                <FormControl>
                                    <Input placeholder="Inserisci la città" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}: { field: ControllerRenderProps<CompanySignupForm, "email"> }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="azienda@esempio.com" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}: { field: ControllerRenderProps<CompanySignupForm, "password"> }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Inserisci la password" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Registrati</Button>
                </form>
            </Form>
            <p className="text-sm text-center">
                Hai già un account?{" "}
                <Link href="/sign-in" className="text-primary font-medium underline">
                    Accedi
                </Link>
            </p>
        </div>
    );
}
