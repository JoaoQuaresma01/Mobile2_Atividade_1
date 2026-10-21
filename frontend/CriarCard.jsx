import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Appbar, TextInput, Button, Text } from 'react-native-paper';
import { AuthContext } from './contexts/AuthContext';
import api from './services/api';
import Colors from './theme/Colors';

const CriarCard = ({ navigation }) => {
    const { usuario } = useContext(AuthContext);

    const [titulo, setTitulo] = useState('');
    const [subtitulo, setSubtitulo] = useState('');
    const [urlImagem, setUrlImagem] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (!usuario) {
            navigation.replace('Login');
        }
    }, [usuario, navigation]);

    const limparFormulario = () => {
        setTitulo('');
        setSubtitulo('');
        setUrlImagem('');
        setDescricao('');
        setCategoria('');
    };

    const salvar = async () => {
        if (!titulo.trim()) {
            Alert.alert('Atenção', 'O título não pode ficar vazio.');
            return;
        }
        if (!subtitulo.trim()) {
            Alert.alert('Atenção', 'O subtítulo é obrigatório.');
            return;
        }
        if (!urlImagem.trim()) {
            Alert.alert('Atenção', 'A URL da imagem é obrigatória.');
            return;
        }

        try {
            setSalvando(true);
            await api.post('/conteudo/cadastrar', {
                tituloConteudo: titulo.trim(),
                subtituloConteudo: subtitulo.trim(),
                urlImagemConteudo: urlImagem.trim(),
                descricaoConteudo: descricao.trim(),
                categoriaConteudo: categoria.trim(),
                emailUsuario: (usuario.email || usuario.emailUsuario || '').trim().toLowerCase(),
            });
            limparFormulario();
            Alert.alert('Sucesso!', 'Card cadastrado com sucesso!', [
                { text: 'OK', onPress: () => navigation.navigate('Home') },
            ]);
        } catch (error) {
            const mensagemErro = error.response?.data?.erro || 'Não foi possível cadastrar o card.';
            Alert.alert('Erro', mensagemErro);
        } finally {
            setSalvando(false);
        }
    };

    if (!usuario) {
        return null;
    }

    return (
        <View style={criarStyles.tela}>
            <Appbar.Header style={criarStyles.header}>
                <Appbar.BackAction iconColor={Colors.textOnDark} onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title="Criar card"
                    titleStyle={criarStyles.headerTitulo}
                />
            </Appbar.Header>

            <ScrollView contentContainerStyle={criarStyles.conteudo} showsVerticalScrollIndicator={false}>
                <Text variant="bodySmall" style={criarStyles.labelSecao}>Novo conteúdo</Text>

                <TextInput
                    label="Título *"
                    value={titulo}
                    onChangeText={setTitulo}
                    mode="outlined"
                    left={<TextInput.Icon icon="format-title" />}
                    style={criarStyles.input}
                />

                <TextInput
                    label="Subtítulo / Episódio *"
                    value={subtitulo}
                    onChangeText={setSubtitulo}
                    mode="outlined"
                    left={<TextInput.Icon icon="subtitles-outline" />}
                    style={criarStyles.input}
                />

                <TextInput
                    label="URL da Imagem de Capa *"
                    value={urlImagem}
                    onChangeText={setUrlImagem}
                    mode="outlined"
                    keyboardType="url"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="image-outline" />}
                    style={criarStyles.input}
                />

                <TextInput
                    label="Categoria (ex: Série, Filme, Anime)"
                    value={categoria}
                    onChangeText={setCategoria}
                    mode="outlined"
                    left={<TextInput.Icon icon="tag-outline" />}
                    style={criarStyles.input}
                />

                <TextInput
                    label="Descrição"
                    value={descricao}
                    onChangeText={setDescricao}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    left={<TextInput.Icon icon="text-long" />}
                    style={[criarStyles.input, { marginBottom: 28 }]}
                />

                <Button
                    mode="contained"
                    icon="plus-circle"
                    loading={salvando}
                    disabled={salvando}
                    buttonColor={Colors.accent}
                    textColor={Colors.textOnDark}
                    style={criarStyles.botao}
                    onPress={salvar}
                >
                    {salvando ? 'Cadastrando...' : 'Cadastrar card'}
                </Button>

                <Button
                    mode="outlined"
                    icon="arrow-left"
                    disabled={salvando}
                    style={criarStyles.botaoVoltar}
                    onPress={() => navigation.goBack()}
                >
                    Cancelar
                </Button>
            </ScrollView>
        </View>
    );
};

const criarStyles = StyleSheet.create({
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
    conteudo: {
        padding: 20,
        paddingBottom: 40,
    },
    labelSecao: {
        color: Colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
        marginLeft: 2,
    },
    input: {
        marginBottom: 14,
        backgroundColor: Colors.surface,
    },
    botao: {
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    botaoVoltar: {
        borderRadius: 8,
        borderColor: Colors.border,
    },
});

export default CriarCard;
