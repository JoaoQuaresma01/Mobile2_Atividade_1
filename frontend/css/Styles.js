import { StyleSheet } from 'react-native';
import Colors from '../theme/Colors';

// ==========================================
// ESTILOS GLOBAIS (LOGIN, CADASTRO, ETC)
// ==========================================
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 20,
        backgroundColor: Colors.surfaceAlt,
        borderRadius: 150,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.textSecondary,
    },
    // ── Cabeçalho (Appbar) ──────────────────────
    header: {
        backgroundColor: Colors.primary,
    },
    // ── Abas (legado – mantido para compatibilidade) ─
    tabs: {
        height: 100,
        flexGrow: 0,
    },
    tab: {
        height: 45,
        paddingHorizontal: 20,
        marginHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 5,
        marginTop: 10,
    },
    tabText: {
        color: Colors.textPrimary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    // ── Cards ───────────────────────────────────
    cards: {
        flex: 1,
    },
    cardsContent: {
        paddingHorizontal: 10,
        paddingTop: 0,
        paddingBottom: 30,
    },
    card: {
        marginHorizontal: 0,
        marginTop: 0,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: Colors.surface,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    cardCover: {
        // Mantido por compatibilidade; Cards.js usa aspectRatio
        aspectRatio: 16 / 9,
        backgroundColor: Colors.surfaceAlt,
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
    // ── Acesso ──────────────────────────────────
    acesso: {
        padding: 25,
        justifyContent: 'center',
    },
    acessoTitulo: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.textPrimary,
    },
    acessoTexto: {
        textAlign: 'center',
        marginBottom: 30,
        color: Colors.textSecondary,
    },
    acessoButton: {
        marginBottom: 15,
        borderRadius: 8,
    },
    // ── Login ───────────────────────────────────
    loginContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loginContent: {
        padding: 25,
    },
    loginTitulo: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 30,
        color: Colors.textPrimary,
    },
    loginTexto: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 30,
        color: Colors.textSecondary,
    },
    input: {
        marginBottom: 15,
        backgroundColor: Colors.surface,
    },
    loginButton: {
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    // ── Cadastro ────────────────────────────────
    cadastroContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    cadastroContent: {
        padding: 25,
    },
    cadastroTitulo: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 20,
        color: Colors.textPrimary,
    },
    cadastroTexto: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 25,
        color: Colors.textSecondary,
    },
    cadastroButton: {
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    // ── Cabeçalho do Menu (legado) ───────────────
    menuHeader: {
        padding: 20,
        backgroundColor: Colors.primary,
    },
});

// ==========================================
// ESTILOS DA TELA DE PERFIL
// ==========================================
export const perfilStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    cabecalho: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: Colors.primary,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    avatar: {
        backgroundColor: Colors.accent,
    },
    avatarImagem: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.textOnDark,
    },
    botaoEditar: {
        position: 'absolute',
        right: -8,
        bottom: -8,
        backgroundColor: Colors.accent,
        margin: 0,
        borderWidth: 2,
        borderColor: Colors.textOnDark,
    },
    titulo: {
        color: Colors.textOnDark,
        fontWeight: 'bold',
    },
    subtitulo: {
        color: Colors.drawerSubtext,
        marginTop: 5,
    },
    formulario: {
        padding: 20,
    },
    input: {
        marginBottom: 15,
        backgroundColor: Colors.surface,
    },
    botao: {
        marginTop: 10,
        paddingVertical: 5,
        backgroundColor: Colors.accent,
    },
    botaoVoltar: {
        marginTop: 15,
        paddingVertical: 5,
        borderColor: Colors.border,
    },
});

// ==========================================
// ESTILOS DO MENU LATERAL (DRAWER)
// ==========================================
export const menuStyles = StyleSheet.create({
    container: {
        backgroundColor: Colors.drawerBg,
        paddingTop: 25,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    usuario: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: Colors.accent,
    },
    informacoes: {
        flex: 1,
        marginLeft: 15,
    },
    nome: {
        color: Colors.drawerText,
        fontWeight: 'bold',
        fontSize: 19,
    },
    email: {
        color: Colors.drawerSubtext,
        marginTop: 3,
    },
    perfil: {
        marginTop: 15,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.drawerDivider,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    perfilTexto: {
        color: Colors.drawerText,
        fontWeight: 'bold',
    },
    botaoLoginVisitante: {
        marginTop: 5,
        alignSelf: 'flex-start',
    },
});