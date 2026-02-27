import { Shield, Fingerprint } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const Privacidad = () => {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 bg-muted/10 pb-20 pt-28">

                <div className="container mx-auto max-w-3xl px-4 md:px-6">
                    <div className="mb-10 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Fingerprint className="h-8 w-8" />
                        </div>
                        <h1 className="font-display text-4xl font-black text-foreground">
                            Políticas de Privacidad
                        </h1>
                        <p className="mt-4 text-muted-foreground">
                            Última actualización: Febrero de 2026
                        </p>
                    </div>

                    <div className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary max-w-none rounded-3xl border border-border bg-card p-6 md:p-10 shadow-sm">
                        <p>
                            En <strong>SDE Oficios</strong>, valoramos su privacidad y nos comprometemos a proteger los datos personales que nos proporcione al registrar su perfil en el directorio, conforme a la Ley N° 25.326 de Protección de Datos Personales de Argentina.
                        </p>

                        <h2>1. Datos Recopilados</h2>
                        <p>
                            Si usted es un <strong>Profesional</strong> que registra sus servicios:
                        </p>
                        <ul>
                            <li>Recopilamos su nombre, teléfono (WhatsApp), localidad de cobertura, oficio principal y foto de perfil o de trabajos.</li>
                            <li>También guardamos enlaces a sus redes sociales si decide proporcionarlas.</li>
                            <li>Esta información la proporciona usted de <strong>manera voluntaria</strong> para formar parte del directorio.</li>
                        </ul>
                        <p>
                            Si usted es un <strong>Cliente</strong> visitante:
                        </p>
                        <ul>
                            <li>Si envía un contacto directo por WhatsApp al profesional, usted comparte su número con este último, fuera de nuestra plataforma.</li>
                            <li>Si registra una reseña (comentario y calificación por estrellas), solicitamos un Nombre (visible) y Correo Electrónico (privado) para asegurar la transparencia del reclamo o agradecimiento.</li>
                        </ul>

                        <h2>2. Uso de la Información (Base de Datos)</h2>
                        <p>
                            La función principal de nuestro directorio es <strong>hacer públicos los perfiles profesionales</strong>.
                            Por lo tanto, usted autoriza a SDE Oficios a mostrar en internet la información suministrada al publicar su anuncio para que futuros clientes puedan encontrarlo.
                        </p>
                        <p>
                            Los datos recolectados no serán compartidos, vendidos, cedidos ni alquilados a empresas de marketing ni a terceros externos ajenos a las operaciones propias del sitio.
                        </p>

                        <h2>3. Datos Especialmente Sensibles</h2>
                        <p>
                            SDE Oficios <strong>NUNCA</strong> solicitará datos sensibles como:
                        </p>
                        <ul>
                            <li>Números completos de Tarjetas de Crédito, Débito, Alias o CBU.</li>
                            <li>Claves bancarias o tokens.</li>
                            <li>Fotografías de DNI.</li>
                        </ul>
                        <p>
                            <strong>Importante:</strong> Nuestro servicio de registro es y será 100% gratuito. Si alguien en nombre de la plataforma solicita pagos, se trata de una estafa y debe reportarlo.
                        </p>

                        <h2>4. Analíticas y Cookies</h2>
                        <p>
                            Usamos servicios estadísticos y analíticos (por ej: Google Analytics / Vercel Web Analytics) de forma <strong>anónima y agregada</strong>, para analizar el flujo de visitas, el comportamiento general en la página web y mejorar el diseño de experiencia (ej: clics en categorías o botones). Estas analíticas no trazan los perfiles ni nombres de los visitantes.
                        </p>

                        <h2>5. Derechos ARCO (Derechos del Titular)</h2>
                        <p>
                            El titular de los datos personales (el profesional suscripto o el cliente que dejó reseña) tiene la facultad de ejercer en cualquier momento sus derechos de <strong>A</strong>cceso, <strong>R</strong>ectificación, <strong>C</strong>ancelación (Eliminar perfil/reseña) u <strong>O</strong>posición sobre sus datos almacenados.
                        </p>
                        <p>
                            Puede solicitar la baja definitiva o corrección inmediata de un perfil enviando una solicitud directa vía formulario de "Contacto", WhatsApp Soporte o al correo oficial provisto al pie de esta página. El proceso será gratuito y rápido.
                        </p>
                        <p className="text-xs text-muted-foreground italic mt-6 border-t pt-4">
                            LA AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por el incumplimiento de las normas vigentes en materia de protección de datos personales.
                        </p>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default Privacidad;
