import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Loader2, Eye, EyeOff, AlertCircle, Clock } from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --- Schema de Validación Estricta ---
const loginSchema = z.object({
    email: z.string().email("Formato de email inválido").max(100, "El email es demasiado largo"),
    password: z.string().min(6, "Contraseña inválida").max(100, "La contraseña es demasiado larga"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
    const { signIn } = useAdminAuth();
    const navigate = useNavigate();

    // --- Seguridad: Rate Limiting Frontend (Local) ---
    const [attempts, setAttempts] = useState(0);
    const [lockoutEndsAt, setLockoutEndsAt] = useState<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(0);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    // Check Lockout Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (lockoutEndsAt) {
            interval = setInterval(() => {
                const now = Date.now();
                if (now >= lockoutEndsAt) {
                    setLockoutEndsAt(null);
                    setTimeRemaining(0);
                    setAttempts(0); // Optional: reset attempts after lockout, or keep them to enforce longer subsequent lockouts.
                } else {
                    setTimeRemaining(Math.ceil((lockoutEndsAt - now) / 1000));
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [lockoutEndsAt]);

    const onSubmit = async (data: LoginFormValues) => {
        if (lockoutEndsAt) return; // Prevent submission if locked out

        setError(null);
        setLoading(true);

        const { error: signInError } = await signIn(data.email, data.password);

        if (signInError) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            // Exponential Backoff Logic:
            // 3 attempts = 30s
            // 4 attempts = 60s
            // 5+ attempts = 300s (5m)
            if (newAttempts >= 3) {
                let lockoutDuration = 30000; // 30s default
                if (newAttempts === 4) lockoutDuration = 60000;
                if (newAttempts >= 5) lockoutDuration = 300000;

                setLockoutEndsAt(Date.now() + lockoutDuration);
                setError(`Demasiados intentos fallidos (HTTP 429). Cuenta bloqueada temporalmente por seguridad.`);
            } else {
                setError("Email o contraseña incorrectos.");
            }
            setLoading(false);
        } else {
            // Success
            setAttempts(0);
            navigate("/admin");
        }
    };



    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
            {/* Fondo decorativo */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
                        <Wrench className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-white">
                        Panel de Admin
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">OficiosSDE</p>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete="email"
                                placeholder="admin@ejemplo.com"
                                disabled={loading || lockoutEndsAt !== null}
                                {...register("email")}
                                className={`w-full rounded-lg border bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 disabled:opacity-50 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-700 focus:border-primary focus:ring-primary"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-[11px] text-red-400 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-300">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    disabled={loading || lockoutEndsAt !== null}
                                    {...register("password")}
                                    className={`w-full rounded-lg border bg-slate-800 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 disabled:opacity-50 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-slate-700 focus:border-primary focus:ring-primary"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white disabled:opacity-50"
                                    disabled={loading || lockoutEndsAt !== null}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-[11px] text-red-400 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Error Auth / Rate Limit */}
                        {error && (
                            <div className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Lockout Timer Warning */}
                        {lockoutEndsAt && (
                            <div className="flex gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-400">
                                <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>Por favor, espera <strong>{timeRemaining} segundos</strong> antes de intentar nuevamente.</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || lockoutEndsAt !== null}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Iniciando sesión...
                                </>
                            ) : (
                                "Ingresar al panel"
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-4 text-center text-xs text-slate-500">
                    Acceso restringido — Solo administradores
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
