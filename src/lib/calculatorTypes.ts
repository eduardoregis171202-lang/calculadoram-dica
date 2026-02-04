import { 
  Droplets, 
  FlaskConical, 
  Activity, 
  Scale, 
  Wind, 
  Syringe, 
  Heart, 
  Baby, 
  Brain,
  LucideIcon
} from 'lucide-react';

export interface CalculatorInfo {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgColorClass: string;
  route: string;
  category: 'essential' | 'specialized' | 'assessment';
}

export const calculators: CalculatorInfo[] = [
  {
    id: 'drip',
    name: 'Calculadora de Gotejamento',
    shortName: 'Gotejamento',
    description: 'Cálculo de gotas/minuto ou microgotas para soro e medicações IV',
    icon: Droplets,
    colorClass: 'text-calc-drip',
    bgColorClass: 'bg-calc-drip/10',
    route: '/calculadoras/gotejamento',
    category: 'essential',
  },
  {
    id: 'dilution',
    name: 'Conversor de Diluição',
    shortName: 'Diluição',
    description: 'Assistente para rediluição de medicamentos em pó',
    icon: FlaskConical,
    colorClass: 'text-calc-dilution',
    bgColorClass: 'bg-calc-dilution/10',
    route: '/calculadoras/diluicao',
    category: 'essential',
  },
  {
    id: 'hydro',
    name: 'Balanço Hídrico',
    shortName: 'Balanço Hídrico',
    description: 'Análise de entradas e saídas de líquidos do paciente',
    icon: Activity,
    colorClass: 'text-calc-hydro',
    bgColorClass: 'bg-calc-hydro/10',
    route: '/calculadoras/balanco-hidrico',
    category: 'essential',
  },
  {
    id: 'imc',
    name: 'IMC e Superfície Corporal',
    shortName: 'IMC/SC',
    description: 'Índice de Massa Corporal e Superfície Corporal para ajustes de doses',
    icon: Scale,
    colorClass: 'text-calc-imc',
    bgColorClass: 'bg-calc-imc/10',
    route: '/calculadoras/imc',
    category: 'assessment',
  },
  {
    id: 'oxygen',
    name: 'Estimativa de Tanque de O₂',
    shortName: 'Tanque O₂',
    description: 'Cálculo de autonomia de cilindros de oxigênio',
    icon: Wind,
    colorClass: 'text-calc-oxygen',
    bgColorClass: 'bg-calc-oxygen/10',
    route: '/calculadoras/oxigenio',
    category: 'specialized',
  },
  {
    id: 'insulin',
    name: 'Conversor de Insulina',
    shortName: 'Insulina',
    description: 'Conversão de unidades para diferentes graduações de seringas',
    icon: Syringe,
    colorClass: 'text-calc-insulin',
    bgColorClass: 'bg-calc-insulin/10',
    route: '/calculadoras/insulina',
    category: 'specialized',
  },
  {
    id: 'heparin',
    name: 'Calculadora de Heparina',
    shortName: 'Heparina',
    description: 'Ajuste de vazão baseado em protocolos de peso',
    icon: Heart,
    colorClass: 'text-calc-heparin',
    bgColorClass: 'bg-calc-heparin/10',
    route: '/calculadoras/heparina',
    category: 'specialized',
  },
  {
    id: 'dpp',
    name: 'Data Provável de Parto',
    shortName: 'DPP',
    description: 'Cálculo da DPP e idade gestacional baseado na DUM',
    icon: Baby,
    colorClass: 'text-calc-dpp',
    bgColorClass: 'bg-calc-dpp/10',
    route: '/calculadoras/dpp',
    category: 'specialized',
  },
  {
    id: 'glasgow',
    name: 'Escala de Glasgow',
    shortName: 'Glasgow',
    description: 'Checklist interativo para pontuar níveis de consciência',
    icon: Brain,
    colorClass: 'text-calc-glasgow',
    bgColorClass: 'bg-calc-glasgow/10',
    route: '/calculadoras/glasgow',
    category: 'assessment',
  },
];

export const getCalculatorById = (id: string): CalculatorInfo | undefined => {
  return calculators.find(calc => calc.id === id);
};

export const getCalculatorsByCategory = (category: CalculatorInfo['category']): CalculatorInfo[] => {
  return calculators.filter(calc => calc.category === category);
};
