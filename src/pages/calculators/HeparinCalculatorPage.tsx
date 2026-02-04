import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';

interface HeparinProtocol {
  name: string;
  bolusDose: number; // UI/kg
  infusionDose: number; // UI/kg/h
  concentration: number; // UI/mL
}

const protocols: HeparinProtocol[] = [
  { name: 'Protocolo Padrão (TEV)', bolusDose: 80, infusionDose: 18, concentration: 100 },
  { name: 'Protocolo Baixa Intensidade', bolusDose: 60, infusionDose: 12, concentration: 100 },
  { name: 'Protocolo Alta Intensidade (SCA)', bolusDose: 60, infusionDose: 15, concentration: 100 },
];

const HeparinCalculatorPage = () => {
  const [weight, setWeight] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState('');
  const [customConcentration, setCustomConcentration] = useState('');
  const [result, setResult] = useState<{
    bolus: number;
    bolusVolume: number;
    infusionRate: number;
    infusionVolume: number;
  } | null>(null);
  const { addEntry } = useCalculatorHistory();

  const calculate = () => {
    const weightNum = parseFloat(weight);
    const protocol = protocols.find(p => p.name === selectedProtocol);
    const concentration = customConcentration ? parseFloat(customConcentration) : (protocol?.concentration || 100);

    if (!protocol || isNaN(weightNum) || weightNum <= 0 || isNaN(concentration) || concentration <= 0) {
      return;
    }

    // Bolus = peso × dose do protocolo
    const bolus = weightNum * protocol.bolusDose;
    const bolusVolume = bolus / concentration;

    // Infusão = peso × dose de infusão
    const infusionRate = weightNum * protocol.infusionDose;
    const infusionVolume = infusionRate / concentration;

    setResult({
      bolus: Math.round(bolus),
      bolusVolume: Math.round(bolusVolume * 100) / 100,
      infusionRate: Math.round(infusionRate),
      infusionVolume: Math.round(infusionVolume * 100) / 100,
    });

    addEntry(
      'heparin',
      'Calculadora de Heparina',
      { 
        weight: weightNum, 
        protocol: selectedProtocol,
        concentration,
      },
      {
        'Bolus': `${Math.round(bolus)} UI (${Math.round(bolusVolume * 100) / 100} mL)`,
        'Infusão': `${Math.round(infusionRate)} UI/h (${Math.round(infusionVolume * 100) / 100} mL/h)`,
      }
    );
  };

  const clear = () => {
    setWeight('');
    setSelectedProtocol('');
    setCustomConcentration('');
    setResult(null);
  };

  const isValid = weight && selectedProtocol && parseFloat(weight) > 0;

  return (
    <MainLayout title="Heparina" showBackButton>
      <CalculatorLayout
        title="Calculadora de Heparina"
        description="Ajuste de vazão baseado em protocolos de peso"
        icon={Heart}
        colorClass="text-calc-heparin"
        onCalculate={calculate}
        onClear={clear}
        isCalculateDisabled={!isValid}
        result={
          result ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Bolus Inicial</p>
                  <p className="text-2xl font-bold text-primary">{result.bolus} UI</p>
                  <p className="text-sm text-muted-foreground">= {result.bolusVolume} mL</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Infusão Contínua</p>
                  <p className="text-2xl font-bold text-primary">{result.infusionRate} UI/h</p>
                  <p className="text-sm text-muted-foreground">= {result.infusionVolume} mL/h</p>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>Baseado na concentração de {customConcentration || protocols.find(p => p.name === selectedProtocol)?.concentration || 100} UI/mL</p>
              </div>
            </div>
          ) : undefined
        }
        warnings={[
          'Este cálculo é uma REFERÊNCIA baseada em protocolos. O cálculo final deve ser feito pelo médico.',
          'Sempre confirme o protocolo institucional antes de administrar heparina.',
          'Monitorar TTPa conforme protocolo (geralmente 6h após início e ajustes).',
          'Ajustes subsequentes devem ser baseados nos resultados do TTPa.',
        ]}
        info={[
          'A heparina não fracionada (HNF) requer monitoramento laboratorial.',
          'Fórmula Bolus: Peso (kg) × Dose do protocolo (UI/kg)',
          'Fórmula Infusão: Peso (kg) × Taxa de infusão (UI/kg/h)',
        ]}
      >
        {/* Weight Input */}
        <div className="space-y-2">
          <Label htmlFor="weight">Peso do Paciente (kg)</Label>
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

        {/* Protocol Selection */}
        <div className="space-y-2">
          <Label>Protocolo</Label>
          <Select value={selectedProtocol} onValueChange={setSelectedProtocol}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o protocolo" />
            </SelectTrigger>
            <SelectContent>
              {protocols.map((protocol) => (
                <SelectItem key={protocol.name} value={protocol.name}>
                  <div>
                    <p>{protocol.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Bolus: {protocol.bolusDose} UI/kg | Infusão: {protocol.infusionDose} UI/kg/h
                    </p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Concentration */}
        <div className="space-y-2">
          <Label htmlFor="concentration">Concentração da Solução (UI/mL) - Opcional</Label>
          <Input
            id="concentration"
            type="number"
            placeholder="Padrão: 100"
            value={customConcentration}
            onChange={(e) => setCustomConcentration(e.target.value)}
            min="0"
            step="1"
          />
          <p className="text-xs text-muted-foreground">
            Deixe em branco para usar 100 UI/mL (padrão)
          </p>
        </div>
      </CalculatorLayout>
    </MainLayout>
  );
};

export default HeparinCalculatorPage;
