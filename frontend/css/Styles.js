import { StyleSheet } from 'react-native';

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
        backgroundColor: 'gray',
        borderRadius: 150,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f0e0e',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16,
        color: '#0d0d0d',
    },
    header: {
        backgroundColor: '#C0C0C0',
    },
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 5,
        marginTop: 10,
    },
    tabText: {
        color: '#0b0b0b',
        fontSize: 14,
        fontWeight: 'bold',
    },
// ========= CARD  ================
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
        backgroundColor: '#FFFFFF',
        elevation: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardCover: {
        height: 200,
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
// ========= ACESSO  ================
   acesso: {
    padding: 25,
    justifyContent: 'center',
},
acessoTitulo: {
    textAlign: 'center',
    fontWeight: 'bold',  
    marginBottom: 10,
},
acessoTexto: {
    textAlign: 'center',
    marginBottom: 30,
},
acessoButton: {
    marginBottom: 15,
    borderRadius: 5,
},

// ========= LOGIN   ================

loginContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
},
loginContent: {
    padding: 25,
},
loginTitulo: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 30,
},
loginTexto: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
},
input: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
},
loginButton: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
},
// =========================
// CADASTRO
// =========================

cadastroContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
},
cadastroContent: {
    padding: 25,
},
cadastroTitulo: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
},
cadastroTexto: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 25,
},
cadastroButton: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
},
// ========= CABEÇALHO DO MENU ================
menuHeader: {
                padding: 20,
                backgroundColor: '#C0C0C0',
            }

});

// ==========================================
// ESTILOS EXCLUSIVOS DA TELA DE PERFIL
// ==========================================
export const perfilStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    cabecalho: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#C0C0C0',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    avatar: {
        backgroundColor: '#F2A900',
    },
    avatarImagem: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    botaoEditar: {
        position: 'absolute',
        right: -8,
        bottom: -8,
        backgroundColor: '#555555',
        margin: 0,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    titulo: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    subtitulo: {
        color: '#FFFFFF',
        marginTop: 5,
    },
    formulario: {
        padding: 20,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    botao: {
        marginTop: 10,
        paddingVertical: 5,
        backgroundColor: '#F2A900',
    },
    botaoVoltar: {
        marginTop: 15,
        paddingVertical: 5,
    },
});

// ==========================================
// ESTILOS DO MENU LATERAL (DRAWER)
// ==========================================
export const menuStyles = StyleSheet.create({
    container: {
        backgroundColor: '#C0C0C0',
        paddingTop: 25,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    usuario: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: '#F2A900',
    },
    informacoes: {
        flex: 1,
        marginLeft: 15,
    },
    nome: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 19,
    },
    email: {
        color: '#FFFFFF',
        marginTop: 3,
    },
    perfil: {
        marginTop: 15,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    perfilTexto: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    // Estilo para o botão de Login quando for visitante
    botaoLoginVisitante: {
        marginTop: 5,
        alignSelf: 'flex-start',
    }
});