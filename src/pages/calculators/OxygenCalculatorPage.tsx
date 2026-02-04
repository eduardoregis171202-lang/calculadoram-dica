import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wind } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';

interface CylinderType {
  name: string;
  capacity: number; // Litros de O2
  factor: number; // Fator para cálculo
}

const cylinderTypes: CylinderType[] = [
  { name: 'Portátil pequeno (E)', capacity: 660, factor: 0.28 },
  { name: 'Portátil médio (D)', capacity: 350, factor: 0.16 },
  { name: 'Grande (H/K)', capacity: 6900, factor: 3.14 },
  { name: 'Jumbo (M)', capacity: 3450, factor: 1.56 },
];

const OxygenCalculatorPage = () => {
  const [cylinderType, setCylinderType] = useState('');
  const [currentPressure, setCurrentPressure] = useState('');
  const [flowRate, setFlowRate] = useState('');
  const [result, setResult] = useState<{ duration: number; hours: number; minutes: number } | null>(null);
  const { addEntry } = useCalculatorHistory();

  const calculate = () => {
    const pressure = parseFloat(currentPressure);
    const flow = parseFloat(flowRate);
    const cylinder = cylinderTypes.find(c => c.name === cylinderType);

    if (!cylinder || isNaN(pressure) || isNaN(flow) || pressure <= 0 || flow <= 0) {
      return;
    }

    // Fórmula: Tempo (min) = (Pressão × Fator do cilindro) ÷ Fluxo
    const durationMinutes = (pressure * cylinder.factor) / flow;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = Math.round(durationMinutes % 60);

    setResult({
      duration: Math.round(durationMinutes),
      hours,
      minutes,
    });

    addEntry(
      'oxygen',
      'Estimativa de Tanque de O₂',
      { 
        cylinderType, 
        currentPressure: pressure, 
        flowRate: flow 
      },
      `${hours}h ${minutes}min (${Math.round(durationMinutes)} minutos)`
    );
  };

  const clear = () => {
    setCylinderType('');
    setCurrentPressure('');
    setFlowRate('');
    setResult(null);
  };

  const isValid = cylinderType && currentPressure && flowRate && 
    parseFloat(currentPressure) > 0 && parseFloat(flowRate) > 0;

  return (
    <MainLayout title="Tanque O₂" showBackButton>
      <CalculatorLayout
        title="Estimativa de Tanque de O₂"
        description="Cálculo de autonomia de cilindros de oxigênio"
        icon={Wind}
        colorClass="text-calc-oxygen"
        onCalculate={calculate}
        onClear={clear}
        isCalculateDisabled={!isValid}
        result={
          result ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Tempo Estimado de Duração</p>
              <div className="flex items-center justify-center gap-3">
                <div>
                  <p className="text-4xl font-bold text-primary">{result.hours}</p>
                  <p className="text-sm text-muted-foreground">horas</p>
                </div>
                <span className="text-2xl text-muted-foreground">:</span>
                <div>
                  <p className="text-4xl font-bold text-primary">{result.minutes}</p>
                  <p className="text-sm text-muted-foreground">minutos</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Total: {result.duration} minutos
              </p>
            </div>
          ) : undefined
        }
        warnings={[
          'Este cálculo é uma estimativa. A duração real pode variar conforme condições do equipamento.',
          'Sempre tenha cilindros reserva disponíveis para situações de emergência.',
          'Verifique periodicamente a pressão durante o uso.',
        ]}
        info={[
          'Fórmula: Tempo (min) = (Pressão × Fator do cilindro) ÷ Fluxo',
          'A pressão máxima de um cilindro cheio é geralmente 2000-2200 PSI.',
          'Hospitais maiores usam sistema central de O₂, esta calculadora é para cilindros portáteis.',
        ]}
      >
        {/* Cylinder Type Selection */}
        <div className="space-y-2">
          <Label>Tipo de Cilindro</Label>
          <Select value={cylinderType} onValueChange={setCylinderType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de cilindro" />
            </SelectTrigger>
            <SelectContent>
              {cylinderTypes.map((cylinder) => (
                <SelectItem key={cylinder.name} value={cylinder.name}>
                  {cylinder.name} - {cylinder.capacity}L
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Selecione o tipo de cilindro de oxigênio
          </p>
        </div>

        {/* Current Pressure Input */}
        <div className="space-y-2">
          <Label htmlFor="pressure">Pressão Atual (PSI)</Label>
          <Input
            id="pressure"
            type="number"
            placeholder="Ex: 1500"
            value={currentPressure}
            onChange={(e) => setCurrentPressure(e.target.value)}
            min="0"
            step="50"
          />
          <p className="text-xs text-muted-foreground">
            Leitura atual do manômetro do cilindro
          </p>
        </div>

        {/* Flow Rate Input */}
        <div className="space-y-2">
          <Label htmlFor="flow">Fluxo de O₂ (L/min)</Label>
          <Input
            id="flow"
            type="number"
            placeholder="Ex: 2"
            value={flowRate}
            onChange={(e) => setFlowRate(e.target.value)}
            min="0"
            step="0.5"
          />
          <p className="text-xs text-muted-foreground">
            Fluxo prescrito pelo médico
          </p>
        </div>
      </CalculatorLayout>
    </MainLayout>
  );
};

export default OxygenCalculatorPage;
