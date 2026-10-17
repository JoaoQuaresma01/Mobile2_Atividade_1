import React from 'react';
import { View, Alert } from 'react-native';
import {
    Appbar,
    TextInput,
    Button,
    Text,
} from 'react-native-paper';

import { styles } from './css/Styles';

// importando a configuração do Axios
import api from './services/api';

const Login = ({ navigation }) => {

    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [mostrarSenha, setMostrarSenha] = React.useState(false);

    // função assíncrona para comunicação com o back-end
    const entrar = async () => {
        // validação básica
        if (!email || !senha) {
            Alert.alert('Atenção', 'Por favor, preencha o e-mail e a senha.');
            return;
        }

        try {
            // a rota POST que valida o login
            const response = await api.post('/usuarios/login', {
                emailUsuario: email,
                senhaUsuario: senha
            });

            // Se der tudo certo, mostra status 200 (OK), mostra a mensagem de sucesso
            Alert.alert('Bem-vindo! c:', response.data.mensagem || 'Login realizado com sucesso!');
            
            // aqui vamos capturar o response.data.usuario 
            // e salvar no aplicativo para o João usar no Menu!

            // limpa os campos e navega para a área logada
            setEmail('');
            setSenha('');
            navigation.navigate('Perfil');

        } catch (error) {
            // seee o backend barrar (senha incorreta ou e-mail não existe)
            const mensagemErro = error.response?.data?.erro || error.response?.data?.mensagem || 'E-mail ou senha incorretos.';
            Alert.alert('Erro no Login', mensagemErro);
            console.error('Erro no login:', error);
        }
    };

    return (
        <View style={styles.loginContainer}>

            {/* APPBAR */}
            <Appbar.Header>
                <Appbar.BackAction
                    iconColor="black"
                    onPress={() => navigation.goBack()}
                />
                <Appbar.Content
                    title="Login"
                    titleStyle={styles.title}
                />
            </Appbar.Header>

            {/* FORMULÁRIO */}
            <View style={styles.loginContent}>

                <Text
                    variant="headlineMedium"
                    style={styles.loginTitulo}
                >
                    Bem-vindo!
                </Text>

                <Text
                    variant="bodyLarge"
                    style={styles.loginTexto}
                >
                    Entre com sua conta
                </Text>

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

                {/* ENTRAR */}
                <Button
                    mode="contained"
                    icon="login"
                    style={styles.loginButton}
                    onPress={entrar}
                >
                    ENTRAR
                </Button>

                {/* CADASTRO */}
                <Button
                    mode="text"
                    icon="account-plus"
                    onPress={() => navigation.navigate('Cadastro')}
                >
                    NÃO TENHO CADASTRO
                </Button>

            </View>
        </View>
    );
};

export default Login;