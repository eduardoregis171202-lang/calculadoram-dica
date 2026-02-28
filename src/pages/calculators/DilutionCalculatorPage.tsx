import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlaskConical } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';

interface MedicationPreset {
  name: string;
  presentation: string;
  standardDilution: number; // mL para diluir
  finalConcentration: string;
}

const medicationPresets: MedicationPreset[] = [
  { name: 'Ampicilina 500mg', presentation: '500mg/frasco', standardDilution: 5, finalConcentration: '100mg/mL' },
  { name: 'Ampicilina 1g', presentation: '1g/frasco', standardDilution: 10, finalConcentration: '100mg/mL' },
  { name: 'Ceftriaxona 1g', presentation: '1g/frasco', standardDilution: 10, finalConcentration: '100mg/mL' },
  { name: 'Vancomicina 500mg', presentation: '500mg/frasco', standardDilution: 10, finalConcentration: '50mg/mL' },
  { name: 'Oxacilina 500mg', presentation: '500mg/frasco', standardDilution: 5, finalConcentration: '100mg/mL' },
  { name: 'Penicilina Cristalina 5.000.000UI', presentation: '5.000.000UI/frasco', standardDilution: 10, finalConcentration: '500.000UI/mL' },
  { name: 'Outro (manual)', presentation: '', standardDilution: 0, finalConcentration: '' },
];

const DilutionCalculatorPage = () => {
  const [selectedMed, setSelectedMed] = useState<string>('');
  const [totalContent, setTotalContent] = useState('');
  const [dilutionVolume, setDilutionVolume] = useState('');
  const [prescribedDose, setPrescribedDose] = useState('');
  const [result, setResult] = useState<{ concentration: number; volumeToAdminister: number } | null>(null);
  const { addEntry } = useCalculatorHistory();

  const handleMedSelect = (medName: string) => {
    setSelectedMed(medName);
    const med = medicationPresets.find(m => m.name === medName);
    if (med && med.standardDilution > 0) {
      setDilutionVolume(med.standardDilution.toString());
      // Extract numeric value from presentation
      const match = med.presentation.match(/(\d+)/);
      if (match) {
        setTotalContent(match[1]);
      }
    }
    setResult(null);
  };

  const calculate = () => {
    const totalNum = parseFloat(totalContent);
    const dilutionNum = parseFloat(dilutionVolume);
    const doseNum = parseFloat(prescribedDose);

    if (isNaN(totalNum) || isNaN(dilutionNum) || isNaN(doseNum) || 
        totalNum <= 0 || dilutionNum <= 0 || doseNum <= 0) {
      return;
    }

    // Concentração = conteúdo total / volume de diluição
    const concentration = totalNum / dilutionNum;
    
    // Volume a administrar = dose prescrita / concentração
    const volumeToAdminister = doseNum / concentration;

    setResult({
      concentration: Math.round(concentration * 100) / 100,
      volumeToAdminister: Math.round(volumeToAdminister * 100) / 100,
    });

    addEntry(
      'dilution',
      'Conversor de Diluição',
      { 
        medication: selectedMed || 'Manual', 
        totalContent: totalNum, 
        dilutionVolume: dilutionNum, 
        prescribedDose: doseNum 
      },
      `${Math.round(volumeToAdminister * 100) / 100} mL (${Math.round(concentration * 100) / 100} mg/mL)`
    );
  };

  const clear = () => {
    setSelectedMed('');
    setTotalContent('');
    setDilutionVolume('');
    setPrescribedDose('');
    setResult(null);
  };

  const isValid = totalContent && dilutionVolume && prescribedDose && 
    parseFloat(totalContent) > 0 && parseFloat(dilutionVolume) > 0 && parseFloat(prescribedDose) > 0;

  return (
    <MainLayout title="Diluição" showBackButton>
      <CalculatorLayout
        title="Conversor de Diluição"
        description="Assistente para a diluição de medicamentos"
        icon={FlaskConical}
        colorClass="text-calc-dilution"
        onCalculate={calculate}
        onClear={clear}
        isCalculateDisabled={!isValid}
        result={
          result ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Concentração Final</p>
                <p className="text-2xl font-bold text-primary">{result.concentration} mg/mL</p>
              </div>
              <div className="border-t pt-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Volume a Administrar</p>
                <p className="text-3xl font-bold text-success">{result.volumeToAdminister} mL</p>
              </div>
            </div>
          ) : undefined
        }
        warnings={[
          'Sempre verifique a bula do medicamento para orientações específicas de diluição.',
          'As diluições variam conforme protocolo institucional e via de administração.',
          'Confirme a compatibilidade do diluente com o medicamento.',
        ]}
        info={[
          'Fórmula: Concentração = Conteúdo Total ÷ Volume de Diluição',
          'Volume a administrar = Dose Prescrita ÷ Concentração',
        ]}
      >
        {/* Medication Preset Selection */}
        <div className="space-y-2">
          <Label>Medicamento (opcional)</Label>
          <Select value={selectedMed} onValueChange={handleMedSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione ou insira manualmente" />
            </SelectTrigger>
            <SelectContent>
              {medicationPresets.map((med) => (
                <SelectItem key={med.name} value={med.name}>
                  {med.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Selecione um medicamento comum ou preencha manualmente
          </p>
        </div>

        {/* Total Content Input */}
        <div className="space-y-2">
          <Label htmlFor="totalContent">Conteúdo Total do Frasco (mg)</Label>
          <Input
            id="totalContent"
            type="number"
            placeholder="Ex: 500"
            value={totalContent}
            onChange={(e) => setTotalContent(e.target.value)}
            min="0"
            step="0.1"
          />
          <p className="text-xs text-muted-foreground">
            Quantidade total do medicamento no frasco conforme bula
          </p>
        </div>

        {/* Dilution Volume Input */}
        <div className="space-y-2">
          <Label htmlFor="dilutionVolume">Volume de Diluição (mL)</Label>
          <Input
            id="dilutionVolume"
            type="number"
            placeholder="Ex: 5"
            value={dilutionVolume}
            onChange={(e) => setDilutionVolume(e.target.value)}
            min="0"
            step="0.1"
          />
          <p className="text-xs text-muted-foreground">
            Volume de diluente a ser adicionado (água destilada, SF, etc.)
          </p>
        </div>

        {/* Prescribed Dose Input */}
        <div className="space-y-2">
          <Label htmlFor="prescribedDose">Dose Prescrita (mg)</Label>
          <Input
            id="prescribedDose"
            type="number"
            placeholder="Ex: 250"
            value={prescribedDose}
            onChange={(e) => setPrescribedDose(e.target.value)}
            min="0"
            step="0.1"
          />
          <p className="text-xs text-muted-foreground">
            Dose que o médico prescreveu para o paciente
          </p>
        </div>
      </CalculatorLayout>
    </MainLayout>
  );
};

export default DilutionCalculatorPage;
