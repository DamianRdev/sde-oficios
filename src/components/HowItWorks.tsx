import { Search, MessageCircle, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Buscá",
    description: "Elegí el oficio que necesitás y tu zona.",
  },
  {
    icon: MessageCircle,
    title: "Contactá",
    description: "Escribile directo por WhatsApp. Sin intermediarios.",
  },
  {
    icon: ThumbsUp,
    title: "Resolvé",
    description: "El profesional va a tu domicilio y resuelve el problema.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-secondary/50 py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            ¿Cómo funciona?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Encontrá un profesional en 3 simples pasos
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="mb-1 text-xs font-semibold text-accent">Paso {index + 1}</span>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
