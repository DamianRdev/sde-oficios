export type Oficio = "Electricista" | "Plomero" | "Gasista" | "Técnico de Electrodomésticos";
export type Zona = "Santiago del Estero" | "La Banda";

export interface Professional {
  id: string;
  nombre: string;
  oficio: Oficio;
  zona: Zona;
  disponible: boolean;
  verificado: boolean;
  destacado: boolean;
  telefono: string;
  foto: string;
  servicios: string[];
  horarios: string;
  descripcion: string;
}

export const oficios: Oficio[] = [
  "Electricista",
  "Plomero",
  "Gasista",
  "Técnico de Electrodomésticos",
];

export const zonas: Zona[] = ["Santiago del Estero", "La Banda"];

export const professionals: Professional[] = [
  {
    id: "1",
    nombre: "Carlos Herrera",
    oficio: "Electricista",
    zona: "Santiago del Estero",
    disponible: true,
    verificado: true,
    destacado: true,
    telefono: "5493854123456",
    foto: "",
    servicios: [
      "Instalaciones eléctricas domiciliarias",
      "Reparación de cortocircuitos",
      "Colocación de termotanques eléctricos",
      "Tableros y llaves térmicas",
    ],
    horarios: "Lunes a Viernes 8:00 - 18:00 | Sábados 8:00 - 13:00",
    descripcion: "Electricista matriculado con más de 15 años de experiencia en instalaciones residenciales y comerciales.",
  },
  {
    id: "2",
    nombre: "María González",
    oficio: "Plomero",
    zona: "La Banda",
    disponible: true,
    verificado: true,
    destacado: true,
    telefono: "5493854234567",
    foto: "",
    servicios: [
      "Destape de cañerías",
      "Instalación de grifería",
      "Reparación de pérdidas",
      "Instalación de tanques de agua",
    ],
    horarios: "Lunes a Sábado 7:00 - 19:00",
    descripcion: "Plomera profesional especializada en reparaciones de urgencia. Respuesta rápida y trabajo garantizado.",
  },
  {
    id: "3",
    nombre: "Roberto Paz",
    oficio: "Gasista",
    zona: "Santiago del Estero",
    disponible: true,
    verificado: true,
    destacado: false,
    telefono: "5493854345678",
    foto: "",
    servicios: [
      "Instalaciones de gas natural",
      "Revisión de artefactos",
      "Conexión de calefactores",
      "Certificaciones de gas",
    ],
    horarios: "Lunes a Viernes 8:00 - 17:00",
    descripcion: "Gasista matriculado. Habilitado para realizar instalaciones y certificaciones según normativa vigente.",
  },
  {
    id: "4",
    nombre: "Ana Figueroa",
    oficio: "Técnico de Electrodomésticos",
    zona: "La Banda",
    disponible: false,
    verificado: false,
    destacado: false,
    telefono: "5493854456789",
    foto: "",
    servicios: [
      "Reparación de lavarropas",
      "Service de heladeras",
      "Microondas y hornos eléctricos",
      "Aires acondicionados",
    ],
    horarios: "Lunes a Viernes 9:00 - 18:00",
    descripcion: "Técnica en electrodomésticos con servicio a domicilio. Presupuesto sin cargo.",
  },
  {
    id: "5",
    nombre: "Diego Romero",
    oficio: "Electricista",
    zona: "La Banda",
    disponible: true,
    verificado: false,
    destacado: false,
    telefono: "5493854567890",
    foto: "",
    servicios: [
      "Cableado estructurado",
      "Luminarias LED",
      "Mantenimiento eléctrico",
      "Puesta a tierra",
    ],
    horarios: "Lunes a Viernes 8:00 - 20:00 | Sábados 8:00 - 14:00",
    descripcion: "Electricista con experiencia en hogares y comercios. Atención rápida y presupuesto sin compromiso.",
  },
  {
    id: "6",
    nombre: "Lucía Ávila",
    oficio: "Plomero",
    zona: "Santiago del Estero",
    disponible: true,
    verificado: true,
    destacado: true,
    telefono: "5493854678901",
    foto: "",
    servicios: [
      "Plomería integral",
      "Cañerías de agua y cloacas",
      "Reparación de inodoros y bidet",
      "Cambio de canillas y flexibles",
    ],
    horarios: "Lunes a Sábado 7:30 - 18:30",
    descripcion: "Servicio de plomería con atención de urgencias las 24hs. Más de 10 años de trayectoria en Santiago.",
  },
];

export const getOficioIcon = (oficio: Oficio): string => {
  switch (oficio) {
    case "Electricista": return "Zap";
    case "Plomero": return "Droplets";
    case "Gasista": return "Flame";
    case "Técnico de Electrodomésticos": return "Wrench";
  }
};
