import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CalculatorLayout } from '@/components/layout/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Plus, Trash2, ArrowDown, ArrowUp } from 'lucide-react';
import { useCalculatorHistory } from '@/hooks/useCalculatorHistory';
import { cn } from '@/lib/utils';

interface FluidEntry {
  id: string;
  description: string;
  volume: number;
}

const FluidBalanceCalculatorPage = () => {
  const [inputs, setInputs] = useState<FluidEntry[]>([]);
  const [outputs, setOutputs] = useState<FluidEntry[]>([]);
  const [newInputDesc, setNewInputDesc] = useState('');
  const [newInputVol, setNewInputVol] = useState('');
  const [newOutputDesc, setNewOutputDesc] = useState('');
  const [newOutputVol, setNewOutputVol] = useState('');
  const { addEntry } = useCalculatorHistory();

  const inputPresets = [
    'Soro Fisiológico 0,9%',
    'Soro Glicosado 5%',
    'Ringer Lactato',
    'Medicação EV',
    'Dieta Enteral',
    'Dieta Parenteral (NPT)',
    'Água VO',
    'Suco/Chá VO',
    'Hemoderivados',
    'Plasma',
    'Albumina',
    'Lavagem Gástrica',
  ];

  const outputPresets = [
    'Diurese',
    'Diurese (SVD)',
    'Vômito',
    'Drenagem Torácica',
    'Drenagem Abdominal',
    'Dreno de Penrose',
    'Sonda Nasogástrica',
    'Aspiração Traqueal',
    'Fezes',
    'Diarreia',
    'Ostomia',
    'Sangramento',
    'Sudorese Intensa',
    'Ferida Operatória',
  ];

  const addInput = () => {
    if (!newInputDesc || !newInputVol || parseFloat(newInputVol) <= 0) return;
    setInputs([...inputs, {
      id: Date.now().toString(),
      description: newInputDesc,
      volume: parseFloat(newInputVol),
    }]);
    setNewInputDesc('');
    setNewInputVol('');
  };

  const addOutput = () => {
    if (!newOutputDesc || !newOutputVol || parseFloat(newOutputVol) <= 0) return;
    setOutputs([...outputs, {
      id: Date.now().toString(),
      description: newOutputDesc,
      volume: parseFloat(newOutputVol),
    }]);
    setNewOutputDesc('');
    setNewOutputVol('');
  };

  const removeInput = (id: string) => {
    setInputs(inputs.filter(i => i.id !== id));
  };

  const removeOutput = (id: string) => {
    setOutputs(outputs.filter(o => o.id !== id));
  };

  const totalInputs = inputs.reduce((sum, i) => sum + i.volume, 0);
  const totalOutputs = outputs.reduce((sum, o) => sum + o.volume, 0);
  const balance = totalInputs - totalOutputs;

  const saveToHistory = () => {
    addEntry(
      'hydro',
      'Balanço Hídrico',
      { 
        inputs: inputs.map(i => `${i.description}: ${i.volume}mL`).join(', '),
        outputs: outputs.map(o => `${o.description}: ${o.volume}mL`).join(', '),
      },
      {
        'Total Entradas': `${totalInputs}mL`,
        'Total Saídas': `${totalOutputs}mL`,
        'Balanço': `${balance > 0 ? '+' : ''}${balance}mL`,
      }
    );
  };

  const clear = () => {
    setInputs([]);
    setOutputs([]);
    setNewInputDesc('');
    setNewInputVol('');
    setNewOutputDesc('');
    setNewOutputVol('');
  };

  const getBalanceStatus = () => {
    if (balance === 0) return { label: 'Equilibrado', color: 'text-success', bg: 'bg-success/10' };
    if (balance > 0) return { label: 'Positivo', color: 'text-warning', bg: 'bg-warning/10' };
    return { label: 'Negativo', color: 'text-destructive', bg: 'bg-destructive/10' };
  };

  const status = getBalanceStatus();

  return (
    <MainLayout title="Balanço Hídrico" showBackButton>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-calc-hydro/10">
            <Activity className="w-8 h-8 text-calc-hydro" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Balanço Hídrico</h2>
            <p className="text-muted-foreground">Análise de entradas e saídas de líquidos do paciente</p>
          </div>
        </div>

        {/* Balance Summary */}
        <Card className={cn('border-2', status.bg)}>
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-success mb-1">
                  <ArrowDown className="w-4 h-4" />
                  <span className="text-sm font-medium">Entradas</span>
                </div>
                <p className="text-2xl font-bold">{totalInputs} mL</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-destructive mb-1">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Saídas</span>
                </div>
                <p className="text-2xl font-bold">{totalOutputs} mL</p>
              </div>
              <div>
                <p className={cn('text-sm font-medium mb-1', status.color)}>{status.label}</p>
                <p className={cn('text-2xl font-bold', status.color)}>
                  {balance > 0 ? '+' : ''}{balance} mL
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inputs Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowDown className="w-4 h-4 text-success" />
              Entradas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick presets */}
            <div className="flex flex-wrap gap-2">
              {inputPresets.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setNewInputDesc(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>

            {/* Add new input */}
            <div className="flex gap-2">
              <Input
                placeholder="Descrição"
                value={newInputDesc}
                onChange={(e) => setNewInputDesc(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="mL"
                value={newInputVol}
                onChange={(e) => setNewInputVol(e.target.value)}
                className="w-24"
                min="0"
              />
              <Button onClick={addInput} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* List of inputs */}
            {inputs.length > 0 && (
              <div className="space-y-2">
                {inputs.map((input) => (
                  <div key={input.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                    <span className="text-sm">{input.description}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{input.volume} mL</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeInput(input.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Outputs Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-destructive" />
              Saídas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick presets */}
            <div className="flex flex-wrap gap-2">
              {outputPresets.map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setNewOutputDesc(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>

            {/* Add new output */}
            <div className="flex gap-2">
              <Input
                placeholder="Descrição"
                value={newOutputDesc}
                onChange={(e) => setNewOutputDesc(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="mL"
                value={newOutputVol}
                onChange={(e) => setNewOutputVol(e.target.value)}
                className="w-24"
                min="0"
              />
              <Button onClick={addOutput} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* List of outputs */}
            {outputs.length > 0 && (
              <div className="space-y-2">
                {outputs.map((output) => (
                  <div key={output.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                    <span className="text-sm">{output.description}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{output.volume} mL</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeOutput(output.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={saveToHistory} className="flex-1" disabled={inputs.length === 0 && outputs.length === 0}>
            Salvar no Histórico
          </Button>
          <Button variant="outline" onClick={clear}>
            Limpar Tudo
          </Button>
        </div>

        {/* Info */}
        <Card className="border-info/30 bg-info/5">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Balanço Equilibrado (0):</strong> Entradas = Saídas</p>
              <p><strong>Balanço Positivo (+):</strong> Mais líquido entrando que saindo (atenção para sobrecarga)</p>
              <p><strong>Balanço Negativo (-):</strong> Mais líquido saindo que entrando (atenção para desidratação)</p>
              <p className="text-xs mt-4">
                <strong>Nota:</strong> O balanço hídrico é uma ferramenta auxiliar. A avaliação clínica completa 
                deve incluir exames laboratoriais, sinais vitais e condição clínica do paciente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FluidBalanceCalculatorPage;
