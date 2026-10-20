import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
    Appbar,
    Text,
    Card,
    Avatar,
    IconButton,
    Button,
    Badge,
    Switch,
    Divider,
    Portal,
    Dialog,
} from 'react-native-paper';
import { AuthContext } from './contexts/AuthContext';
import api from './services/api';

const NOTIFICACOES_INICIAIS = [
    {
        id: '1',
        titulo: '🎉 Bem-vindo ao Technologic!',
        mensagem: 'Explore conteúdos exclusivos, séries e filmes cadastrados na plataforma.',
        data: 'Há 15 minutos',
        icone: 'party-popper',
        lida: false,
    },
    {
        id: '2',
        titulo: '🎬 Novos cards disponíveis',
        mensagem: 'Novos materiais foram publicados no catálogo. Dê uma olhada na tela inicial!',
        data: 'Hoje às 14:30',
        icone: 'filmstrip',
        lida: false,
    },
    {
        id: '3',
        titulo: '🔒 Dica de Segurança',
        mensagem: 'Mantenha sua conta protegida: você pode alterar sua senha na tela de Configurações.',
        data: 'Ontem',
        icone: 'shield-check',
        lida: true,
    },
    {
        id: '4',
        titulo: '👤 Personalize seu perfil',
        mensagem: 'Adicione uma foto e preencha suas informações para uma experiência personalizada.',
        data: 'Há 3 dias',
        icone: 'account-cog',
        lida: true,
    },
];

const Notificacoes = ({ navigation }) => {
    const { usuario, atualizarUsuario } = useContext(AuthContext);

    const [notificacoesAtivas, setNotificacoesAtivas] = useState(
        usuario?.notificacao ?? true
    );
    const [listaNotificacoes, setListaNotificacoes] = useState(NOTIFICACOES_INICIAIS);
    const [dialogLimpar, setDialogLimpar] = useState(false);
    const [atualizandoStatus, setAtualizandoStatus] = useState(false);

    // Contagem de não lidas
    const naoLidas = listaNotificacoes.filter(n => !n.lida).length;

    // Alternar notificações no backend
    const alternarNotificacoes = async () => {
        if (!usuario) {
            Alert.alert('Atenção', 'Faça login para salvar suas preferências de notificação.');
            return;
        }

        const novoValor = !notificacoesAtivas;
        setNotificacoesAtivas(novoValor);

        try {
            setAtualizandoStatus(true);
            const email = usuario.email || usuario.emailUsuario;
            await api.put('/usuarios/notificacao', {
                emailUsuario: email,
                notificacaoUsuario: novoValor,
            });
            atualizarUsuario({ notificacao: novoValor });
        } catch (error) {
            console.error('Erro ao atualizar notificação:', error);
            setNotificacoesAtivas(!novoValor);
            Alert.alert('Erro', 'Não foi possível atualizar a preferência de notificação.');
        } finally {
            setAtualizandoStatus(false);
        }
    };

    // Marcar uma como lida/não lida
    const toggleLida = (id) => {
        setListaNotificacoes(prev =>
            prev.map(item =>
                item.id === id ? { ...item, lida: !item.lida } : item
            )
        );
    };

    // Marcar todas como lidas
    const marcarTodasComoLidas = () => {
        setListaNotificacoes(prev =>
            prev.map(item => ({ ...item, lida: true }))
        );
    };

    // Excluir notificação específica
    const excluirNotificacao = (id) => {
        setListaNotificacoes(prev => prev.filter(item => item.id !== id));
    };

    // Limpar todas
    const confirmarLimparTodas = () => {
        setListaNotificacoes([]);
        setDialogLimpar(false);
    };

    return (
        <View style={notifStyles.tela}>
            {/* APPBAR */}
            <Appbar.Header style={notifStyles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Notificações" titleStyle={notifStyles.headerTitulo} />
                {naoLidas > 0 && (
                    <Badge style={notifStyles.badgeHeader}>{naoLidas}</Badge>
                )}
            </Appbar.Header>

            <ScrollView contentContainerStyle={notifStyles.scrollContent}>
                {/* CARD DE CONTROLE GERAL */}
                <Card style={notifStyles.cardControle}>
                    <Card.Content style={notifStyles.linhaControle}>
                        <Avatar.Icon
                            size={44}
                            icon={notificacoesAtivas ? 'bell-ring' : 'bell-off'}
                            style={{
                                backgroundColor: notificacoesAtivas ? '#F2A900' : '#888',
                                marginRight: 12,
                            }}
                        />
                        <View style={{ flex: 1 }}>
                            <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
                                Notificações do App
                            </Text>
                            <Text variant="bodySmall" style={{ color: '#666' }}>
                                {notificacoesAtivas
                                    ? 'Você está recebendo alertas e novidades.'
                                    : 'Alertas pausados. Ative para não perder novidades.'}
                            </Text>
                        </View>
                        <Switch
                            value={notificacoesAtivas}
                            onValueChange={alternarNotificacoes}
                            color="#F2A900"
                            disabled={atualizandoStatus}
                        />
                    </Card.Content>
                </Card>

                {/* BARRA DE AÇÕES (MARCAR TODAS / LIMPAR) */}
                {listaNotificacoes.length > 0 && (
                    <View style={notifStyles.barraAcoes}>
                        <Button
                            mode="text"
                            compact
                            icon="check-all"
                            onPress={marcarTodasComoLidas}
                            disabled={naoLidas === 0}
                            textColor="#F2A900"
                        >
                            Marcar lidas ({naoLidas})
                        </Button>
                        <Button
                            mode="text"
                            compact
                            icon="trash-can-outline"
                            onPress={() => setDialogLimpar(true)}
                            textColor="#888"
                        >
                            Limpar tudo
                        </Button>
                    </View>
                )}

                {/* AVISO SE DESATIVADO */}
                {!notificacoesAtivas && (
                    <View style={notifStyles.bannerPausado}>
                        <Avatar.Icon
                            size={24}
                            icon="information"
                            style={{ backgroundColor: 'transparent' }}
                            color="#E65100"
                        />
                        <Text variant="bodySmall" style={notifStyles.textoBannerPausado}>
                            As notificações push estão desativadas. Você ainda pode visualizar o histórico aqui.
                        </Text>
                    </View>
                )}

                {/* LISTA DE NOTIFICAÇÕES */}
                {listaNotificacoes.length === 0 ? (
                    <View style={notifStyles.emptyState}>
                        <Avatar.Icon
                            size={80}
                            icon="bell-sleep-outline"
                            style={notifStyles.avatarEmpty}
                        />
                        <Text variant="titleMedium" style={notifStyles.tituloEmpty}>
                            Nenhuma notificação por aqui!
                        </Text>
                        <Text variant="bodyMedium" style={notifStyles.textoEmpty}>
                            Quando houver novidades sobre seus conteúdos favoritos, elas aparecerão nesta tela.
                        </Text>
                        <Button
                            mode="outlined"
                            icon="refresh"
                            onPress={() => setListaNotificacoes(NOTIFICACOES_INICIAIS)}
                            style={{ marginTop: 20 }}
                        >
                            Restaurar Notificações Exemplo
                        </Button>
                    </View>
                ) : (
                    listaNotificacoes.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.8}
                            onPress={() => toggleLida(item.id)}
                        >
                            <Card
                                style={[
                                    notifStyles.cardNotificacao,
                                    !item.lida && notifStyles.cardNaoLida,
                                ]}
                            >
                                <Card.Content style={notifStyles.notifContent}>
                                    {/* ÍCONE COM STATUS */}
                                    <View style={notifStyles.iconeContainer}>
                                        <Avatar.Icon
                                            size={42}
                                            icon={item.icone || 'bell'}
                                            style={[
                                                notifStyles.avatarNotif,
                                                item.lida && notifStyles.avatarNotifLida,
                                            ]}
                                        />
                                        {!item.lida && <View style={notifStyles.pontoNaoLida} />}
                                    </View>

                                    {/* TEXTO */}
                                    <View style={notifStyles.textoContainer}>
                                        <View style={notifStyles.linhaCabecalhoNotif}>
                                            <Text
                                                variant="titleSmall"
                                                style={[
                                                    notifStyles.notifTitulo,
                                                    !item.lida && { fontWeight: 'bold' },
                                                ]}
                                            >
                                                {item.titulo}
                                            </Text>
                                            <Text variant="bodySmall" style={notifStyles.notifData}>
                                                {item.data}
                                            </Text>
                                        </View>
                                        <Text variant="bodyMedium" style={notifStyles.notifMensagem}>
                                            {item.mensagem}
                                        </Text>
                                    </View>

                                    {/* EXCLUIR */}
                                    <IconButton
                                        icon="close"
                                        size={18}
                                        iconColor="#aaa"
                                        onPress={() => excluirNotificacao(item.id)}
                                        style={notifStyles.botaoFechar}
                                    />
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* DIALOG LIMPAR TUDO */}
            <Portal>
                <Dialog visible={dialogLimpar} onDismiss={() => setDialogLimpar(false)}>
                    <Dialog.Title>Limpar Notificações</Dialog.Title>
                    <Dialog.Content>
                        <Text>Deseja apagar todas as notificações do histórico?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogLimpar(false)}>Cancelar</Button>
                        <Button onPress={confirmarLimparTodas} textColor="#D32F2F">
                            Limpar Tudo
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const notifStyles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#C0C0C0',
    },
    headerTitulo: {
        fontWeight: 'bold',
        color: '#0f0e0e',
    },
    badgeHeader: {
        backgroundColor: '#F2A900',
        color: '#fff',
        fontWeight: 'bold',
        marginRight: 16,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    cardControle: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    linhaControle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    barraAcoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    bannerPausado: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3E0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    textoBannerPausado: {
        flex: 1,
        color: '#E65100',
        marginLeft: 8,
    },
    cardNotificacao: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 1,
    },
    cardNaoLida: {
        backgroundColor: '#FFFDF5',
        borderLeftWidth: 4,
        borderLeftColor: '#F2A900',
        elevation: 3,
    },
    notifContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    iconeContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatarNotif: {
        backgroundColor: '#F2A900',
    },
    avatarNotifLida: {
        backgroundColor: '#CCC',
    },
    pontoNaoLida: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E53935',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    textoContainer: {
        flex: 1,
    },
    linhaCabecalhoNotif: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    notifTitulo: {
        color: '#222',
        flex: 1,
        marginRight: 6,
    },
    notifData: {
        color: '#888',
        fontSize: 11,
    },
    notifMensagem: {
        color: '#555',
        fontSize: 13,
        lineHeight: 18,
    },
    botaoFechar: {
        margin: 0,
        alignSelf: 'flex-start',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    avatarEmpty: {
        backgroundColor: '#E0E0E0',
        marginBottom: 16,
    },
    tituloEmpty: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    textoEmpty: {
        color: '#777',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default Notificacoes;
