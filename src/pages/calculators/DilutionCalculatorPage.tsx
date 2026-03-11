import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FlaskConical, AlertTriangle, Info, Scale } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Unit options
const UNITS = [
  { value: 'g', label: 'g (Gramas)' },
  { value: 'mg', label: 'mg (Miligramas)' },
  { value: 'mcg', label: 'mcg (Microgramas)' },
  { value: 'UI', label: 'UI (Unidades Internacionais)' },
  { value: 'mEq', label: 'mEq (Miliequivalentes)' },
];

// Unit families
const MASS_UNITS = ['g', 'mg', 'mcg'];

function normalizarParaMg(valor: number, unidade: string): number {
  if (unidade === 'g') return valor * 1000;
  if (unidade === 'mcg') return valor / 1000;
  return valor; // mg, UI, mEq — return as-is
}

function saoUnidadesCompativeis(u1: string, u2: string): boolean {
  const isMass1 = MASS_UNITS.includes(u1);
  const isMass2 = MASS_UNITS.includes(u2);
  if (isMass1 && isMass2) return true;
  if (u1 === u2) return true; // UI/UI or mEq/mEq
  return false;
}

interface CalcResult {
  volumeFinal: number;
  formatted: string;
  alertaRediluicao: boolean;
}

function calcularVolumeExato(
  dosePrescrita: number,
  unidadePrescrita: string,
  concentracaoDisponivel: number,
  unidadeDisponivel: string,
  volumeDisponivel: number,
  pesoPaciente: number | null,
  dosePerKg: boolean
): CalcResult | { error: string } {
  // Incompatibility check
  if (!saoUnidadesCompativeis(unidadePrescrita, unidadeDisponivel)) {
    return { error: 'Unidades incompatíveis. Impossível converter massa para UI ou mEq diretamente.' };
  }

  let doseNorm: number;
  let concNorm: number;

  const isMass = MASS_UNITS.includes(unidadePrescrita);
  if (isMass) {
    doseNorm = normalizarParaMg(dosePrescrita, unidadePrescrita);
    concNorm = normalizarParaMg(concentracaoDisponivel, unidadeDisponivel);
  } else {
    doseNorm = dosePrescrita;
    concNorm = concentracaoDisponivel;
  }

  // Pediatric: multiply dose by weight
  if (pesoPaciente && pesoPaciente > 0 && dosePerKg) {
    doseNorm = doseNorm * pesoPaciente;
  }

  if (concNorm === 0) return { error: 'Concentração disponível não pode ser zero.' };

  const volumeFinal = (doseNorm * volumeDisponivel) / concNorm;

  // Safe rounding
  let rounded: number;
  if (volumeFinal >= 1) {
    rounded = Math.round(volumeFinal * 10) / 10;
  } else {
    rounded = Math.round(volumeFinal * 100) / 100;
  }

  // Format with leading zero
  const formatted = rounded < 1 && rounded > 0
    ? rounded.toFixed(2)
    : rounded >= 1
      ? rounded.toFixed(1)
      : '0';

  return {
    volumeFinal: rounded,
    formatted,
    alertaRediluicao: rounded < 0.1 && rounded > 0,
  };
}

const DilutionCalculatorPage = () => {
  const [dosePrescrita, setDosePrescrita] = useState('');
  const [unidadePrescrita, setUnidadePrescrita] = useState('mg');
  const [concentracaoDisponivel, setConcentracaoDisponivel] = useState('');
  const [unidadeDisponivel, setUnidadeDisponivel] = useState('mg');
  const [volumeDisponivel, setVolumeDisponivel] = useState('');
  const [pesoPaciente, setPesoPaciente] = useState('');
  const [dosePerKg, setDosePerKg] = useState(false);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addEntry } = useCalculatorHistory();

  const handleCalculate = () => {
    setResult(null);
    setError(null);

    const dose = parseFloat(dosePrescrita);
    const conc = parseFloat(concentracaoDisponivel);
    const vol = parseFloat(volumeDisponivel);
    const peso = pesoPaciente ? parseFloat(pesoPaciente) : null;

    if (!dose || dose <= 0 || !conc || conc <= 0 || !vol || vol <= 0) {
      setError('Preencha todos os campos obrigatórios com valores maiores que zero.');
      return;
    }

    if (dosePerKg && (!peso || peso <= 0)) {
      setError('Informe o peso do paciente para cálculo por kg.');
      return;
    }

    const res = calcularVolumeExato(dose, unidadePrescrita, conc, unidadeDisponivel, vol, peso, dosePerKg);

    if ('error' in res) {
      setError(res.error);
      return;
    }

    setResult(res);
    addEntry(
      'medicamentos',
      'Cálculo de Medicamentos',
      {
        dosePrescrita: dose,
        unidadePrescrita,
        concentracaoDisponivel: conc,
        unidadeDisponivel,
        volumeDisponivel: vol,
        ...(peso ? { pesoPaciente: peso } : {}),
      },
      `${res.formatted} mL`
    );
  };

  const handleClear = () => {
    setDosePrescrita('');
    setUnidadePrescrita('mg');
    setConcentracaoDisponivel('');
    setUnidadeDisponivel('mg');
    setVolumeDisponivel('');
    setPesoPaciente('');
    setDosePerKg(false);
    setResult(null);
    setError(null);
  };

  const isValid =
    dosePrescrita && concentracaoDisponivel && volumeDisponivel &&
    parseFloat(dosePrescrita) > 0 && parseFloat(concentracaoDisponivel) > 0 && parseFloat(volumeDisponivel) > 0;

  const inputClass =
    'w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

  const selectClass =
    'w-full h-12 px-3 rounded-lg border border-border bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors';

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
              Dosagem e volume exato para medicamentos injetáveis e orais
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5 space-y-5">
          {/* Dose Prescrita */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Dose Prescrita</label>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                className={inputClass + ' flex-1'}
                placeholder="Ex: 500"
                value={dosePrescrita}
                onChange={(e) => setDosePrescrita(e.target.value)}
              />
              <select
                className={selectClass + ' w-32 flex-shrink-0'}
                value={unidadePrescrita}
                onChange={(e) => setUnidadePrescrita(e.target.value)}
              >
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.value}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">Dose solicitada na prescrição médica (ex: Dipirona 1g → digite 1 e selecione "g")</p>
          </div>

          {/* Concentração Disponível */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Concentração Disponível</label>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                className={inputClass + ' flex-1'}
                placeholder="Ex: 250"
                value={concentracaoDisponivel}
                onChange={(e) => setConcentracaoDisponivel(e.target.value)}
              />
              <select
                className={selectClass + ' w-32 flex-shrink-0'}
                value={unidadeDisponivel}
                onChange={(e) => setUnidadeDisponivel(e.target.value)}
              >
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.value}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">Quantidade de princípio ativo no frasco/ampola conforme rótulo (ex: Dipirona 500mg/mL → digite 500)</p>
          </div>

          {/* Volume Disponível */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Volume Disponível (mL)</label>
            <input
              type="number"
              inputMode="decimal"
              className={inputClass}
              placeholder="Ex: 10"
              value={volumeDisponivel}
              onChange={(e) => setVolumeDisponivel(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Volume em mL que contém a concentração acima (ex: Dipirona 500mg/mL → digite 1)</p>
          </div>

          {/* Pediatric toggle */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="dose-kg" className="text-sm font-medium text-foreground cursor-pointer">
                  Dose por Kg (Pediátrico)
                </Label>
              </div>
              <Switch
                id="dose-kg"
                checked={dosePerKg}
                onCheckedChange={setDosePerKg}
              />
            </div>
            {dosePerKg && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Peso do Paciente (kg)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  className={inputClass}
                  placeholder="Ex: 12.5"
                  value={pesoPaciente}
                  onChange={(e) => setPesoPaciente(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCalculate}
              disabled={!isValid}
              className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground font-bold text-base transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calcular
            </button>
            <button
              onClick={handleClear}
              className="h-12 px-6 rounded-lg border border-border bg-card text-foreground font-medium text-base transition-colors hover:bg-muted"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex gap-3 items-start animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-6 text-center space-y-2 animate-fade-in">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Resultado</p>
            <p className="text-5xl font-bold text-primary">{result.formatted} mL</p>
            <p className="text-base font-semibold text-foreground mt-3">
              Aspire exatamente <span className="text-primary font-bold">{result.formatted} mL</span> da medicação.
            </p>
          </div>
        )}

        {/* Redilution alert */}
        {result?.alertaRediluicao && (
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex gap-3 items-start animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-warning">
              Volume muito pequeno para aspiração segura ({'<'} 0.1 mL). Recomenda-se protocolo de rediluição pediátrica.
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-info/5 border border-info/20 rounded-xl p-4">
          <div className="flex gap-2 items-start">
            <Info className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Fórmula: Volume = (Dose Prescrita × Volume Disponível) ÷ Concentração Disponível</p>
              <p>Unidades de massa (g, mg, mcg) são convertidas automaticamente para mg antes do cálculo.</p>
            </div>
          </div>
        </div>

        {/* Safety warning */}
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
          <div className="flex gap-2 items-start">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
            <div className="space-y-1 text-sm text-foreground">
              <p>Sempre confirme o cálculo antes da administração.</p>
              <p>Verifique compatibilidade, via de administração e velocidade de infusão.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DilutionCalculatorPage;
