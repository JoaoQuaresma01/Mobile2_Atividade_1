import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Avatar, Text, TextInput, Button, Divider, IconButton, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import api from './services/api';
import { AuthContext } from './contexts/AuthContext';
import { perfilStyles as styles } from './css/Styles';

const Perfil = ({ navigation }) => {
    const { usuario, atualizarUsuario } = useContext(AuthContext);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [imagem, setImagem] = useState(null);
    const [salvando, setSalvando] = useState(false);

    // Sincroniza os dados locais com o usuário logado
    useEffect(() => {
        if (usuario) {
            setNome(usuario.nome || usuario.nomeUsuario || '');
            setEmail(usuario.email || usuario.emailUsuario || '');
            setImagem(usuario.foto || usuario.fotoUsuario || null);
        }
    }, [usuario]);

    // Escolhe foto da galeria
    const editarFoto = async () => {
        try {
            const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissao.granted) {
                Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
                return;
            }

            const resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });

            if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
                const asset = resultado.assets[0];
                if (asset.base64) {
                    setImagem(`data:image/jpeg;base64,${asset.base64}`);
                } else {
                    setImagem(asset.uri);
                }
            }
        } catch (err) {
            console.error('Erro ao selecionar foto:', err);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        }
    };

    // Salva perfil
    const salvarPerfil = async () => {
        if (!usuario) {
            Alert.alert('Atenção', 'Faça login para editar o perfil.');
            navigation.navigate('Login');
            return;
        }

        if (!nome.trim()) {
            Alert.alert('Atenção', 'O nome não pode ficar em branco.');
            return;
        }

        try {
            setSalvando(true);
            const payload = {
                emailUsuario: email,
                nomeUsuario: nome.trim(),
                fotoUsuario: imagem || '',
            };

            const response = await api.put('/usuarios/perfil', payload);
            
            // Atualiza o contexto global para que o menu lateral reflita o novo perfil
            atualizarUsuario(response.data.usuario);
            Alert.alert('Sucesso!', 'Perfil atualizado com sucesso.');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            const mensagemErro = error.response?.data?.erro || 'Erro ao conectar com o servidor.';
            Alert.alert('Ops!', mensagemErro);
        } finally {
            setSalvando(false);
        }
    };

    // Caso o visitante acesse a tela sem login
    if (!usuario) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 25 }]}>
                <Avatar.Icon size={90} icon="account-alert" style={{ backgroundColor: '#F2A900', marginBottom: 20 }} />
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
                    Você não está conectado
                </Text>
                <Text variant="bodyMedium" style={{ textAlign: 'center', color: '#666', marginBottom: 25 }}>
                    Faça login na sua conta para visualizar e editar suas informações de perfil.
                </Text>
                <Button
                    mode="contained"
                    icon="login"
                    style={{ backgroundColor: '#F2A900', width: '100%', marginBottom: 15 }}
                    onPress={() => navigation.navigate('Login')}
                >
                    Fazer Login
                </Button>
                <Button
                    mode="outlined"
                    icon="arrow-left"
                    style={{ width: '100%' }}
                    onPress={() => navigation.goBack()}
                >
                    Voltar
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* CABEÇALHO */}
            <View style={styles.cabecalho}>
                {/* AVATAR */}
                <View style={styles.avatarContainer}>
                    {imagem ? (
                        <Image
                            source={{ uri: imagem }}
                            style={styles.avatarImagem}
                        />
                    ) : (
                        <Avatar.Icon
                            size={100}
                            icon="account"
                            style={styles.avatar}
                        />
                    )}

                    {/* BOTÃO EDITAR FOTO */}
                    <IconButton
                        icon="camera"
                        iconColor="white"
                        size={20}
                        style={styles.botaoEditar}
                        onPress={editarFoto}
                    />
                </View>

                {/* TÍTULO */}
                <Text variant="headlineSmall" style={styles.titulo}>
                    {nome || 'Meu Perfil'}
                </Text>

                <Text style={styles.subtitulo}>
                    {email}
                </Text>
            </View>

            <Divider />

            {/* FORMULÁRIO */}
            <View style={styles.formulario}>
                {/* NOME */}
                <TextInput
                    label="Nome Completo"
                    value={nome}
                    onChangeText={setNome}
                    mode="outlined"
                    left={<TextInput.Icon icon="account" />}
                    style={styles.input}
                />

                {/* E-MAIL */}
                <TextInput
                    label="E-mail"
                    value={email}
                    editable={false}
                    mode="outlined"
                    left={<TextInput.Icon icon="email" />}
                    style={[styles.input, { opacity: 0.7 }]}
                />

                {/* NOTA SOBRE ALTERAÇÃO DE SENHA */}
                <Button
                    mode="text"
                    icon="cog"
                    onPress={() => navigation.navigate('Configuracoes')}
                    textColor="#666"
                    style={{ alignSelf: 'flex-start', marginBottom: 15, marginTop: -5 }}
                >
                    Para alterar sua senha, acesse Configurações
                </Button>

                {/* SALVAR */}
                <Button
                    mode="contained"
                    icon="content-save"
                    loading={salvando}
                    disabled={salvando}
                    onPress={salvarPerfil}
                    style={styles.botao}
                >
                    {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </Button>

                {/* VOLTAR */}
                <Button
                    mode="outlined"
                    icon="arrow-left"
                    onPress={() => navigation.goBack()}
                    style={styles.botaoVoltar}
                >
                    Voltar
                </Button>
            </View>
        </ScrollView>
    );
};

export { Perfil };