import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';
import { cn } from '@/lib/utils';

interface IMCResult {
  imc: number;
  classification: string;
  colorClass: string;
}

const IMCCalculatorPage = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<IMCResult | null>(null);
  const { addEntry } = useCalculatorHistory();

  const getIMCClassification = (imc: number): { classification: string; colorClass: string } => {
    if (imc < 18.5) return { classification: 'Baixo peso', colorClass: 'text-info' };
    if (imc < 25) return { classification: 'Peso normal', colorClass: 'text-success' };
    if (imc < 30) return { classification: 'Sobrepeso', colorClass: 'text-warning' };
    if (imc < 35) return { classification: 'Obesidade grau I', colorClass: 'text-warning' };
    if (imc < 40) return { classification: 'Obesidade grau II', colorClass: 'text-destructive' };
    return { classification: 'Obesidade grau III', colorClass: 'text-destructive' };
  };

  const calculate = () => {
    const weightNum = parseFloat(weight);
    const heightCm = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightCm) || weightNum <= 0 || heightCm <= 0) {
      return;
    }

    const heightM = heightCm / 100;
    
    // IMC = peso (kg) / altura² (m)
    const imc = weightNum / (heightM * heightM);

    const { classification, colorClass } = getIMCClassification(imc);

    setResult({
      imc: Math.round(imc * 100) / 100,
      classification,
      colorClass,
    });

    addEntry(
      'imc',
      'Calculadora de IMC',
      { weight: weightNum, height: heightCm },
      `IMC: ${Math.round(imc * 100) / 100} kg/m² (${classification})`
    );
  };

  const clear = () => {
    setWeight('');
    setHeight('');
    setResult(null);
  };

  const isValid = weight && height && parseFloat(weight) > 0 && parseFloat(height) > 0;

  return (
    <MainLayout title="IMC" showBackButton>
      <CalculatorLayout
        title="Calculadora de IMC"
        description="Índice de Massa Corporal para avaliação nutricional"
        icon={Scale}
        colorClass="text-calc-imc"
        onCalculate={calculate}
        onClear={clear}
        isCalculateDisabled={!isValid}
        result={
          result ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Índice de Massa Corporal</p>
                <p className="text-4xl font-bold text-primary">{result.imc}</p>
                <p className="text-lg text-muted-foreground">kg/m²</p>
                <p className={cn('text-xl font-semibold mt-3', result.colorClass)}>
                  {result.classification}
                </p>
              </div>

              {/* IMC Scale Visual */}
              <div className="mt-6">
                <p className="text-xs text-muted-foreground mb-2 text-center">Escala de Classificação</p>
                <div className="h-4 rounded-full overflow-hidden flex shadow-inner">
                  <div className="flex-1 bg-info" title="Baixo peso (<18.5)" />
                  <div className="flex-1 bg-success" title="Normal (18.5-24.9)" />
                  <div className="flex-1 bg-warning" title="Sobrepeso (25-29.9)" />
                  <div className="flex-1 bg-warning/70" title="Obesidade I (30-34.9)" />
                  <div className="flex-1 bg-destructive" title="Obesidade II-III (≥35)" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                  <span>&lt;18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>35</span>
                  <span>40+</span>
                </div>
              </div>

              {/* Classification Table */}
              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <p className="text-sm font-medium mb-3 text-center">Classificação OMS</p>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-info" />
                      Baixo peso
                    </span>
                    <span className="text-muted-foreground">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      Peso normal
                    </span>
                    <span className="text-muted-foreground">18.5 - 24.9</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning" />
                      Sobrepeso
                    </span>
                    <span className="text-muted-foreground">25 - 29.9</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      Obesidade
                    </span>
                    <span className="text-muted-foreground">≥ 30</span>
                  </div>
                </div>
              </div>
            </div>
          ) : undefined
        }
        warnings={[
          'O IMC é uma medida de triagem e não substitui avaliação clínica ou nutricional completa.',
          'Não deve ser usado isoladamente para diagnóstico de obesidade ou desnutrição.',
          'Atletas e idosos podem ter interpretações diferentes do IMC.',
        ]}
        info={[
          'Fórmula: IMC = Peso (kg) ÷ Altura² (m)',
          'Classificação baseada nas diretrizes da Organização Mundial da Saúde (OMS).',
        ]}
      >
        {/* Weight Input */}
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="Ex: 70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="0"
            step="0.1"
          />
        </div>

        {/* Height Input */}
        <div className="space-y-2">
          <Label htmlFor="height">Altura (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="Ex: 175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="0"
            step="1"
          />
        </div>
      </CalculatorLayout>
    </MainLayout>
  );
};

export default IMCCalculatorPage;
