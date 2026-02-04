import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  History, 
  FileText, 
  Menu, 
  X,
  ChevronLeft,
  Shield
} from 'lucide-react';
import { calculators } from '@/lib/calculatorTypes';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export function MainLayout({ children, title, showBackButton = false }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/historico', icon: History, label: 'Histórico' },
    { to: '/ebooks', icon: FileText, label: 'eBooks' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">SafeMed</h1>
            <p className="text-xs text-muted-foreground">Calculadoras Médicas</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'nav-link',
                location.pathname === item.to && 'active'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Calculadoras
          </p>
          <nav className="space-y-1">
            {calculators.map((calc) => (
              <Link
                key={calc.id}
                to={calc.route}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'nav-link',
                  location.pathname === calc.route && 'active'
                )}
              >
                <calc.icon className={cn('w-5 h-5', location.pathname !== calc.route && calc.colorClass)} />
                {calc.shortName}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          © 2024 SafeMed
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:border-r lg:bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card px-4">
        {showBackButton ? (
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        )}
        
        <div className="flex-1">
          {title ? (
            <h1 className="font-semibold text-foreground truncate">{title}</h1>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold">SafeMed</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="container py-6 lg:py-8">
          {/* Desktop Title */}
          {title && (
            <div className="hidden lg:flex items-center gap-4 mb-6">
              {showBackButton && (
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/">
                    <ChevronLeft className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
