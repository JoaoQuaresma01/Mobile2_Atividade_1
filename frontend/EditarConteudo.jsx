import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import { styles } from './css/Styles';
import api from './services/api';

const EditarConteudo = ({ route, navigation }) => {
    // 1. Recebe os dados do card enviados pelo AppBar
    const { conteudo } = route.params;

    // 2. Estados preenchidos com os dados atuais do card
    const [titulo, setTitulo] = useState(conteudo?.tituloConteudo || '');
    const [subtitulo, setSubtitulo] = useState(conteudo?.subtituloConteudo || '');
    const [urlImagem, setUrlImagem] = useState(conteudo?.urlImagemConteudo || '');
    const [descricao, setDescricao] = useState(conteudo?.descricaoConteudo || '');
    const [salvando, setSalvando] = useState(false);

    // 3. Função para salvar as alterações no MongoDB (PUT)
    const salvarEdicao = async () => {
        if (!titulo) {
            Alert.alert('Atenção', 'O título não pode ficar vazio.');
            return;
        }

        try {
            setSalvando(true);
            // Chama a rota PUT do backend que você já tem no server.js
            await api.put(`/conteudo/${conteudo._id}`, {
                tituloConteudo: titulo,
                subtituloConteudo: subtitulo,
                urlImagemConteudo: urlImagem,
                descricaoConteudo: descricao
            });

            Alert.alert('Sucesso!', 'Conteúdo atualizado com sucesso.', [
                { text: 'OK', onPress: () => navigation.goBack() } // Volta para a Home
            ]);
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o conteúdo.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} />
                <Appbar.Content title="Editar Conteúdo" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <TextInput
                    label="Título"
                    value={titulo}
                    onChangeText={setTitulo}
                    mode="outlined"
                    style={{ marginBottom: 15 }}
                />

                <TextInput
                    label="Subtítulo"
                    value={subtitulo}
                    onChangeText={setSubtitulo}
                    mode="outlined"
                    style={{ marginBottom: 15 }}
                />

                <TextInput
                    label="URL da Imagem"
                    value={urlImagem}
                    onChangeText={setUrlImagem}
                    mode="outlined"
                    style={{ marginBottom: 15 }}
                />

                <TextInput
                    label="Descrição"
                    value={descricao}
                    onChangeText={setDescricao}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={{ marginBottom: 25 }}
                />

                <Button
                    mode="contained"
                    loading={salvando}
                    disabled={salvando}
                    buttonColor="#F2A900"
                    textColor="white"
                    onPress={salvarEdicao}
                >
                    Salvar Alterações
                </Button>
            </ScrollView>
        </View>
    );
};

export default EditarConteudo;
