 import { Moon, Sun } from 'lucide-react';
 import { useTheme } from 'next-themes';
 import { Switch } from '@/components/ui/switch';
 import { useEffect, useState } from 'react';
 
 export function ThemeToggle() {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
 
   // Avoid hydration mismatch
   useEffect(() => {
     setMounted(true);
   }, []);
 
   if (!mounted) {
     return (
       <div className="flex items-center justify-between gap-3 px-4 py-2">
         <div className="flex items-center gap-2">
           <Sun className="w-4 h-4 text-muted-foreground" />
           <span className="text-sm text-muted-foreground">Modo escuro</span>
         </div>
         <Switch disabled />
       </div>
     );
   }
 
   const isDark = theme === 'dark';
 
   return (
     <div className="flex items-center justify-between gap-3 px-4 py-2">
       <div className="flex items-center gap-2">
         {isDark ? (
           <Moon className="w-4 h-4 text-primary" />
         ) : (
           <Sun className="w-4 h-4 text-primary" />
         )}
         <span className="text-sm text-foreground">Modo escuro</span>
       </div>
       <Switch
         checked={isDark}
         onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
         aria-label="Alternar modo escuro"
       />
     </div>
   );
 }