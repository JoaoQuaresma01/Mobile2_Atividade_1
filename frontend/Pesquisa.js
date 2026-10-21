import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Appbar, TextInput, Text, ActivityIndicator, Avatar } from 'react-native-paper';
import { AuthContext } from './contexts/AuthContext';
import ModCard from './Cards';
import api from './services/api';
import Colors from './theme/Colors';

const Pesquisa = ({ navigation }) => {
    const { usuario } = useContext(AuthContext);
    const [termo, setTermo] = useState('');
    const [resultados, setResultados] = useState([]);
    const [buscando, setBuscando] = useState(false);
    const [buscou, setBuscou] = useState(false);

    const emailLogado = (usuario?.email || usuario?.emailUsuario || '').trim().toLowerCase();

    const buscar = useCallback(async (texto) => {
        const valor = (texto || '').trim();
        if (!valor) {
            setResultados([]);
            setBuscou(false);
            setBuscando(false);
            return;
        }

        try {
            setBuscando(true);
            const response = await api.get('/conteudo/buscar', {
                params: { termo: valor },
            });
            setResultados(Array.isArray(response.data) ? response.data : []);
            setBuscou(true);
        } catch (error) {
            console.error('Erro na pesquisa:', error);
            setResultados([]);
            setBuscou(true);
        } finally {
            setBuscando(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            buscar(termo);
        }, 350);
        return () => clearTimeout(timer);
    }, [termo, buscar]);

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
                            await api.delete(`/conteudo/${id}`, {
                                data: { emailUsuario: emailLogado },
                            });
                            setResultados((prev) => prev.filter((item) => item._id !== id));
                        } catch (err) {
                            const mensagemErro = err.response?.data?.erro || 'Não foi possível excluir o conteúdo.';
                            Alert.alert('Erro', mensagemErro);
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <ModCard
            conteudo={item}
            onExcluir={handleExcluir}
            onEditar={(c) => navigation.navigate('EditarConteudo', { conteudo: c })}
            onVer={(c) => navigation.navigate('VerCard', { conteudo: c })}
        />
    );

    const ListEmpty = () => {
        if (buscando) {
            return null;
        }
        if (!termo.trim()) {
            return (
                <View style={pesquisaStyles.emptyState}>
                    <Avatar.Icon size={72} icon="magnify" style={pesquisaStyles.emptyIcon} />
                    <Text variant="titleMedium" style={pesquisaStyles.emptyTitulo}>
                        Busque um conteúdo
                    </Text>
                    <Text variant="bodyMedium" style={pesquisaStyles.emptyTexto}>
                        Digite o título, subtítulo, categoria ou parte da descrição.
                    </Text>
                </View>
            );
        }
        if (buscou) {
            return (
                <View style={pesquisaStyles.emptyState}>
                    <Avatar.Icon size={72} icon="video-off-outline" style={pesquisaStyles.emptyIcon} />
                    <Text variant="titleMedium" style={pesquisaStyles.emptyTitulo}>
                        Nenhum resultado
                    </Text>
                    <Text variant="bodyMedium" style={pesquisaStyles.emptyTexto}>
                        Não encontramos cards para “{termo.trim()}”.
                    </Text>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={pesquisaStyles.tela}>
            <Appbar.Header style={pesquisaStyles.header}>
                <Appbar.BackAction
                    iconColor={Colors.textOnDark}
                    onPress={() => navigation.goBack()}
                />
                <Appbar.Content
                    title="Pesquisa"
                    titleStyle={pesquisaStyles.headerTitulo}
                />
            </Appbar.Header>

            <TextInput
                label="Pesquisar"
                placeholder="Digite um termo..."
                mode="outlined"
                value={termo}
                onChangeText={setTermo}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={() => buscar(termo)}
                left={<TextInput.Icon icon="magnify" />}
                right={
                    termo ? (
                        <TextInput.Icon icon="close" onPress={() => setTermo('')} />
                    ) : null
                }
                style={pesquisaStyles.input}
            />

            {buscando ? (
                <View style={pesquisaStyles.loading}>
                    <ActivityIndicator size="large" color={Colors.accent} />
                    <Text style={pesquisaStyles.loadingTexto}>Buscando...</Text>
                </View>
            ) : (
                <FlatList
                    data={resultados}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={[
                        pesquisaStyles.lista,
                        resultados.length === 0 && { flexGrow: 1 },
                    ]}
                    ListEmptyComponent={<ListEmpty />}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />
            )}
        </View>
    );
};

const pesquisaStyles = StyleSheet.create({
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
    },
    input: {
        margin: 16,
        marginBottom: 8,
        backgroundColor: Colors.surface,
    },
    lista: {
        paddingHorizontal: 12,
        paddingBottom: 32,
    },
    loading: {
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
    },
});

export default Pesquisa;
