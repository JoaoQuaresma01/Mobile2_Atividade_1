import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Avatar, Text, TextInput, Button, Divider, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import api from './services/api';
import { Alert } from 'react-native'

// João, importando nossa memória global para puxar quem logou
import { AuthContext } from './contexts/AuthContext';
import { perfilStyles as styles } from './css/Styles';

const Perfil = ({ navigation }) => {

    // Puxando o 'usuario' que salvamos no contexto lá na tela de Login
    const { usuario, atualizarUsuario } = useContext(AuthContext);

    // Dados do usuário -> Agora puxa os dados reais do MongoDB via AuthContext
    // Se por algum motivo o contexto estiver vazio, ele deixa em branco para não quebrar a tela
    const [nome, setNome] = useState(usuario?.nome || usuario?.nomeUsuario || '');
    const [email, setEmail] = useState(usuario?.email || usuario?.emailUsuario || '');

    // João, nosso Schema do Mongo ainda não tem Telefone e CPF, então deixei vazio por padrão.
    // Se formos usar, precisaremos adicionar no backend depois.
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');

    // Imagem do usuário (também tenta puxar do banco se houver)
    const [imagem, setImagem] = useState(usuario?.foto || usuario?.fotoUsuario || null);

    // Escolhe a imagem
    const editarFoto = async () => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissao.granted) {
            alert('Precisamos de permissão para acessar suas fotos.');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Na versão mais nova do Expo o padrão mudou um pouco, deixei garantido
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!resultado.canceled) {
            setImagem(resultado.assets[0].uri);
        }
    };

    // SALVA PERFIL
    const salvarPerfil = async () => {
        if (!nome.trim()) {
            Alert.alert('Atenção', 'O nome não pode ficar em branco.');
            return;
        }
        try {
            const payload = {
                emailUsuario: email,
                nomeUsuario: nome,
                fotoUsuario: imagem || '',
            };
            if (senha.trim()) {
                payload.novaSenha = senha;
            }
            const response = await api.put('/usuarios/perfil', payload);
            // Atualiza a memória global para que o menu lateral mostre o novo nome/foto na hora
            atualizarUsuario(response.data.usuario);
            setSenha('');
            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        } catch (error) {
            Alert.alert('Erro', error.response?.data?.erro || 'Erro ao conectar com o servidor.');
        }
    };

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

                {/* BOTÃO EDITAR */}
                <IconButton
                    icon="pencil"
                    iconColor="white"
                    size={18}
                    style={styles.botaoEditar}
                    onPress={editarFoto}
                />
            </View>

            {/* TÍTULO - AGORA DINÂMICO! */}
            <Text
                variant="headlineSmall"
                style={styles.titulo}
            >
                Olá, {nome || 'Visitante'}!
            </Text>

            <Text style={styles.subtitulo}>
                Atualize seus dados pessoais
            </Text>
        </View>

        <Divider />

        {/* ============================= */}
        {/* FORMULÁRIO */}
        {/* ============================= */}
        <View style={styles.formulario}>

            {/* NOME */}
            <TextInput
                label="Nome"
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
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                style={styles.input}
            />

            {/* TELEFONE */}
            <TextInput
                label="Telefone"
                value={telefone}
                onChangeText={setTelefone}
                mode="outlined"
                keyboardType="phone-pad"
                left={<TextInput.Icon icon="phone" />}
                style={styles.input}
            />

            {/* CPF */}
            <TextInput
                label="CPF"
                value={cpf}
                onChangeText={setCpf}
                mode="outlined"
                keyboardType="numeric"
                left={<TextInput.Icon icon="card-account-details" />}
                style={styles.input}
            />

            {/* NOVA SENHA */}
            <TextInput
                label="Nova senha"
                value={senha}
                onChangeText={setSenha}
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon="lock" />}
                style={styles.input}
            />

            {/* ============================= */}
            {/* SALVAR */}
            {/* ============================= */}
            <Button
                mode="contained"
                icon="content-save"
                onPress={salvarPerfil}
                style={styles.botao}
            >
                Salvar alterações
            </Button>

            {/* ============================= */}
            {/* VOLTAR */}
            {/* ============================= */}
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