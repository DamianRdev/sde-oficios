import { MessageCircle } from "lucide-react";

const WA_NUMBER = "543854026867"; // Argentina +54 + número sin 0
const WA_MESSAGE = encodeURIComponent(
    "Hola! Te escribo desde SDE Oficios. Tengo una consulta 👋"
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const WhatsAppFloat = () => (
    <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacto de Soporte"
        className="
      fixed bottom-5 right-5 z-50
      flex h-14 w-14 items-center justify-center
      rounded-full bg-[#25D366] shadow-lg
      transition-all duration-300
      hover:scale-110 hover:shadow-2xl
      active:scale-95
      group
    "
    >
        {/* Ícono SVG oficial de WhatsApp */}
        <svg
            viewBox="0 0 32 32"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
        >
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.52.691 4.876 1.894 6.898L2 30l7.338-1.872A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.4a11.372 11.372 0 0 1-5.8-1.587l-.416-.247-4.352 1.11 1.137-4.226-.272-.434A11.312 11.312 0 0 1 4.6 16c0-6.285 5.115-11.4 11.4-11.4S27.4 9.715 27.4 16 22.285 27.4 16 27.4zm6.24-8.528c-.34-.17-2.012-1-2.327-1.112-.313-.113-.542-.17-.77.17s-.884 1.113-1.082 1.341c-.2.228-.4.257-.74.086-.34-.17-1.437-.53-2.738-1.693-1.012-.904-1.695-2.02-1.893-2.36-.2-.34-.021-.523.15-.693.154-.153.34-.4.51-.6.17-.198.226-.34.34-.566.114-.228.057-.428-.028-.6-.086-.17-.77-1.857-1.055-2.543-.278-.668-.56-.577-.77-.588l-.654-.011c-.228 0-.598.086-.912.428s-1.197 1.17-1.197 2.855 1.225 3.313 1.396 3.541c.17.228 2.41 3.682 5.84 5.163.817.352 1.454.562 1.951.72.82.26 1.567.224 2.157.136.659-.099 2.012-.822 2.297-1.617.284-.794.284-1.474.2-1.617-.086-.14-.313-.228-.654-.4z" />
        </svg>

        {/* Tooltip al hacer hover (burbuja de chat) */}
        <span className="
            pointer-events-none absolute right-[70px] top-1/2 -translate-y-1/2
            whitespace-nowrap rounded-xl bg-foreground px-4 py-2.5
            text-[13px] font-bold text-background shadow-xl
            opacity-0 scale-95 transition-all duration-300
            group-hover:opacity-100 group-hover:scale-100
        ">
            ¿Necesitás ayuda?
            {/* Flechita del globo */}
            <span className="absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 rounded-sm bg-foreground" />
        </span>

        {/* Pulso animado */}
        <span className="absolute -inset-1 animate-ping rounded-full bg-[#25D366] opacity-20" />
    </a>
);

export default WhatsAppFloat;
