import React, { useState, useCallback, useContext } from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { Appbar, ActivityIndicator, Text, Button, Avatar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from './contexts/AuthContext';
import ModCard from './Cards';
import api from './services/api';
import Colors from './theme/Colors';

const ABAS = [
    { id: 'todos', label: 'Todos' },
    { id: 'meus', label: 'Meus conteúdos' },
];

const AppBar = ({ navigation }) => {
    const { usuario } = useContext(AuthContext);
    const [listaConteudos, setListaConteudos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [abaSelecionada, setAbaSelecionada] = useState('todos');

    const carregarConteudos = useCallback(async () => {
        try {
            setCarregando(true);
            const response = await api.get('/conteudo/listar');
            setListaConteudos(response.data);
        } catch (error) {
            console.error('Erro ao buscar conteúdos:', error);
        } finally {
            setCarregando(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregarConteudos();
        }, [carregarConteudos])
    );

    const handleExcluir = (id) => {
        Alert.alert(
            'Confirmar exclusão',
            'Deseja realmente apagar este conteúdo?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/conteudo/${id}`);
                            setListaConteudos(prev => prev.filter(item => item._id !== id));
                        } catch (err) {
                            Alert.alert('Erro', 'Não foi possível excluir o conteúdo.');
                        }
                    },
                },
            ]
        );
    };

    const listaFiltrada = abaSelecionada === 'todos' ? listaConteudos : [];
    const mostrarMeusVazio = abaSelecionada === 'meus' && !carregando;

    const renderItem = ({ item }) => (
        <ModCard
            conteudo={item}
            onExcluir={handleExcluir}
            onEditar={(c) => navigation.navigate('EditarConteudo', { conteudo: c })}
        />
    );

    const EmptyTodos = () => (
        <View style={abStyles.emptyState}>
            <Avatar.Icon size={72} icon="video-off-outline" style={abStyles.emptyIcon} />
            <Text variant="titleMedium" style={abStyles.emptyTitulo}>
                Nenhum conteúdo cadastrado
            </Text>
            <Text variant="bodyMedium" style={abStyles.emptyTexto}>
                Ainda não há nada por aqui. Que tal adicionar o primeiro?
            </Text>
            {usuario && (
                <Button
                    mode="contained"
                    icon="plus"
                    style={abStyles.emptyBotao}
                    onPress={() => navigation.navigate('EditarConteudo', { conteudo: null })}
                >
                    Cadastrar conteúdo
                </Button>
            )}
        </View>
    );

    const EmptyMeus = () => (
        <View style={abStyles.emptyState}>
            {!usuario ? (
                <>
                    <Avatar.Icon size={72} icon="account-lock-outline" style={abStyles.emptyIcon} />
                    <Text variant="titleMedium" style={abStyles.emptyTitulo}>
                        Faça login para ver seus conteúdos
                    </Text>
                    <Text variant="bodyMedium" style={abStyles.emptyTexto}>
                        Crie uma conta ou entre com sua conta existente.
                    </Text>
                    <Button
                        mode="contained"
                        icon="login"
                        style={abStyles.emptyBotao}
                        onPress={() => navigation.navigate('Acesso')}
                    >
                        Fazer Login
                    </Button>
                </>
            ) : (
                <>
                    <Avatar.Icon size={72} icon="star-outline" style={abStyles.emptyIcon} />
                    <Text variant="titleMedium" style={abStyles.emptyTitulo}>
                        Você ainda não tem conteúdos
                    </Text>
                    <Text variant="bodyMedium" style={abStyles.emptyTexto}>
                        Cadastre o primeiro conteúdo e ele aparecerá aqui.
                    </Text>
                    <Button
                        mode="contained"
                        icon="plus"
                        style={abStyles.emptyBotao}
                        onPress={() => navigation.navigate('EditarConteudo', { conteudo: null })}
                    >
                        Cadastrar conteúdo
                    </Button>
                </>
            )}
        </View>
    );

    return (
        <View style={abStyles.tela}>
            {/* CABEÇALHO */}
            <Appbar.Header style={abStyles.header}>
                <Appbar.Action icon="menu" iconColor={Colors.textOnDark} onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Technologic" titleStyle={abStyles.headerTitulo} />
                <Appbar.Action
                    icon="magnify"
                    iconColor={Colors.textOnDark}
                    onPress={() => navigation.navigate('Pesquisa')}
                />
                {!usuario && (
                    <Appbar.Action
                        icon="account"
                        iconColor={Colors.textOnDark}
                        onPress={() => navigation.navigate('Acesso')}
                    />
                )}
            </Appbar.Header>

            {/* ABAS */}
            <View style={abStyles.abasContainer}>
                {ABAS.map((aba) => {
                    const ativa = abaSelecionada === aba.id;
                    return (
                        <TouchableOpacity
                            key={aba.id}
                            style={[abStyles.aba, ativa && abStyles.abaAtiva]}
                            onPress={() => setAbaSelecionada(aba.id)}
                            activeOpacity={0.75}
                        >
                            <Text style={[abStyles.abaTexto, ativa && abStyles.abaTextoAtivo]}>
                                {aba.label}
                            </Text>
                            {ativa && <View style={abStyles.abaIndicador} />}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* CONTEÚDO */}
            {carregando ? (
                <View style={abStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.accent} />
                    <Text style={abStyles.loadingTexto}>Carregando conteúdos...</Text>
                </View>
            ) : mostrarMeusVazio ? (
                <EmptyMeus />
            ) : (
                <FlatList
                    data={listaFiltrada}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={[
                        abStyles.listaContent,
                        listaFiltrada.length === 0 && { flexGrow: 1 },
                    ]}
                    ListEmptyComponent={<EmptyTodos />}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const abStyles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        backgroundColor: Colors.primary,
    },
    headerTitulo: {
        color: Colors.textOnDark,
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 0.5,
    },
    abasContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        elevation: 2,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    aba: {
        flex: 1,
        paddingVertical: 13,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    abaAtiva: {
        backgroundColor: Colors.surface,
    },
    abaTexto: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.tabInactive,
    },
    abaTextoAtivo: {
        color: Colors.tabActive,
        fontWeight: '700',
    },
    abaIndicador: {
        position: 'absolute',
        bottom: 0,
        left: '15%',
        right: '15%',
        height: 3,
        backgroundColor: Colors.tabIndicator,
        borderRadius: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingTexto: {
        color: Colors.textMuted,
        fontSize: 14,
        marginTop: 8,
    },
    listaContent: {
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 32,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 60,
    },
    emptyIcon: {
        backgroundColor: Colors.surfaceAlt,
        marginBottom: 18,
    },
    emptyTitulo: {
        fontWeight: 'bold',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyTexto: {
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    emptyBotao: {
        backgroundColor: Colors.accent,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
});

export default AppBar;
