import React from 'react';
import { View, Alert } from 'react-native';
import { Appbar, TextInput, Button, Text } from 'react-native-paper';
import { styles } from './css/Styles';

// importando a nossa configuração do Axios
import api from './services/api'; 

const Cadastro = ({ navigation }) => {
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [confirmarSenha, setConfirmarSenha] = React.useState('');

    const [mostrarSenha, setMostrarSenha] = React.useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = React.useState(false);

    // transformamos em assíncrona para aguardar a resposta da API
    const cadastrar = async () => {
        // Validações básicas de preenchimento
        if (!nome || !email || !senha || !confirmarSenha) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Atenção', 'As senhas não coincidem. Verifique e tente novamente.');
            return;
        }

        try {
            // Chamando a rota POST que você testou no Hoppscotch
            const response = await api.post('/usuarios/cadastro', {
                nomeUsuario: nome,
                emailUsuario: email,
                senhaUsuario: senha,
                notificacaoUsuario: true, // Padrão que definimos
                fotoUsuario: ""           // Padrão vazio
            });

            // se der status 201 (Created), mostra a mensagem de sucesso que vem do backend
            Alert.alert('Sucesso!', response.data.mensagem || 'Usuário cadastrado com sucesso!');
            
            // Limpa os campos (opcional, mas recomendado) e navega para o Login
            setNome('');
            setEmail('');
            setSenha('');
            setConfirmarSenha('');
            navigation.navigate('Login');

        } catch (error) {
            // se o backend barrar (ex: erro no Regex da senha ou e-mail já cadastrado)
            const mensagemErro = error.response?.data?.erro || 'Ocorreu um erro ao conectar com o servidor.';
            Alert.alert('Ops!', mensagemErro);
            console.error('Erro no cadastro:', error);
        }
    };

    return (
        <View style={styles.cadastroContainer}>
            {/* APPBAR */}
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction
                    iconColor="white"
                    onPress={() => navigation.goBack()}
                />
                <Appbar.Content
                    title="Cadastro"
                    titleStyle={styles.title}
                />
            </Appbar.Header>

            {/* FORMULÁRIO */}
            <View style={styles.cadastroContent}>
                <Text
                    variant="headlineMedium"
                    style={styles.cadastroTitulo}
                >
                    Criar conta
                </Text>

                <Text
                    variant="bodyLarge"
                    style={styles.cadastroTexto}
                >
                    Preencha os dados abaixo
                </Text>

                {/* NOME */}
                <TextInput
                    label="Nome"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChangeText={setNome}
                    mode="outlined"
                    left={<TextInput.Icon icon="account" />}
                    style={styles.input}
                />

                {/* E-MAIL */}
                <TextInput
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email" />}
                    style={styles.input}
                />

                {/* SENHA */}
                <TextInput
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChangeText={setSenha}
                    mode="outlined"
                    secureTextEntry={!mostrarSenha}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                        <TextInput.Icon
                            icon={mostrarSenha ? 'eye-off' : 'eye'}
                            onPress={() => setMostrarSenha(!mostrarSenha)}
                        />
                    }
                    style={styles.input}
                />

                {/* CONFIRMAR SENHA */}
                <TextInput
                    label="Confirmar senha"
                    placeholder="Digite novamente sua senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    mode="outlined"
                    secureTextEntry={!mostrarConfirmacao}
                    left={<TextInput.Icon icon="lock-check" />}
                    right={
                        <TextInput.Icon
                            icon={mostrarConfirmacao ? 'eye-off' : 'eye'}
                            onPress={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                        />
                    }
                    style={styles.input}
                />

                {/* CADASTRAR */}
                <Button
                    mode="contained"
                    icon="account-plus"
                    style={styles.cadastroButton}
                    onPress={cadastrar}
                >
                    CADASTRAR
                </Button>

                {/* JÁ POSSUI CONTA */}
                <Button
                    mode="text"
                    icon="login"
                    onPress={() => navigation.navigate('Login')}
                >
                    JÁ TENHO CADASTRO
                </Button>
            </View>
        </View>
    );
};

export default Cadastro;