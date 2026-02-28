import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Droplets } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';

type EquipmentType = 'macro' | 'micro';
type TimeUnit = 'hours' | 'minutes';

const DripCalculatorPage = () => {
  const [volume, setVolume] = useState('');
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('hours');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('macro');
  const [result, setResult] = useState<number | null>(null);
  const { addEntry } = useCalculatorHistory();

  const calculate = () => {
    const volumeNum = parseFloat(volume);
    const timeNum = parseFloat(time);

    if (isNaN(volumeNum) || isNaN(timeNum) || volumeNum <= 0 || timeNum <= 0) {
      return;
    }

    // Converter para horas se estiver em minutos
    const timeInHours = timeUnit === 'minutes' ? timeNum / 60 : timeNum;

    let drops: number;
    if (equipmentType === 'macro') {
      drops = volumeNum / (3 * timeInHours);
    } else {
      drops = volumeNum / timeInHours;
    }
    const roundedDrops = Math.round(drops * 10) / 10;
    setResult(roundedDrops);

    addEntry(
      'drip',
      'Calculadora de Gotejamento',
      { volume: volumeNum, time: timeNum, timeUnit, equipmentType },
      `${roundedDrops} ${equipmentType === 'macro' ? 'gts/min' : 'mcgts/min'}`
    );
  };

  const clear = () => {
    setVolume('');
    setTime('');
    setResult(null);
  };

  const isValid = volume && time && parseFloat(volume) > 0 && parseFloat(time) > 0;

  return (
    <MainLayout title="Gotejamento" showBackButton>
      <CalculatorLayout
        title="Calculadora de Gotejamento"
        description="Calcule gotas ou microgotas por minuto para infusões intravenosas"
        icon={Droplets}
        colorClass="text-calc-drip"
        onCalculate={calculate}
        onClear={clear}
        isCalculateDisabled={!isValid}
        result={
          result !== null ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{result}</p>
              <p className="text-lg text-muted-foreground">
                {equipmentType === 'macro' ? 'gotas/minuto' : 'microgotas/minuto'}
              </p>
            </div>
          ) : undefined
        }
        warnings={[
          'Este cálculo é uma ferramenta auxiliar. Sempre verifique a prescrição médica.',
          'A velocidade de infusão pode variar conforme condições clínicas do paciente.',
        ]}
        info={[
          'Equipo Macrogotas: 1 mL = 20 gotas',
          'Equipo Microgotas: 1 mL = 60 microgotas',
          'Fórmula Macro: gts/min = Volume ÷ (3 × Tempo em horas)',
          'Fórmula Micro: mcgts/min = Volume ÷ Tempo em horas',
        ]}
      >
        {/* Equipment Type Selection */}
        <div className="space-y-3">
          <Label>Tipo de Equipo</Label>
          <RadioGroup
            value={equipmentType}
            onValueChange={(value) => setEquipmentType(value as EquipmentType)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="macro" id="macro" />
              <Label htmlFor="macro" className="font-normal cursor-pointer">
                Macrogotas (20 gts/mL)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="micro" id="micro" />
              <Label htmlFor="micro" className="font-normal cursor-pointer">
                Microgotas (60 mcgts/mL)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Volume Input */}
        <div className="space-y-2">
          <Label htmlFor="volume">Volume Total (mL)</Label>
          <Input
            id="volume"
            type="number"
            placeholder="Ex: 500"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            min="0"
            step="0.1"
          />
          <p className="text-xs text-muted-foreground">
            Volume total da solução a ser infundida (medicamento + diluente)
          </p>
        </div>

        {/* Time Input */}
        <div className="space-y-2">
          <Label htmlFor="time">Tempo de Infusão</Label>
          <div className="flex gap-2">
            <Input
              id="time"
              type="number"
              placeholder={timeUnit === 'hours' ? 'Ex: 8' : 'Ex: 120'}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              min="0"
              step={timeUnit === 'hours' ? '0.5' : '1'}
              className="flex-1"
            />
            <RadioGroup
              value={timeUnit}
              onValueChange={(value) => setTimeUnit(value as TimeUnit)}
              className="flex gap-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="hours" id="hours" />
                <Label htmlFor="hours" className="font-normal cursor-pointer text-sm">
                  Horas
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="minutes" id="minutes" />
                <Label htmlFor="minutes" className="font-normal cursor-pointer text-sm">
                  Minutos
                </Label>
              </div>
            </RadioGroup>
          </div>
          <p className="text-xs text-muted-foreground">
            Tempo prescrito pelo médico para a infusão completa
          </p>
        </div>
      </CalculatorLayout>
    </MainLayout>
  );
};

export default DripCalculatorPage;
