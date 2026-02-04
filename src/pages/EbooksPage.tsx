import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Droplets, 
  FlaskConical, 
  Activity, 
  Scale, 
  Wind, 
  Syringe, 
  Heart, 
  Baby, 
  Brain 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EbookInfo {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  bgColorClass: string;
  topics: string[];
}

const ebooks: EbookInfo[] = [
  {
    id: 'drip',
    title: 'Guia de Gotejamento IV',
    description: 'Tudo sobre cálculo de gotas e microgotas para infusões',
    icon: Droplets,
    colorClass: 'text-calc-drip',
    bgColorClass: 'bg-calc-drip/10',
    topics: ['Fórmulas de gotejamento', 'Equipo macro vs micro', 'Exemplos práticos'],
  },
  {
    id: 'dilution',
    title: 'Manual de Rediluição',
    description: 'Guia completo para rediluição de medicamentos em pó',
    icon: FlaskConical,
    colorClass: 'text-calc-dilution',
    bgColorClass: 'bg-calc-dilution/10',
    topics: ['Princípios de diluição', 'Medicamentos comuns', 'Cálculos de concentração'],
  },
  {
    id: 'hydro',
    title: 'Balanço Hídrico na Prática',
    description: 'Como realizar e interpretar o balanço hídrico',
    icon: Activity,
    colorClass: 'text-calc-hydro',
    bgColorClass: 'bg-calc-hydro/10',
    topics: ['Entradas e saídas', 'Interpretação de resultados', 'Casos clínicos'],
  },
  {
    id: 'imc',
    title: 'IMC e Superfície Corporal',
    description: 'Avaliação antropométrica para ajustes de doses',
    icon: Scale,
    colorClass: 'text-calc-imc',
    bgColorClass: 'bg-calc-imc/10',
    topics: ['Classificação de IMC', 'Fórmula de Mosteller', 'Ajuste de doses'],
  },
  {
    id: 'oxygen',
    title: 'Oxigenoterapia com Cilindros',
    description: 'Cálculo de autonomia de tanques de O₂',
    icon: Wind,
    colorClass: 'text-calc-oxygen',
    bgColorClass: 'bg-calc-oxygen/10',
    topics: ['Tipos de cilindros', 'Fator de conversão', 'Fluxo e duração'],
  },
  {
    id: 'insulin',
    title: 'Insulina: Conversão de Seringas',
    description: 'Guia visual para diferentes graduações de seringas',
    icon: Syringe,
    colorClass: 'text-calc-insulin',
    bgColorClass: 'bg-calc-insulin/10',
    topics: ['Tipos de seringas', 'Conversão de unidades', 'Técnica de aplicação'],
  },
  {
    id: 'heparin',
    title: 'Protocolo de Heparina',
    description: 'Ajuste de vazão baseado em peso do paciente',
    icon: Heart,
    colorClass: 'text-calc-heparin',
    bgColorClass: 'bg-calc-heparin/10',
    topics: ['Protocolos de peso', 'Ajustes de dose', 'Monitoramento'],
  },
  {
    id: 'dpp',
    title: 'Idade Gestacional e DPP',
    description: 'Cálculo da data provável de parto',
    icon: Baby,
    colorClass: 'text-calc-dpp',
    bgColorClass: 'bg-calc-dpp/10',
    topics: ['Regra de Naegele', 'Idade gestacional', 'Trimestres'],
  },
  {
    id: 'glasgow',
    title: 'Escala de Coma de Glasgow',
    description: 'Avaliação completa do nível de consciência',
    icon: Brain,
    colorClass: 'text-calc-glasgow',
    bgColorClass: 'bg-calc-glasgow/10',
    topics: ['Parâmetros de avaliação', 'Pontuação e classificação', 'Quando aplicar'],
  },
];

const EbooksPage = () => {
  const handleDownload = (ebookId: string) => {
    // In a real implementation, this would trigger PDF download
    // For now, we'll show an alert
    alert(`O eBook "${ebooks.find(e => e.id === ebookId)?.title}" estará disponível em breve!`);
  };

  return (
    <MainLayout title="eBooks Educativos" showBackButton>
      <div className="space-y-6 animate-fade-in">
        <p className="text-muted-foreground">
          Material educativo complementar para cada calculadora. Baixe os PDFs para estudar offline.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ebooks.map((ebook) => (
            <Card key={ebook.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className={cn('p-2.5 rounded-xl w-fit', ebook.bgColorClass)}>
                  <ebook.icon className={cn('w-6 h-6', ebook.colorClass)} />
                </div>
                <CardTitle className="text-base mt-3">{ebook.title}</CardTitle>
                <CardDescription className="text-sm">
                  {ebook.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-0">
                <div className="space-y-2 mb-4">
                  {ebook.topics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3" />
                      {topic}
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleDownload(ebook.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground text-center">
              Os eBooks estão sendo desenvolvidos e serão disponibilizados em breve. 
              Fique atento às atualizações!
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EbooksPage;
