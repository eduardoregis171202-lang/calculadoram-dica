import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculators, getCalculatorsByCategory } from '@/lib/calculatorTypes';
import { cn } from '@/lib/utils';
import { Shield, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const Index = () => {
  const essentialCalcs = getCalculatorsByCategory('essential');
  const specializedCalcs = getCalculatorsByCategory('specialized');
  const assessmentCalcs = getCalculatorsByCategory('assessment');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                SafeMed
              </h1>
              <p className="text-white/80">
                Calculadoras de Segurança Medicamentosa
              </p>
            </div>
          </div>
          <p className="text-white/90 max-w-xl mb-4">
            Ferramentas precisas para auxiliar profissionais de enfermagem em cálculos 
            essenciais do dia a dia, garantindo segurança na administração de medicamentos.
          </p>
          
          {isInstallable && (
            <Button 
              onClick={handleInstall}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Instalar App
            </Button>
          )}
        </div>
      </div>

      {/* Essential Calculators */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Calculadoras Essenciais</h2>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Uso Diário</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {essentialCalcs.map((calc) => (
            <Link key={calc.id} to={calc.route}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer group overflow-hidden">
                <div className={cn('h-1', calc.bgColorClass.replace('/10', ''))} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={cn('p-2.5 rounded-xl', calc.bgColorClass)}>
                      <calc.icon className={cn('w-6 h-6', calc.colorClass)} />
                    </div>
                    <Sparkles className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-base mt-3 group-hover:text-primary transition-colors">
                    {calc.shortName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm line-clamp-2">
                    {calc.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Assessment Calculators */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Avaliação do Paciente</h2>
          <Badge variant="outline" className="text-xs border-success/30 text-success">Monitoramento</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assessmentCalcs.map((calc) => (
            <Link key={calc.id} to={calc.route}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer group overflow-hidden">
                <div className={cn('h-1', calc.bgColorClass.replace('/10', ''))} />
                <CardHeader className="pb-3">
                  <div className={cn('p-2.5 rounded-xl w-fit', calc.bgColorClass)}>
                    <calc.icon className={cn('w-6 h-6', calc.colorClass)} />
                  </div>
                  <CardTitle className="text-base mt-3 group-hover:text-primary transition-colors">
                    {calc.shortName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm line-clamp-2">
                    {calc.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Specialized Calculators */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Calculadoras Especializadas</h2>
          <Badge variant="outline" className="text-xs border-accent/30 text-accent">Avançado</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specializedCalcs.map((calc) => (
            <Link key={calc.id} to={calc.route}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer group overflow-hidden">
                <div className={cn('h-1', calc.bgColorClass.replace('/10', ''))} />
                <CardHeader className="pb-3">
                  <div className={cn('p-2.5 rounded-xl w-fit', calc.bgColorClass)}>
                    <calc.icon className={cn('w-6 h-6', calc.colorClass)} />
                  </div>
                  <CardTitle className="text-base mt-3 group-hover:text-primary transition-colors">
                    {calc.shortName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm line-clamp-2">
                    {calc.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <Card className="bg-muted/50 border-dashed border-primary/20">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Aviso:</strong> Este aplicativo é uma ferramenta auxiliar e não substitui 
            o julgamento clínico profissional. Sempre verifique os cálculos e consulte 
            protocolos institucionais.
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Index;
