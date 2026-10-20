import { MD3LightTheme } from 'react-native-paper';
import Colors from './Colors';

export const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary:          Colors.accent,        // azul-vivo para botões e switches
        secondary:        Colors.success,       // verde para ações secundárias
        background:       Colors.background,    // fundo geral
        surface:          Colors.surface,       // cards e dialogs
        surfaceVariant:   Colors.surfaceAlt,    // inputs e campos
        onSurface:        Colors.textPrimary,
        onSurfaceVariant: Colors.textSecondary,
        error:            Colors.danger,
        onPrimary:        Colors.textOnDark,
        outline:          Colors.border,
    },
};