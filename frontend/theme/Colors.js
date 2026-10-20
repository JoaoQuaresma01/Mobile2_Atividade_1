/**
 * TECHNOLOGIC – Design Tokens
 *
 * Paleta inspirada em apps de streaming e SaaS modernos (Letterboxd, TMDB, Linear).
 * Altere apenas aqui para propagar por todo o app.
 */

const Colors = {
    // ── Estruturais ──────────────────────────────────────────
    primary:       '#1E2A3A',   // cabeçalhos e barras de navegação (azul-noturno)
    primaryDark:   '#131C27',   // versão mais escura para sombras/hover
    accent:        '#3B82F6',   // ação principal, botões, links, switches (azul-vivo)
    accentLight:   '#EFF6FF',   // fundo suave de badges e banners informativos

    // ── Backgrounds ──────────────────────────────────────────
    background:    '#F7F8FA',   // fundo geral das telas
    surface:       '#FFFFFF',   // fundo de cards, inputs e dialogs
    surfaceAlt:    '#EAECF0',   // fundo suave (tabs, dividers)

    // ── Texto ────────────────────────────────────────────────
    textPrimary:   '#111827',   // títulos e texto principal
    textSecondary: '#6B7280',   // subtítulos e placeholders
    textMuted:     '#9CA3AF',   // metadados, timestamps, legendas
    textOnDark:    '#FFFFFF',   // texto sobre fundos escuros (header, botões)

    // ── Status ───────────────────────────────────────────────
    success:       '#10B981',   // ações positivas / notificações de sucesso
    warning:       '#F59E0B',   // avisos / badges de atenção
    danger:        '#EF4444',   // exclusão e erros
    dangerLight:   '#FEF2F2',   // fundo suave de alertas de erro

    // ── Bordas e separadores ──────────────────────────────────
    border:        '#E5E7EB',
    borderStrong:  '#D1D5DB',

    // ── Componentes específicos ───────────────────────────────
    drawerBg:      '#1E2A3A',
    drawerText:    '#E2E8F0',
    drawerSubtext: '#94A3B8',
    drawerDivider: 'rgba(255,255,255,0.12)',

    cardShadow:    '#000',
    avatarBg:      '#3B82F6',
    avatarBgMuted: '#CBD5E1',

    // ── Tabs ──────────────────────────────────────────────────
    tabActive:     '#3B82F6',
    tabInactive:   '#6B7280',
    tabIndicator:  '#3B82F6',
};

export default Colors;
