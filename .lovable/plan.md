
# Plano: Remover banner de instalação e adicionar modo escuro

## Resumo
Remover o banner "Instale no seu celular" da página inicial e adicionar um toggle de modo escuro (claro/escuro) como opção de exibição no layout.

---

## Alterações

### 1. Remover banner de instalação iOS
**Arquivo:** `src/pages/Index.tsx`
- Remover o Card com o banner "Instale no seu celular..." (linhas 74-84)
- Manter apenas o botão "Instalar App" que aparece quando o PWA detecta que pode ser instalado (já existe e é mais inteligente)

### 2. Configurar ThemeProvider
**Arquivo:** `src/App.tsx`
- Importar `ThemeProvider` do `next-themes`
- Envolver toda a aplicação com o ThemeProvider
- Configurar para usar `attribute="class"` (compatível com Tailwind)
- Definir tema padrão como "light" com opção de seguir sistema

### 3. Criar componente de toggle de tema
**Novo arquivo:** `src/components/ThemeToggle.tsx`
- Criar um componente com Switch ou botão que alterna entre claro/escuro
- Usar ícones de Sol e Lua para indicar o modo
- Usar hook `useTheme` do next-themes

### 4. Adicionar toggle no sidebar
**Arquivo:** `src/components/layout/MainLayout.tsx`
- Adicionar o ThemeToggle no footer do sidebar (desktop e mobile)
- Posicionar junto ao copyright de forma elegante
- Incluir label "Modo escuro" ao lado do switch

---

## Detalhes Técnicos

### ThemeProvider config:
```text
attribute="class"
defaultTheme="system"
enableSystem
disableTransitionOnChange
```

### Toggle UI:
- Switch component já existente no projeto
- Ícones: Sun e Moon do lucide-react
- Label: "Modo escuro"
- Estado: ligado = dark, desligado = light

### Posicionamento:
O toggle ficará no footer do sidebar, visível tanto na versão desktop quanto no menu mobile, permitindo fácil acesso.
