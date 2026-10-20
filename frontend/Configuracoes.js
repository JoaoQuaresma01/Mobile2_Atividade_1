import React, { useState, useContext } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import Colors from './theme/Colors';
import {
    Appbar,
    Text,
    TextInput,
    Button,
    Card,
    Switch,
    Divider,
    Avatar,
    Portal,
    Dialog,
    IconButton,
} from 'react-native-paper';
import { AuthContext } from './contexts/AuthContext';
import api from './services/api';

const Configuracoes = ({ navigation }) => {
    const { usuario, signOut, atualizarUsuario } = useContext(AuthContext);

    // Estados para alteração de senha
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
    const [alterandoSenha, setAlterandoSenha] = useState(false);

    // Estado para notificações
    const [notificacoesAtivas, setNotificacoesAtivas] = useState(
        usuario?.notificacao ?? true
    );
    const [atualizandoNotificacao, setAtualizandoNotificacao] = useState(false);

    // Modais de confirmação
    const [dialogExcluir, setDialogExcluir] = useState(false);
    const [dialogSair, setDialogSair] = useState(false);
    const [excluindoConta, setExcluindoConta] = useState(false);

    // 1. Alternar notificações
    const alternarNotificacoes = async () => {
        if (!usuario) {
            Alert.alert('Atenção', 'Faça login para alterar as configurações.');
            return;
        }

        const novoValor = !notificacoesAtivas;
        setNotificacoesAtivas(novoValor);

        try {
            setAtualizandoNotificacao(true);
            const email = usuario.email || usuario.emailUsuario;
            await api.put('/usuarios/notificacao', {
                emailUsuario: email,
                notificacaoUsuario: novoValor,
            });
            atualizarUsuario({ notificacao: novoValor });
        } catch (error) {
            console.error('Erro ao atualizar notificação:', error);
            // Reverte em caso de erro
            setNotificacoesAtivas(!novoValor);
            Alert.alert('Erro', 'Não foi possível atualizar sua preferência de notificação.');
        } finally {
            setAtualizandoNotificacao(false);
        }
    };

    // 2. Alterar senha
    const handleAlterarSenha = async () => {
        if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos de senha.');
            return;
        }

        if (novaSenha !== confirmarNovaSenha) {
            Alert.alert('Atenção', 'A confirmação de senha não confere com a nova senha.');
            return;
        }

        const regexsenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!regexsenha.test(novaSenha)) {
            Alert.alert(
                'Senha inválida',
                'A nova senha deve ter no mínimo 8 caracteres, contendo pelo menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial (@$!%*?&).'
            );
            return;
        }

        try {
            setAlterandoSenha(true);
            const email = usuario.email || usuario.emailUsuario;
            const response = await api.put('/usuarios/alterar-senha', {
                emailUsuario: email,
                senhaAtual,
                novaSenha,
            });

            Alert.alert('Sucesso!', response.data.mensagem || 'Senha alterada com sucesso.');
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarNovaSenha('');
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            const mensagemErro = error.response?.data?.erro || 'Erro ao alterar senha.';
            Alert.alert('Ops!', mensagemErro);
        } finally {
            setAlterandoSenha(false);
        }
    };

    // 3. Excluir conta
    const handleExcluirConta = async () => {
        try {
            setExcluindoConta(true);
            const email = usuario.email || usuario.emailUsuario;
            await api.delete(`/usuarios/excluir/${encodeURIComponent(email)}`);

            setDialogExcluir(false);
            signOut();
            Alert.alert('Conta Excluída', 'Sua conta foi permanentemente removida.');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Erro ao excluir conta:', error);
            const mensagemErro = error.response?.data?.erro || 'Não foi possível excluir sua conta.';
            Alert.alert('Erro', mensagemErro);
        } finally {
            setExcluindoConta(false);
        }
    };

    // 4. Logout
    const handleSair = () => {
        setDialogSair(false);
        signOut();
        navigation.navigate('Home');
    };

    return (
        <View style={configStyles.tela}>
            {/* APPBAR */}
            <Appbar.Header style={configStyles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Configurações" titleStyle={configStyles.headerTitulo} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={configStyles.scrollContent}>
                {/* IDENTIFICAÇÃO DO USUÁRIO */}
                {usuario ? (
                    <Card style={configStyles.cardUsuario}>
                        <Card.Content style={configStyles.usuarioContent}>
                            {usuario.foto || usuario.fotoUsuario ? (
                                <Avatar.Image
                                    size={60}
                                    source={{ uri: usuario.foto || usuario.fotoUsuario }}
                                    style={configStyles.avatar}
                                />
                            ) : (
                                <Avatar.Icon size={60} icon="account" style={configStyles.avatar} />
                            )}
                            <View style={configStyles.usuarioInfo}>
                                <Text variant="titleMedium" style={configStyles.usuarioNome}>
                                    {usuario.nome || usuario.nomeUsuario}
                                </Text>
                                <Text variant="bodySmall" style={configStyles.usuarioEmail} numberOfLines={1}>
                                    {usuario.email || usuario.emailUsuario}
                                </Text>
                            </View>
                            <Button
                                mode="outlined"
                                compact
                                onPress={() => navigation.navigate('Perfil')}
                                style={configStyles.botaoEditarPerfil}
                            >
                                Perfil
                            </Button>
                        </Card.Content>
                    </Card>
                ) : (
                    <Card style={configStyles.cardVisitante}>
                        <Card.Content style={{ alignItems: 'center', paddingVertical: 20 }}>
                            <Avatar.Icon size={50} icon="account-off" style={{ backgroundColor: Colors.accent, marginBottom: 10 }} />
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Você está navegando como Visitante</Text>
                            <Text variant="bodySmall" style={{ color: Colors.textSecondary, textAlign: 'center', marginTop: 4, marginBottom: 15 }}>
                                Faça login para gerenciar sua segurança e personalizar as preferências da conta.
                            </Text>
                            <Button
                                mode="contained"
                                icon="login"
                                onPress={() => navigation.navigate('Login')}
                            >
                                Fazer Login
                            </Button>
                        </Card.Content>
                    </Card>
                )}

                {/* SEÇÃO: NOTIFICAÇÕES */}
                <Text style={configStyles.secaoTitulo}>Notificações</Text>
                <Card style={configStyles.cardSecao}>
                    <Card.Content style={configStyles.linhaSwitch}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
                                Notificações do Aplicativo
                            </Text>
                            <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>
                                Receba novidades, alertas de novos conteúdos e recomendações.
                            </Text>
                        </View>
                        <Switch
                            value={notificacoesAtivas}
                            onValueChange={alternarNotificacoes}
                            color={Colors.accent}
                            disabled={!usuario || atualizandoNotificacao}
                        />
                    </Card.Content>
                    <Divider />
                    <Card.Actions>
                        <Button
                            icon="bell"
                            onPress={() => navigation.navigate('Notificacoes')}
                            textColor={Colors.accent}
                        >
                            Ver Central de Notificações
                        </Button>
                    </Card.Actions>
                </Card>

                {/* SEÇÃO: SEGURANÇA (ALTERAR SENHA) */}
                {usuario && (
                    <>
                        <Text style={configStyles.secaoTitulo}>Segurança e Senha</Text>
                        <Card style={configStyles.cardSecao}>
                            <Card.Content>
                                <TextInput
                                    label="Senha atual"
                                    value={senhaAtual}
                                    onChangeText={setSenhaAtual}
                                    mode="outlined"
                                    secureTextEntry={!mostrarSenhaAtual}
                                    left={<TextInput.Icon icon="lock-outline" />}
                                    right={
                                        <TextInput.Icon
                                            icon={mostrarSenhaAtual ? 'eye-off' : 'eye'}
                                            onPress={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                                        />
                                    }
                                    style={configStyles.input}
                                />

                                <TextInput
                                    label="Nova senha"
                                    value={novaSenha}
                                    onChangeText={setNovaSenha}
                                    mode="outlined"
                                    secureTextEntry={!mostrarNovaSenha}
                                    left={<TextInput.Icon icon="lock" />}
                                    right={
                                        <TextInput.Icon
                                            icon={mostrarNovaSenha ? 'eye-off' : 'eye'}
                                            onPress={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                                        />
                                    }
                                    style={configStyles.input}
                                />

                                <TextInput
                                    label="Confirmar nova senha"
                                    value={confirmarNovaSenha}
                                    onChangeText={setConfirmarNovaSenha}
                                    mode="outlined"
                                    secureTextEntry={!mostrarNovaSenha}
                                    left={<TextInput.Icon icon="lock-check" />}
                                    style={configStyles.input}
                                />

                                <Button
                                    mode="contained"
                                    icon="key-change"
                                    loading={alterandoSenha}
                                    disabled={alterandoSenha}
                                    onPress={handleAlterarSenha}
                                    style={configStyles.botaoSalvarSenha}
                                >
                                    Atualizar Senha
                                </Button>
                            </Card.Content>
                        </Card>
                    </>
                )}

                {/* SEÇÃO: CONTA */}
                {usuario && (
                    <>
                        <Text style={configStyles.secaoTitulo}>Conta</Text>
                        <Card style={configStyles.cardSecao}>
                            <Card.Content>
                                <Button
                                    mode="outlined"
                                    icon="logout"
                                    onPress={() => setDialogSair(true)}
                                    style={configStyles.botaoSair}
                                    textColor={Colors.textPrimary}
                                >
                                    Encerrar Sessão
                                </Button>

                                <Button
                                    mode="outlined"
                                    icon="delete-forever"
                                    onPress={() => setDialogExcluir(true)}
                                    style={configStyles.botaoExcluir}
                                    textColor={Colors.danger}
                                >
                                    Excluir Minha Conta
                                </Button>
                            </Card.Content>
                        </Card>
                    </>
                )}

                {/* INFORMAÇÕES DO APP */}
                <View style={configStyles.rodape}>
                    <Text variant="bodySmall" style={{ color: Colors.textSecondary, textAlign: 'center' }}>
                        Technologic App • Versão 1.0.0
                    </Text>
                    <Text variant="bodySmall" style={{ color: Colors.textMuted, textAlign: 'center', marginTop: 4 }}>
                        Desenvolvido com React Native & Expo
                    </Text>
                </View>
            </ScrollView>

            {/* DIALOG DE CONFIRMAÇÃO DE SAÍDA */}
            <Portal>
                <Dialog visible={dialogSair} onDismiss={() => setDialogSair(false)}>
                    <Dialog.Title>Encerrar Sessão</Dialog.Title>
                    <Dialog.Content>
                        <Text>Deseja realmente sair da sua conta?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogSair(false)}>Cancelar</Button>
                        <Button onPress={handleSair} textColor={Colors.accent}>Sair</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* DIALOG DE CONFIRMAÇÃO DE EXCLUSÃO DE CONTA */}
            <Portal>
                <Dialog visible={dialogExcluir} onDismiss={() => setDialogExcluir(false)}>
                    <Dialog.Title style={{ color: Colors.danger }}>Excluir Conta</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                            Atenção: Esta ação é definitiva e irreversível!
                        </Text>
                        <Text>
                            Todos os seus dados de perfil e preferências serão apagados do sistema.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogExcluir(false)} disabled={excluindoConta}>
                            Cancelar
                        </Button>
                        <Button
                            onPress={handleExcluirConta}
                            textColor={Colors.danger}
                            loading={excluindoConta}
                            disabled={excluindoConta}
                        >
                            Excluir Definitivamente
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const configStyles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        backgroundColor: Colors.primary,
    },
    headerTitulo: {
        fontWeight: 'bold',
        color: Colors.textOnDark,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    cardUsuario: {
        backgroundColor: Colors.surface,
        marginBottom: 16,
        borderRadius: 10,
        elevation: 2,
    },
    cardVisitante: {
        backgroundColor: Colors.surface,
        marginBottom: 16,
        borderRadius: 10,
        elevation: 2,
    },
    usuarioContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: Colors.accent,
    },
    usuarioInfo: {
        flex: 1,
        marginLeft: 14,
    },
    usuarioNome: {
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    usuarioEmail: {
        color: Colors.textSecondary,
        marginTop: 2,
    },
    botaoEditarPerfil: {
        borderColor: Colors.accent,
    },
    secaoTitulo: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginTop: 10,
        marginBottom: 8,
        marginLeft: 4,
    },
    cardSecao: {
        backgroundColor: Colors.surface,
        borderRadius: 10,
        marginBottom: 16,
        elevation: 2,
    },
    linhaSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    input: {
        marginBottom: 12,
        backgroundColor: Colors.surface,
    },
    botaoSalvarSenha: {
        marginTop: 6,
        paddingVertical: 4,
    },
    botaoSair: {
        borderColor: Colors.borderStrong,
        marginBottom: 12,
    },
    botaoExcluir: {
        borderColor: Colors.danger,
    },
    rodape: {
        marginTop: 15,
        alignItems: 'center',
    },
});

export default Configuracoes;
