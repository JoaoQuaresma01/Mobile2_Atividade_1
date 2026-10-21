import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Appbar, TextInput, Button, Text } from 'react-native-paper';
import { styles } from './css/Styles';
import api from './services/api';
import { AuthContext } from './contexts/AuthContext';

const EditarConteudo = ({ route, navigation }) => {
    const { usuario } = useContext(AuthContext);
    const { conteudo } = route.params || {};
    const isNovo = !conteudo?._id;
    const emailLogado = (usuario?.email || usuario?.emailUsuario || '').trim().toLowerCase();
    const emailAutor = (conteudo?.emailUsuarioConteudo || '').trim().toLowerCase();

    const [titulo, setTitulo]       = useState(conteudo?.tituloConteudo    || '');
    const [subtitulo, setSubtitulo] = useState(conteudo?.subtituloConteudo || '');
    const [urlImagem, setUrlImagem] = useState(conteudo?.urlImagemConteudo || '');
    const [descricao, setDescricao] = useState(conteudo?.descricaoConteudo || '');
    const [categoria, setCategoria] = useState(conteudo?.categoriaConteudo || '');
    const [salvando, setSalvando]   = useState(false);

    useEffect(() => {
        if (!usuario) {
            Alert.alert('Atenção', 'Faça login para continuar.');
            navigation.replace('Login');
            return;
        }
        if (!isNovo && emailAutor && emailLogado !== emailAutor) {
            Alert.alert('Atenção', 'Você só pode editar os próprios cards.');
            navigation.goBack();
        }
    }, [usuario, isNovo, emailAutor, emailLogado, navigation]);

    const salvar = async () => {
        if (!titulo.trim()) {
            Alert.alert('Atenção', 'O título não pode ficar vazio.');
            return;
        }
        if (!urlImagem.trim()) {
            Alert.alert('Atenção', 'A URL da imagem é obrigatória.');
            return;
        }
        if (!subtitulo.trim()) {
            Alert.alert('Atenção', 'O subtítulo é obrigatório.');
            return;
        }

        try {
            setSalvando(true);

            if (isNovo) {
                await api.post('/conteudo/cadastrar', {
                    tituloConteudo:    titulo.trim(),
                    subtituloConteudo: subtitulo.trim(),
                    urlImagemConteudo: urlImagem.trim(),
                    descricaoConteudo: descricao.trim(),
                    categoriaConteudo: categoria.trim(),
                    emailUsuario: emailLogado,
                });
                Alert.alert('Sucesso!', 'Conteúdo cadastrado com sucesso!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
                await api.put(`/conteudo/${conteudo._id}`, {
                    tituloConteudo:    titulo.trim(),
                    subtituloConteudo: subtitulo.trim(),
                    urlImagemConteudo: urlImagem.trim(),
                    descricaoConteudo: descricao.trim(),
                    categoriaConteudo: categoria.trim(),
                    emailUsuario: emailLogado,
                });
                Alert.alert('Sucesso!', 'Conteúdo atualizado com sucesso!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            const mensagemErro = error.response?.data?.erro || 'Não foi possível salvar o conteúdo.';
            Alert.alert('Erro', mensagemErro);
        } finally {
            setSalvando(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title={isNovo ? 'Novo Conteúdo' : 'Editar Conteúdo'}
                    titleStyle={{ color: 'white', fontWeight: 'bold' }}
                />
            </Appbar.Header>

            <ScrollView contentContainerStyle={editStyles.conteudo} showsVerticalScrollIndicator={false}>
                <Text variant="bodySmall" style={editStyles.labelSecao}>Informações básicas</Text>

                <TextInput
                    label="Título *"
                    value={titulo}
                    onChangeText={setTitulo}
                    mode="outlined"
                    left={<TextInput.Icon icon="format-title" />}
                    style={editStyles.input}
                />

                <TextInput
                    label="Subtítulo / Episódio *"
                    value={subtitulo}
                    onChangeText={setSubtitulo}
                    mode="outlined"
                    left={<TextInput.Icon icon="subtitles-outline" />}
                    style={editStyles.input}
                />

                <TextInput
                    label="URL da Imagem de Capa *"
                    value={urlImagem}
                    onChangeText={setUrlImagem}
                    mode="outlined"
                    keyboardType="url"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="image-outline" />}
                    style={editStyles.input}
                />

                <TextInput
                    label="Categoria (ex: Série, Filme, Anime)"
                    value={categoria}
                    onChangeText={setCategoria}
                    mode="outlined"
                    left={<TextInput.Icon icon="tag-outline" />}
                    style={editStyles.input}
                />

                <TextInput
                    label="Descrição"
                    value={descricao}
                    onChangeText={setDescricao}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    left={<TextInput.Icon icon="text-long" />}
                    style={[editStyles.input, { marginBottom: 28 }]}
                />

                <Button
                    mode="contained"
                    icon={isNovo ? 'plus-circle' : 'content-save'}
                    loading={salvando}
                    disabled={salvando}
                    buttonColor="#C0C0C0"
                    textColor="white"
                    style={editStyles.botao}
                    onPress={salvar}
                >
                    {salvando ? 'Salvando...' : isNovo ? 'Cadastrar' : 'Salvar Alterações'}
                </Button>

                <Button
                    mode="outlined"
                    icon="arrow-left"
                    disabled={salvando}
                    style={editStyles.botaoVoltar}
                    onPress={() => navigation.goBack()}
                >
                    Cancelar
                </Button>
            </ScrollView>
        </View>
    );
};

const editStyles = StyleSheet.create({
    conteudo: {
        padding: 20,
        paddingBottom: 40,
    },
    labelSecao: {
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
        marginLeft: 2,
    },
    input: {
        marginBottom: 14,
        backgroundColor: '#FFFFFF',
    },
    botao: {
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    botaoVoltar: {
        borderRadius: 8,
    },
});

export default EditarConteudo;
