import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Syringe, AlertTriangle, Info } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';
import { cn } from '@/lib/utils';

interface SyringeType {
  name: string;
  totalVolume: number; // mL
  unitsPerMl: number;
  description: string;
}

const syringeTypes: SyringeType[] = [
  { name: 'Seringa de Insulina 100U (1mL)', totalVolume: 1, unitsPerMl: 100, description: 'Padrão para insulina U-100' },
  { name: 'Seringa de Insulina 50U (0.5mL)', totalVolume: 0.5, unitsPerMl: 100, description: 'Meia dose, mais precisa' },
  { name: 'Seringa de Insulina 30U (0.3mL)', totalVolume: 0.3, unitsPerMl: 100, description: 'Baixas doses, maior precisão' },
];

const InsulinCalculatorPage = () => {
  const [prescribedUnits, setPrescribedUnits] = useState('');
  const [selectedSyringe, setSelectedSyringe] = useState('');
  const { addEntry } = useCalculatorHistory();

  const calculateVolume = (units: number): number => {
    // U-100: 100 unidades por mL
    return units / 100;
  };

  const prescribedNum = parseFloat(prescribedUnits) || 0;
  const volume = calculateVolume(prescribedNum);
  const syringe = syringeTypes.find(s => s.name === selectedSyringe);

  const canUseSelectedSyringe = syringe ? prescribedNum <= (syringe.totalVolume * syringe.unitsPerMl) : false;

  const saveToHistory = () => {
    if (prescribedNum > 0 && selectedSyringe) {
      addEntry(
        'insulin',
        'Conversor de Insulina',
        { prescribedUnits: prescribedNum, syringeType: selectedSyringe },
        `${prescribedNum} UI = ${volume.toFixed(2)} mL`
      );
    }
  };

  // Visual representation marks for syringe
  const getSyringeMarks = () => {
    if (!syringe) return [];
    const marks: number[] = [];
    const step = syringe.totalVolume * syringe.unitsPerMl <= 30 ? 5 : 10;
    for (let i = 0; i <= syringe.totalVolume * syringe.unitsPerMl; i += step) {
      marks.push(i);
    }
    return marks;
  };

  const fillPercentage = syringe 
    ? Math.min((prescribedNum / (syringe.totalVolume * syringe.unitsPerMl)) * 100, 100)
    : 0;

  return (
    <MainLayout title="Insulina" showBackButton>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-calc-insulin/10">
                <Syringe className="w-8 h-8 text-calc-insulin" />
              </div>
              <div>
                <CardTitle className="text-xl">Conversor de Insulina</CardTitle>
                <CardDescription>Guia visual para diferentes graduações de seringas</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Input Card */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="units">Dose Prescrita (Unidades)</Label>
              <Input
                id="units"
                type="number"
                placeholder="Ex: 10"
                value={prescribedUnits}
                onChange={(e) => setPrescribedUnits(e.target.value)}
                min="0"
                step="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Seringa</Label>
              <Select value={selectedSyringe} onValueChange={setSelectedSyringe}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a seringa disponível" />
                </SelectTrigger>
                <SelectContent>
                  {syringeTypes.map((syringe) => (
                    <SelectItem key={syringe.name} value={syringe.name}>
                      {syringe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Visual Syringe Representation */}
        {selectedSyringe && prescribedNum > 0 && (
          <Card className={cn(
            'border-2',
            canUseSelectedSyringe ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Visualização da Dose</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Syringe Visual */}
              <div className="relative bg-muted rounded-lg p-4">
                <div className="flex items-center gap-4">
                  {/* Syringe body */}
                  <div className="flex-1">
                    <div className="relative h-12 bg-background border-2 border-border rounded-r-full overflow-hidden">
                      {/* Fill level */}
                      <div 
                        className={cn(
                          "absolute left-0 top-0 bottom-0 transition-all duration-300",
                          canUseSelectedSyringe ? "bg-success/30" : "bg-destructive/30"
                        )}
                        style={{ width: `${fillPercentage}%` }}
                      />
                      {/* Graduation marks */}
                      <div className="absolute inset-0 flex justify-between px-2 items-end pb-1">
                        {getSyringeMarks().map((mark) => (
                          <div key={mark} className="flex flex-col items-center">
                            <div className="w-px h-3 bg-border" />
                            <span className="text-[10px] text-muted-foreground">{mark}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Plunger */}
                  <div className="w-8 h-8 rounded-full border-2 border-border bg-muted-foreground/20" />
                </div>
              </div>

              {/* Result */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Aspirar até a marca de</p>
                <p className="text-3xl font-bold text-primary">{prescribedNum} UI</p>
                <p className="text-sm text-muted-foreground">= {volume.toFixed(2)} mL</p>
              </div>

              {!canUseSelectedSyringe && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">
                    A dose prescrita excede a capacidade desta seringa. 
                    Use uma seringa maior ou divida a dose.
                  </p>
                </div>
              )}

              <button
                onClick={saveToHistory}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Salvar no Histórico
              </button>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-info/30 bg-info/5">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Insulina U-100:</strong> 100 unidades por mL (padrão no Brasil)</p>
                <p><strong>Seringas de insulina:</strong> São graduadas em unidades, não em mL</p>
                <p><strong>Importante:</strong> Sempre use seringas de insulina para aplicar insulina. 
                Seringas convencionais só devem ser usadas em emergências quando não houver alternativa.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tabela de Conversão Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted/50 p-2 rounded">10 UI = 0.1 mL</div>
              <div className="bg-muted/50 p-2 rounded">20 UI = 0.2 mL</div>
              <div className="bg-muted/50 p-2 rounded">30 UI = 0.3 mL</div>
              <div className="bg-muted/50 p-2 rounded">40 UI = 0.4 mL</div>
              <div className="bg-muted/50 p-2 rounded">50 UI = 0.5 mL</div>
              <div className="bg-muted/50 p-2 rounded">100 UI = 1.0 mL</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InsulinCalculatorPage;
