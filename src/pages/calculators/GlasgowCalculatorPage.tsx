import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, Eye, MessageSquare, Hand, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';
import { cn } from '@/lib/utils';

interface GlasgowCriteria {
  category: string;
  icon: React.ElementType;
  options: { value: number; label: string; description: string }[];
}

const glasgowCriteria: GlasgowCriteria[] = [
  {
    category: 'Abertura Ocular (O)',
    icon: Eye,
    options: [
      { value: 4, label: 'Espontânea', description: 'Abre os olhos espontaneamente' },
      { value: 3, label: 'À voz', description: 'Abre os olhos ao comando verbal' },
      { value: 2, label: 'À dor', description: 'Abre os olhos apenas com estímulo doloroso' },
      { value: 1, label: 'Ausente', description: 'Não abre os olhos' },
    ],
  },
  {
    category: 'Resposta Verbal (V)',
    icon: MessageSquare,
    options: [
      { value: 5, label: 'Orientada', description: 'Responde coerentemente' },
      { value: 4, label: 'Confusa', description: 'Fala, mas desorientado' },
      { value: 3, label: 'Palavras inapropriadas', description: 'Palavras desconexas' },
      { value: 2, label: 'Sons incompreensíveis', description: 'Gemidos, sons sem palavras' },
      { value: 1, label: 'Ausente', description: 'Não responde verbalmente' },
    ],
  },
  {
    category: 'Resposta Motora (M)',
    icon: Hand,
    options: [
      { value: 6, label: 'Obedece comandos', description: 'Executa movimentos solicitados' },
      { value: 5, label: 'Localiza dor', description: 'Move-se em direção ao estímulo' },
      { value: 4, label: 'Flexão normal', description: 'Retira membro do estímulo' },
      { value: 3, label: 'Flexão anormal', description: 'Postura de decorticação' },
      { value: 2, label: 'Extensão', description: 'Postura de descerebração' },
      { value: 1, label: 'Ausente', description: 'Sem resposta motora' },
    ],
  },
];

const GlasgowCalculatorPage = () => {
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const { addEntry } = useCalculatorHistory();

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const isComplete = Object.keys(scores).length === 3;

  const getClassification = () => {
    if (!isComplete) return null;
    
    if (totalScore >= 13) {
      return { 
        label: 'TCE Leve', 
        color: 'text-success', 
        bgColor: 'bg-success/10',
        description: 'Traumatismo cranioencefálico leve. Paciente geralmente alerta e orientado.' 
      };
    }
    if (totalScore >= 9) {
      return { 
        label: 'TCE Moderado', 
        color: 'text-warning', 
        bgColor: 'bg-warning/10',
        description: 'Traumatismo cranioencefálico moderado. Requer monitoramento intensivo.' 
      };
    }
    return { 
      label: 'TCE Grave', 
      color: 'text-destructive', 
      bgColor: 'bg-destructive/10',
      description: 'Traumatismo cranioencefálico grave. Coma. Intubação frequentemente necessária.' 
    };
  };

  const classification = getClassification();

  const saveToHistory = () => {
    if (!isComplete) return;

    addEntry(
      'glasgow',
      'Escala de Glasgow',
      {
        'Abertura Ocular': scores['Abertura Ocular (O)'] || 0,
        'Resposta Verbal': scores['Resposta Verbal (V)'] || 0,
        'Resposta Motora': scores['Resposta Motora (M)'] || 0,
      },
      `Glasgow ${totalScore} - ${classification?.label}`
    );
  };

  const clear = () => {
    setScores({});
  };

  const handleScoreChange = (category: string, value: string) => {
    setScores(prev => ({
      ...prev,
      [category]: parseInt(value),
    }));
  };

  return (
    <MainLayout title="Glasgow" showBackButton>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-calc-glasgow/10">
                <Brain className="w-8 h-8 text-calc-glasgow" />
              </div>
              <div>
                <CardTitle className="text-xl">Escala de Coma de Glasgow</CardTitle>
                <CardDescription>Checklist interativo para pontuar níveis de consciência</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Score Display */}
        <Card className={cn(
          'border-2 transition-all',
          classification ? classification.bgColor : 'bg-muted/50'
        )}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pontuação Total</p>
                <p className="text-4xl font-bold text-foreground">{isComplete ? totalScore : '--'}/15</p>
              </div>
              {classification && (
                <div className={cn('text-right', classification.color)}>
                  <p className="text-lg font-semibold">{classification.label}</p>
                  <p className="text-xs text-muted-foreground max-w-[200px]">
                    {classification.description}
                  </p>
                </div>
              )}
            </div>

            {/* Individual Scores */}
            {isComplete && (
              <div className="flex gap-4 mt-4 pt-4 border-t">
                <div className="flex-1 text-center">
                  <Eye className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">{scores['Abertura Ocular (O)']}</p>
                  <p className="text-xs text-muted-foreground">Ocular</p>
                </div>
                <div className="flex-1 text-center">
                  <MessageSquare className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">{scores['Resposta Verbal (V)']}</p>
                  <p className="text-xs text-muted-foreground">Verbal</p>
                </div>
                <div className="flex-1 text-center">
                  <Hand className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-bold">{scores['Resposta Motora (M)']}</p>
                  <p className="text-xs text-muted-foreground">Motora</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Criteria Cards */}
        {glasgowCriteria.map((criteria) => {
          const Icon = criteria.icon;
          const isSelected = scores[criteria.category] !== undefined;
          
          return (
            <Card key={criteria.category} className={cn(
              'transition-all',
              isSelected && 'border-primary/50'
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  {criteria.category}
                  {isSelected && <CheckCircle className="w-4 h-4 text-success ml-auto" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={scores[criteria.category]?.toString() || ''}
                  onValueChange={(value) => handleScoreChange(criteria.category, value)}
                  className="space-y-2"
                >
                  {criteria.options.map((option) => (
                    <div 
                      key={option.value}
                      className={cn(
                        'flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer',
                        scores[criteria.category] === option.value 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-muted/50'
                      )}
                      onClick={() => handleScoreChange(criteria.category, option.value.toString())}
                    >
                      <RadioGroupItem value={option.value.toString()} id={`${criteria.category}-${option.value}`} />
                      <div className="flex-1">
                        <Label 
                          htmlFor={`${criteria.category}-${option.value}`}
                          className="font-medium cursor-pointer"
                        >
                          {option.value} - {option.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          );
        })}

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={saveToHistory} className="flex-1" disabled={!isComplete}>
            Salvar no Histórico
          </Button>
          <Button variant="outline" onClick={clear}>
            Limpar
          </Button>
        </div>

        {/* Classification Reference */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Classificação de Referência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span><strong>13-15:</strong> TCE Leve</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span><strong>9-12:</strong> TCE Moderado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span><strong>3-8:</strong> TCE Grave (Coma)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p>A Escala de Glasgow deve ser aplicada por profissionais treinados.</p>
                <p className="mt-1">
                  <strong>Nota:</strong> Pacientes intubados não podem ser avaliados quanto à resposta verbal. 
                  Registre como "T" (tubo) ao lado da pontuação.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GlasgowCalculatorPage;
