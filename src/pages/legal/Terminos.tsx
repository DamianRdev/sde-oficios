import { Shield, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const Terminos = () => {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 bg-muted/10 pb-20 pt-28">

                <div className="container mx-auto max-w-3xl px-4 md:px-6">
                    <div className="mb-10 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <FileText className="h-8 w-8" />
                        </div>
                        <h1 className="font-display text-4xl font-black text-foreground">
                            Términos y Condiciones
                        </h1>
                        <p className="mt-4 text-muted-foreground">
                            Última actualización: Febrero de 2026
                        </p>
                    </div>

                    <div className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-primary max-w-none rounded-3xl border border-border bg-card p-6 md:p-10 shadow-sm">
                        <h2>1. Naturaleza del Servicio</h2>
                        <p>
                            <strong>SDE Oficios</strong> es un directorio web gratuito y de libre acceso cuyo único propósito es facilitar el contacto entre usuarios (en adelante "Clientes") y trabajadores independientes (en adelante "Profesionales") que ofrecen servicios en la provincia de Santiago del Estero, Argentina.
                        </p>
                        <p>
                            La plataforma <strong>NO interviene</strong> en las negociaciones, <strong>NO es intermediaria</strong> de pagos, <strong>NO cobra comisiones</strong> por los trabajos realizados y <strong>NO es empleadora</strong> de los profesionales listados.
                        </p>

                        <h2>2. Responsabilidad</h2>
                        <p>
                            Al ser un espacio exclusivamente de exhibición y contacto:
                        </p>
                        <ul>
                            <li>SDE Oficios no se responsabiliza por la calidad, garantía, precio o cumplimiento de los trabajos y servicios prestados por los profesionales listados.</li>
                            <li>La plataforma no verifica exhaustivamente la idoneidad técnica o los antecedentes legales de los profesionales publicados, más allá de la validación básica de identidad (tildes de verificación).</li>
                            <li>Cualquier reclamo por daños, mala praxis, estafas, o incumplimientos contractuales deberá ser resuelto de forma privada y directa entre el Cliente y el Profesional, eximiendo a SDE Oficios de toda responsabilidad civil o penal.</li>
                        </ul>
                        <p>
                            Recomendamos a los Clientes tomar los recaudos necesarios antes de contratar (pedir referencias, cuit, presupuestos por escrito, etc).
                        </p>

                        <h2>3. Reglas para los Profesionales (Usuarios Publicantes)</h2>
                        <p>
                            Todo Profesional que registre su oficio en la plataforma se compromete a:
                        </p>
                        <ul>
                            <li>Brindar información real, comprobable y actualizada sobre su identidad y medios de contacto.</li>
                            <li>No publicar oficios ilegales, servicios que fomenten el odio, o contenido inapropiado.</li>
                            <li>No subir fotografías con derechos de autor de terceros o que muestren rostros de clientes sin su expreso consentimiento.</li>
                        </ul>

                        <h2>4. Derecho de Admisión y Moderación</h2>
                        <p>
                            SDE Oficios se reserva el estricto derecho de admisión y permanencia. La administración podrá eliminar, suspender o modificar cualquier perfil profesional sin previo aviso si:
                        </p>
                        <ul>
                            <li>Se detectan datos falsos.</li>
                            <li>Se reciben múltiples denuncias fundadas por parte de usuarios sobre estafas o maltratos verificables.</li>
                            <li>El perfil viola cualquiera de estas regulaciones.</li>
                        </ul>

                        <h2>5. Sistema de Reseñas</h2>
                        <p>
                            Las reseñas dejadas por los Clientes reflejan únicamente la opinión de su autor. SDE Oficios modera las reseñas para evitar insultos y lenguaje inapropiado, pero no garantiza la veracidad absoluta de cada reclamo o elogio, siendo el autor el único responsable por sus dichos.
                        </p>

                        <h2>6. Cese del Servicio</h2>
                        <p>
                            SDE Oficios es un proyecto autogestionado y se reserva el derecho de modificar, pausar o dar de baja el directorio completo en cualquier momento, sin que ello genere derecho a reclamo o indemnización alguna para los usuarios o profesionales inscriptos.
                        </p>

                        <h2>7. Contacto</h2>
                        <p>
                            Para denunciar un perfil malicioso, solicitar soporte o sugerencias, puede comunicarse a través del correo oficial de la plataforma provisto en el área de contacto.
                        </p>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default Terminos;
