import { useState, useRef, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FlaskConical, ArrowLeft } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';

interface MedicationPreset {
  name: string;
  totalContent: number;
  dilutionVolume: number;
}

const medicationPresets: MedicationPreset[] = [
  { name: 'Ampicilina 500mg', totalContent: 500, dilutionVolume: 5 },
  { name: 'Ampicilina 1g', totalContent: 1000, dilutionVolume: 10 },
  { name: 'Ceftriaxona 1g', totalContent: 1000, dilutionVolume: 10 },
  { name: 'Vancomicina 500mg', totalContent: 500, dilutionVolume: 10 },
  { name: 'Oxacilina 500mg', totalContent: 500, dilutionVolume: 5 },
  { name: 'Penicilina Cristalina 5MUI', totalContent: 5000000, dilutionVolume: 10 },
];

const DilutionCalculatorPage = () => {
  const [medSearch, setMedSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [totalContent, setTotalContent] = useState('');
  const [dilutionVolume, setDilutionVolume] = useState('');
  const [prescribedDose, setPrescribedDose] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const { addEntry } = useCalculatorHistory();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const filteredMeds = medicationPresets.filter(m =>
    m.name.toLowerCase().includes(medSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectMed = (med: MedicationPreset) => {
    setMedSearch(med.name);
    setTotalContent(med.totalContent.toString());
    setDilutionVolume(med.dilutionVolume.toString());
    setShowSuggestions(false);
    setResult(null);
  };

  const calculate = () => {
    const total = parseFloat(totalContent);
    const volume = parseFloat(dilutionVolume);
    const dose = parseFloat(prescribedDose);

    if (!total || !volume || !dose || total <= 0 || volume <= 0 || dose <= 0) return;

    // Regra de três: resultado = (dose × volume) / conteúdo total
    const res = (dose * volume) / total;
    const rounded = Math.round(res * 100) / 100;
    setResult(rounded);

    addEntry(
      'dilution',
      'Cálculo de Medicamentos',
      { totalContent: total, dilutionVolume: volume, prescribedDose: dose },
      `${rounded} mL`
    );
  };

  const clear = () => {
    setMedSearch('');
    setTotalContent('');
    setDilutionVolume('');
    setPrescribedDose('');
    setResult(null);
  };

  const isValid =
    totalContent && dilutionVolume && prescribedDose &&
    parseFloat(totalContent) > 0 && parseFloat(dilutionVolume) > 0 && parseFloat(prescribedDose) > 0;

  return (
    <MainLayout title="Medicamentos" showBackButton>
      <div className="max-w-lg mx-auto space-y-5 animate-fade-in pb-8">
        {/* Header */}
        <div className="flex items-start gap-4 pt-2">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <FlaskConical className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Cálculo de Medicamentos</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Assistente para cálculo de medicamentos
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5 space-y-5">
          {/* Medicamento - Autocomplete text input */}
          <div className="space-y-1.5 relative" ref={suggestionsRef}>
            <label className="text-sm font-medium text-foreground">Medicamento (opcional)</label>
            <input
              type="text"
              className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Selecione ou insira manualmente"
              value={medSearch}
              onChange={(e) => {
                setMedSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && medSearch.length > 0 && filteredMeds.length > 0 && (
              <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-md max-h-48 overflow-y-auto">
                {filteredMeds.map((med) => (
                  <button
                    key={med.name}
                    type="button"
                    className="w-full text-left px-4 py-3 text-sm hover:bg-accent/10 transition-colors text-foreground"
                    onClick={() => selectMed(med)}
                  >
                    {med.name}
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Digite o nome do medicamento para buscar
            </p>
          </div>

          {/* Conteúdo Total */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Conteúdo Total do Frasco (mg)</label>
            <input
              type="number"
              inputMode="decimal"
              className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Ex: 500"
              value={totalContent}
              onChange={(e) => setTotalContent(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Quantidade total do medicamento no frasco conforme bula
            </p>
          </div>

          {/* Volume de Diluição */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Volume de Diluição (mL)</label>
            <input
              type="number"
              inputMode="decimal"
              className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Ex: 5"
              value={dilutionVolume}
              onChange={(e) => setDilutionVolume(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Volume de diluente a ser adicionado
            </p>
          </div>

          {/* Dose Prescrita */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Dose Prescrita (mg)</label>
            <input
              type="number"
              inputMode="decimal"
              className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Ex: 250"
              value={prescribedDose}
              onChange={(e) => setPrescribedDose(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Dose que o médico prescreveu para o paciente
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={calculate}
              disabled={!isValid}
              className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground font-bold text-base transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calcular
            </button>
            <button
              onClick={clear}
              className="h-12 px-6 rounded-lg border border-border bg-card text-foreground font-medium text-base transition-colors hover:bg-muted"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Result Card */}
        {result !== null && (
          <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 text-center space-y-2 animate-fade-in">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Resultado</p>
            <p className="text-5xl font-bold text-primary">{result} mL</p>
            <p className="text-base font-semibold text-foreground mt-3">
              ASPIRE EXATAMENTE <span className="text-primary font-bold">{result} mL</span> DA SOLUÇÃO
            </p>
          </div>
        )}

        {/* Warnings */}
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 space-y-2">
          <div className="flex gap-2 items-start">
            <span className="text-warning mt-0.5">⚠</span>
            <div className="space-y-1 text-sm text-foreground">
              <p>Sempre verifique a bula do medicamento para orientações específicas de diluição.</p>
              <p>As diluições variam conforme protocolo institucional e via de administração.</p>
              <p>Confirme a compatibilidade do diluente com o medicamento.</p>
            </div>
          </div>
        </div>

        {/* Formula info */}
        <div className="bg-info/5 border border-info/20 rounded-xl p-4">
          <div className="flex gap-2 items-start">
            <span className="text-info mt-0.5">ℹ</span>
            <p className="text-sm text-muted-foreground">
              Fórmula: Resultado = (Dose Prescrita × Volume de Diluição) ÷ Conteúdo Total do Frasco
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DilutionCalculatorPage;
