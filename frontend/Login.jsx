import React, { useContext } from 'react'; // Hook para usar nossa memória global
import { View, Alert } from 'react-native';
import {
    Appbar,
    TextInput,
    Button,
    Text,
} from 'react-native-paper';

import { styles } from './css/Styles';
import api from './services/api';

// precisamos importar o contexto que criei para salvar o usuário após o login
import { AuthContext } from './contexts/AuthContext';

const Login = ({ navigation }) => {

    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [mostrarSenha, setMostrarSenha] = React.useState(false);

    // puxando a função signIn de dentro do nosso cofre (AuthContext)
    const { signIn } = useContext(AuthContext);

    const entrar = async () => {
        if (!email || !senha) {
            Alert.alert('Atenção', 'Por favor, preencha o e-mail e a senha.');
            return;
        }

        try {
            const response = await api.post('/usuarios/login', {
                emailUsuario: email,
                senhaUsuario: senha
            });

            // João, o backend devolve os dados em response.data.usuario
            // Aqui eu gravo isso no contexto, assim você consegue usar os dados dele 
            // no Menu Lateral e para bloquear os botões de edição das imagens depois
            signIn(response.data.usuario);

            Alert.alert('Bem-vindo!', response.data.mensagem || 'Login realizado com sucesso');
            
            // Limpa os dados por segurança antes de trocar de tela
            setEmail('');
            setSenha('');
            navigation.navigate('Perfil');

        } catch (error) {
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