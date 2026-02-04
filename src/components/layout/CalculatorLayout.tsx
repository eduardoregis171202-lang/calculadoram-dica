import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  children: ReactNode;
  result?: ReactNode;
  warnings?: string[];
  info?: string[];
  onCalculate?: () => void;
  onClear?: () => void;
  isCalculateDisabled?: boolean;
}

export function CalculatorLayout({
  title,
  description,
  icon: Icon,
  colorClass,
  children,
  result,
  warnings,
  info,
  onCalculate,
  onClear,
  isCalculateDisabled = false,
}: CalculatorLayoutProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-xl', colorClass.replace('text-', 'bg-') + '/10')}>
              <Icon className={cn('w-8 h-8', colorClass)} />
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calculator Form */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {children}

          {/* Action Buttons */}
          {(onCalculate || onClear) && (
            <div className="flex gap-3 pt-4">
              {onCalculate && (
                <Button 
                  onClick={onCalculate} 
                  className="flex-1"
                  disabled={isCalculateDisabled}
                >
                  Calcular
                </Button>
              )}
              {onClear && (
                <Button variant="outline" onClick={onClear}>
                  Limpar
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Display */}
      {result && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Resultado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result}
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <p key={index} className="text-sm text-foreground">
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      {info && info.length > 0 && (
        <Card className="border-info/30 bg-info/5">
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                {info.map((infoItem, index) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    {infoItem}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
