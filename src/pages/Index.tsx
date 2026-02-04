import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculators, getCalculatorsByCategory } from '@/lib/calculatorTypes';
import { cn } from '@/lib/utils';
import { Shield, Sparkles } from 'lucide-react';

const Index = () => {
  const essentialCalcs = getCalculatorsByCategory('essential');
  const specializedCalcs = getCalculatorsByCategory('specialized');
  const assessmentCalcs = getCalculatorsByCategory('assessment');

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              SafeMed
            </h1>
            <p className="text-muted-foreground">
              Calculadoras de Segurança Medicamentosa
            </p>
          </div>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Ferramentas precisas para auxiliar profissionais de enfermagem em cálculos 
          essenciais do dia a dia, garantindo segurança na administração de medicamentos.
        </p>
      </div>

      {/* Essential Calculators */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Calculadoras Essenciais</h2>
          <Badge variant="secondary" className="text-xs">Uso Diário</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {essentialCalcs.map((calc) => (
            <Link key={calc.id} to={calc.route}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer group">
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
          <Badge variant="outline" className="text-xs">Monitoramento</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assessmentCalcs.map((calc) => (
            <Link key={calc.id} to={calc.route}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer group">
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
          <Badge variant="outline" className="text-xs">Avançado</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specializedCalcs.map((calc) => (
            <Link key={calc.id} to={calc.route}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer group">
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
      <Card className="bg-muted/50 border-dashed">
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
