import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';
import { calculators } from '@/lib/calculatorTypes';
import { Trash2, Clock, Calculator } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const HistoryPage = () => {
  const { history, removeEntry, clearHistory } = useCalculatorHistory();

  const getCalculatorInfo = (type: string) => {
    return calculators.find(c => c.id === type);
  };

  const formatResult = (result: string | number | Record<string, string | number>) => {
    if (typeof result === 'object') {
      return Object.entries(result)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return String(result);
  };

  return (
    <MainLayout title="Histórico de Cálculos" showBackButton>
      <div className="space-y-6 animate-fade-in">
        {history.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {history.length} {history.length === 1 ? 'cálculo salvo' : 'cálculos salvos'}
              </p>
              <Button variant="outline" size="sm" onClick={clearHistory}>
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Tudo
              </Button>
            </div>

            <div className="space-y-3">
              {history.map((entry) => {
                const calcInfo = getCalculatorInfo(entry.calculatorType);
                const Icon = calcInfo?.icon || Calculator;

                return (
                  <Card key={entry.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn('p-2 rounded-lg', calcInfo?.bgColorClass || 'bg-muted')}>
                            <Icon className={cn('w-4 h-4', calcInfo?.colorClass || 'text-muted-foreground')} />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium">
                              {entry.calculatorName}
                            </CardTitle>
                            <CardDescription className="text-xs flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(entry.timestamp), { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </CardDescription>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => removeEntry(entry.id)}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Resultado:</p>
                        <p className="text-sm font-medium text-foreground">
                          {formatResult(entry.result)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Calculator className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-foreground mb-2">Nenhum cálculo salvo</h3>
              <p className="text-sm text-muted-foreground">
                Os cálculos realizados aparecerão aqui automaticamente
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
