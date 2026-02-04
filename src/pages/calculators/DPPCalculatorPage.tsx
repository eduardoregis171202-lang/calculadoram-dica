import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Baby, Calendar } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';
import { format, addDays, differenceInDays, differenceInWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DPPCalculatorPage = () => {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [result, setResult] = useState<{
    dpp: Date;
    gestationalAge: { weeks: number; days: number };
    trimester: number;
    daysRemaining: number;
  } | null>(null);
  const { addEntry } = useCalculatorHistory();

  const calculate = () => {
    if (!lastPeriodDate) return;

    const dum = new Date(lastPeriodDate);
    const today = new Date();
    
    // Regra de Naegele: DPP = DUM + 280 dias (40 semanas)
    const dpp = addDays(dum, 280);
    
    // Idade gestacional
    const totalDays = differenceInDays(today, dum);
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;
    
    // Trimestre
    let trimester = 1;
    if (weeks >= 14 && weeks < 28) trimester = 2;
    else if (weeks >= 28) trimester = 3;
    
    // Dias restantes
    const daysRemaining = differenceInDays(dpp, today);

    setResult({
      dpp,
      gestationalAge: { weeks, days },
      trimester,
      daysRemaining,
    });

    addEntry(
      'dpp',
      'Data Provável de Parto',
      { lastPeriodDate },
      {
        'DPP': format(dpp, 'dd/MM/yyyy'),
        'Idade Gestacional': `${weeks} semanas e ${days} dias`,
        'Trimestre': `${trimester}º`,
      }
    );
  };

  const clear = () => {
    setLastPeriodDate('');
    setResult(null);
  };

  const getTrimesterColor = (trimester: number) => {
    switch (trimester) {
      case 1: return 'text-info';
      case 2: return 'text-success';
      case 3: return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const progressPercentage = result 
    ? Math.min(((result.gestationalAge.weeks * 7 + result.gestationalAge.days) / 280) * 100, 100)
    : 0;

  return (
    <MainLayout title="DPP" showBackButton>
      <CalculatorLayout
        title="Data Provável de Parto"
        description="Cálculo da DPP e idade gestacional baseado na DUM"
        icon={Baby}
        colorClass="text-calc-dpp"
        onCalculate={calculate}
        onClear={clear}
        isCalculateDisabled={!lastPeriodDate}
        result={
          result ? (
            <div className="space-y-6">
              {/* DPP */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Data Provável do Parto</p>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  <p className="text-3xl font-bold text-primary">
                    {format(result.dpp, 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(result.dpp, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>

              {/* Gestational Age */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Idade Gestacional</p>
                  <p className="text-2xl font-bold text-foreground">
                    {result.gestationalAge.weeks}s {result.gestationalAge.days}d
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {result.gestationalAge.weeks} semanas e {result.gestationalAge.days} dias
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Trimestre</p>
                  <p className={`text-2xl font-bold ${getTrimesterColor(result.trimester)}`}>
                    {result.trimester}º Trimestre
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {result.daysRemaining > 0 
                      ? `Faltam ${result.daysRemaining} dias`
                      : 'Período previsto atingido'
                    }
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Progresso da Gestação</p>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-info via-success to-warning transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>14 sem</span>
                  <span>28 sem</span>
                  <span>40 sem</span>
                </div>
              </div>

              {/* Trimester Info */}
              <div className="text-sm text-muted-foreground">
                <p><strong>1º Trimestre:</strong> Semanas 1-13 (formação dos órgãos)</p>
                <p><strong>2º Trimestre:</strong> Semanas 14-27 (desenvolvimento e crescimento)</p>
                <p><strong>3º Trimestre:</strong> Semanas 28-40 (maturação final)</p>
              </div>
            </div>
          ) : undefined
        }
        warnings={[
          'A DPP é uma ESTIMATIVA. Apenas 5% dos partos ocorrem na data prevista.',
          'O parto a termo pode ocorrer entre 37 e 42 semanas.',
          'Este cálculo não substitui o acompanhamento pré-natal.',
        ]}
        info={[
          'Regra de Naegele: DPP = DUM + 280 dias (40 semanas)',
          'A DUM é a Data da Última Menstruação',
          'A idade gestacional é calculada a partir do primeiro dia da última menstruação.',
        ]}
      >
        {/* Last Period Date Input */}
        <div className="space-y-2">
          <Label htmlFor="lastPeriod">Data da Última Menstruação (DUM)</Label>
          <Input
            id="lastPeriod"
            type="date"
            value={lastPeriodDate}
            onChange={(e) => setLastPeriodDate(e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
          />
          <p className="text-xs text-muted-foreground">
            Primeiro dia da última menstruação da paciente
          </p>
        </div>
      </CalculatorLayout>
    </MainLayout>
  );
};

export default DPPCalculatorPage;
