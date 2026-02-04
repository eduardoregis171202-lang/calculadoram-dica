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
  bodySurface: number;
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
    
    // Superfície Corporal - Fórmula de Mosteller
    // SC = √((peso × altura) / 3600)
    const bodySurface = Math.sqrt((weightNum * heightCm) / 3600);

    const { classification, colorClass } = getIMCClassification(imc);

    setResult({
      imc: Math.round(imc * 100) / 100,
      classification,
      colorClass,
      bodySurface: Math.round(bodySurface * 100) / 100,
    });

    addEntry(
      'imc',
      'IMC e Superfície Corporal',
      { weight: weightNum, height: heightCm },
      {
        'IMC': `${Math.round(imc * 100) / 100} kg/m² (${classification})`,
        'Superfície Corporal': `${Math.round(bodySurface * 100) / 100} m²`,
      }
    );
  };

  const clear = () => {
    setWeight('');
    setHeight('');
    setResult(null);
  };

  const isValid = weight && height && parseFloat(weight) > 0 && parseFloat(height) > 0;

  return (
    <MainLayout title="IMC/SC" showBackButton>
      <CalculatorLayout
        title="IMC e Superfície Corporal"
        description="Índice de Massa Corporal e Superfície Corporal para avaliação e ajustes de doses"
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
                <p className="text-3xl font-bold text-primary">{result.imc} <span className="text-lg">kg/m²</span></p>
                <p className={cn('text-lg font-medium mt-2', result.colorClass)}>
                  {result.classification}
                </p>
              </div>
              
              <div className="border-t pt-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Superfície Corporal (Mosteller)</p>
                <p className="text-3xl font-bold text-accent">{result.bodySurface} <span className="text-lg">m²</span></p>
              </div>

              {/* IMC Scale Visual */}
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2 text-center">Escala de IMC</p>
                <div className="h-3 rounded-full overflow-hidden flex">
                  <div className="flex-1 bg-info" title="Baixo peso (<18.5)" />
                  <div className="flex-1 bg-success" title="Normal (18.5-24.9)" />
                  <div className="flex-1 bg-warning" title="Sobrepeso (25-29.9)" />
                  <div className="flex-1 bg-destructive/70" title="Obesidade I (30-34.9)" />
                  <div className="flex-1 bg-destructive" title="Obesidade II-III (≥35)" />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>35</span>
                  <span>40+</span>
                </div>
              </div>
            </div>
          ) : undefined
        }
        warnings={[
          'O IMC é uma medida de triagem e não substitui avaliação clínica ou nutricional completa.',
          'Não deve ser usado isoladamente para diagnóstico de obesidade ou desnutrição.',
          'Para ajuste de doses de medicamentos, consulte sempre o protocolo específico.',
        ]}
        info={[
          'Fórmula IMC: Peso (kg) ÷ Altura² (m)',
          'Fórmula SC (Mosteller): √((Peso × Altura) ÷ 3600)',
          'A superfície corporal é usada para ajuste de doses de quimioterápicos e outros medicamentos.',
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
