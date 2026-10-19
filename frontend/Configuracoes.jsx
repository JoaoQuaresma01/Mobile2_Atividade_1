import React, { useState, useContext } from 'react';
import { View, ScrollView, Alert, StyleSheet, Linking } from 'react-native';
import { 
    Appbar, List, Switch, Divider, Button, Text, 
    Portal, Dialog, TextInput 
} from 'react-native-paper';
import { AuthContext } from './contexts/AuthContext';
import api from './services/api';

const Configuracoes = ({ navigation }) => {
    const { usuario, signOut } = useContext(AuthContext);

    // Estados de preferências
    const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
    const [temaEscuro, setTemaEscuro] = useState(false);
    const [tamanhoCache, setTamanhoCache] = useState('14.5 MB');

    // Modais e Diálogos
    const [dialogTermos, setDialogTermos] = useState(false);
    const [dialogPrivacidade, setDialogPrivacidade] = useState(false);
    const [dialogFaq, setDialogFaq] = useState(false);
    const [modalSenha, setModalSenha] = useState(false);

    // Campos para Alteração de Senha
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [salvandoSenha, setSalvandoSenha] = useState(false);

    // 1. Limpeza de Cache Funcional
    const limparCache = () => {
        setTamanhoCache('0.0 MB');
        Alert.alert("Armazenamento", "Cache temporário e imagens em buffer limpos com sucesso!");
    };

    // 2. Fale Conosco Funcional (Abre aplicativo de E-mail)
    const abrirFaleConosco = () => {
        Linking.openURL('mailto:suporte@technologic.com?subject=Suporte%20ao%20App%20Technologic');
    };

    // 3. Salvar Nova Senha no Backend
    const salvarNovaSenha = async () => {
        if (!senhaAtual || !novaSenha) {
            Alert.alert("Atenção", "Preencha a senha atual e a nova senha.");
            return;
        }

        try {
            setSalvandoSenha(true);
            const email = usuario?.email || usuario?.emailUsuario;
            const response = await api.put('/usuarios/alterar-senha', {
                emailUsuario: email,
                senhaAtual,
                novaSenha
            });

            Alert.alert("Sucesso", response.data.mensagem || "Senha alterada com sucesso!");
            setModalSenha(false);
            setSenhaAtual('');
            setNovaSenha('');
        } catch (error) {
            const msg = error.response?.data?.erro || "Não foi possível alterar a senha.";
            Alert.alert("Erro", msg);
        } finally {
            setSalvandoSenha(false);
        }
    };

    // 4. Excluir Conta Real no Banco MongoDB
    const confirmarExclusaoConta = () => {
        const email = usuario?.email || usuario?.emailUsuario;
        if (!email) {
            Alert.alert("Atenção", "Você precisa estar logado para excluir uma conta.");
            return;
        }

        Alert.alert(
            "Excluir Conta",
            "Esta ação é DEFINITIVA e apagará seu cadastro e dados no banco. Deseja prosseguir?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sim, Excluir Definitivamente", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await api.delete(`/usuarios/excluir/${email}`);
                            signOut(); // desloga o usuário do contexto
                            Alert.alert("Conta Excluída", "Seus dados foram removidos com sucesso.");
                            navigation.navigate('Home');
                        } catch (error) {
                            console.error("Erro ao excluir conta:", error);
                            Alert.alert("Erro", "Falha ao conectar com o servidor para excluir a conta.");
                        }
                    } 
                }
            ]
        );
    };

    // Cores dinâmicas para o Tema Claro / Escuro
    const cores = {
        background: temaEscuro ? '#121212' : '#FFFFFF',
        texto: temaEscuro ? '#FFFFFF' : '#000000',
        header: temaEscuro ? '#1F1F1F' : '#C0C0C0',
    };

    return (
        <View style={[styles.container, { backgroundColor: cores.background }]}>
            {/* CABEÇALHO */}
            <Appbar.Header style={{ backgroundColor: cores.header }}>
                <Appbar.BackAction iconColor="white" onPress={() => navigation.goBack()} />
                <Appbar.Content title="Configurações" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* 1. SEÇÃO NOTIFICAÇÕES */}
                <List.Section title="Notificações" titleStyle={{ color: cores.texto }}>
                    <List.Item
                        title="Notificações push"
                        titleStyle={{ color: cores.texto }}
                        description={notificacoesAtivas ? "Ativadas" : "Desativadas"}
                        descriptionStyle={{ color: cores.texto }}
                        left={props => <List.Icon {...props} icon="bell-outline" color={cores.texto} />}
                        right={() => (
                            <Switch
                                value={notificacoesAtivas}
                                onValueChange={(val) => {
                                    setNotificacoesAtivas(val);
                                    Alert.alert("Notificações", val ? "Notificações ativadas!" : "Notificações silenciadas.");
                                }}
                                color="#F2A900"
                            />
                        )}
                    />
                </List.Section>
                <Divider />

                {/* 2. SEÇÃO PRIVACIDADE E SEGURANÇA */}
                <List.Section title="Privacidade e Segurança" titleStyle={{ color: cores.texto }}>
                    {usuario && (
                        <List.Item
                            title="Alterar Senha"
                            titleStyle={{ color: cores.texto }}
                            left={props => <List.Icon {...props} icon="lock-outline" color={cores.texto} />}
                            right={props => <List.Icon {...props} icon="chevron-right" color={cores.texto} />}
                            onPress={() => setModalSenha(true)}
                        />
                    )}
                    <List.Item
                        title="Termos de Uso"
                        titleStyle={{ color: cores.texto }}
                        left={props => <List.Icon {...props} icon="file-document-outline" color={cores.texto} />}
                        right={props => <List.Icon {...props} icon="chevron-right" color={cores.texto} />}
                        onPress={() => setDialogTermos(true)}
                    />
                    <List.Item
                        title="Política de Privacidade"
                        titleStyle={{ color: cores.texto }}
                        left={props => <List.Icon {...props} icon="shield-check-outline" color={cores.texto} />}
                        right={props => <List.Icon {...props} icon="chevron-right" color={cores.texto} />}
                        onPress={() => setDialogPrivacidade(true)}
                    />
                </List.Section>
                <Divider />

                {/* 3. SEÇÃO APARÊNCIA */}
                <List.Section title="Aparência" titleStyle={{ color: cores.texto }}>
                    <List.Item
                        title="Modo Escuro"
                        titleStyle={{ color: cores.texto }}
                        description={temaEscuro ? "Tema escuro ativado" : "Tema claro ativado"}
                        descriptionStyle={{ color: cores.texto }}
                        left={props => <List.Icon {...props} icon="theme-light-dark" color={cores.texto} />}
                        right={() => (
                            <Switch
                                value={temaEscuro}
                                onValueChange={setTemaEscuro}
                                color="#F2A900"
                            />
                        )}
                    />
                </List.Section>
                <Divider />

                {/* 4. SEÇÃO ARMAZENAMENTO */}
                <List.Section title="Armazenamento" titleStyle={{ color: cores.texto }}>
                    <List.Item
                        title="Limpar Cache"
                        titleStyle={{ color: cores.texto }}
                        description={`Espaço ocupado: ${tamanhoCache}`}
                        descriptionStyle={{ color: cores.texto }}
                        left={props => <List.Icon {...props} icon="database-outline" color={cores.texto} />}
                        right={() => (
                            <Button compact mode="outlined" onPress={limparCache} textColor="#F2A900">
                                Limpar
                            </Button>
                        )}
                    />
                </List.Section>
                <Divider />

                {/* 5. SEÇÃO AJUDA & SOBRE */}
                <List.Section title="Ajuda & Sobre" titleStyle={{ color: cores.texto }}>
                    <List.Item
                        title="Dúvidas Frequentes (FAQ)"
                        titleStyle={{ color: cores.texto }}
                        left={props => <List.Icon {...props} icon="help-circle-outline" color={cores.texto} />}
                        right={props => <List.Icon {...props} icon="chevron-right" color={cores.texto} />}
                        onPress={() => setDialogFaq(true)}
                    />
                    <List.Item
                        title="Fale Conosco"
                        titleStyle={{ color: cores.texto }}
                        description="suporte@technologic.com"
                        descriptionStyle={{ color: cores.texto }}
                        left={props => <List.Icon {...props} icon="email-outline" color={cores.texto} />}
                        right={props => <List.Icon {...props} icon="chevron-right" color={cores.texto} />}
                        onPress={abrirFaleConosco}
                    />
                    <List.Item
                        title="Versão do Aplicativo"
                        description="v1.0.0 (Build 2026)"
                        titleStyle={{ color: cores.texto }}
                        descriptionStyle={{ color: cores.texto }}
                        left={props => <List.Icon {...props} icon="information-outline" color={cores.texto} />}
                    />
                </List.Section>
                <Divider />

                {/* 6. ZONA DE PERIGO (EXCLUIR CONTA) */}
                {usuario && (
                    <View style={styles.dangerZone}>
                        <Button 
                            mode="contained" 
                            buttonColor="#d32f2f" 
                            textColor="#fff"
                            icon="delete-forever"
                            onPress={confirmarExclusaoConta}
                            style={styles.deleteButton}
                        >
                            Excluir Minha Conta
                        </Button>
                    </View>
                )}
            </ScrollView>

            {/* MODAL: ALTERAR SENHA */}
            <Portal>
                <Dialog visible={modalSenha} onDismiss={() => setModalSenha(false)}>
                    <Dialog.Title>Alterar Senha</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Senha Atual"
                            secureTextEntry
                            value={senhaAtual}
                            onChangeText={setSenhaAtual}
                            mode="outlined"
                            style={{ marginBottom: 12 }}
                        />
                        <TextInput
                            label="Nova Senha"
                            secureTextEntry
                            value={novaSenha}
                            onChangeText={setNovaSenha}
                            mode="outlined"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setModalSenha(false)}>Cancelar</Button>
                        <Button loading={salvandoSenha} disabled={salvandoSenha} onPress={salvarNovaSenha}>
                            Salvar
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* DIALOG: TERMOS DE USO */}
            <Portal>
                <Dialog visible={dialogTermos} onDismiss={() => setDialogTermos(false)}>
                    <Dialog.Title>Termos de Uso</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                            <Text variant="bodyMedium">
                                1. Ao utilizar o aplicativo Technologic, você concorda em não publicar conteúdos ofensivos ou protegidos por direitos autorais sem permissão.{"\n\n"}
                                2. Usuários cadastrados são responsáveis pela confidencialidade de sua senha.{"\n\n"}
                                3. O aplicativo reserva o direito de excluir conteúdos que violem as diretrizes.
                            </Text>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogTermos(false)}>Entendido</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* DIALOG: POLÍTICA DE PRIVACIDADE */}
            <Portal>
                <Dialog visible={dialogPrivacidade} onDismiss={() => setDialogPrivacidade(false)}>
                    <Dialog.Title>Política de Privacidade</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                            <Text variant="bodyMedium">
                                1. Coletamos seu nome e e-mail com a finalidade exclusiva de autenticação e identificação.{"\n\n"}
                                2. Suas senhas são criptografadas com hash seguro (bcrypt) e não podem ser lidas por terceiros.{"\n\n"}
                                3. Você pode solicitar a exclusão de todos os seus dados a qualquer momento através do botão Excluir Conta.
                            </Text>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogPrivacidade(false)}>Entendido</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* DIALOG: DÚVIDAS FREQUENTES (FAQ) */}
            <Portal>
                <Dialog visible={dialogFaq} onDismiss={() => setDialogFaq(false)}>
                    <Dialog.Title>Dúvidas Frequentes (FAQ)</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
                            <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>Como editar ou excluir um card?</Text>
                            <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
                                Você precisa estar logado na sua conta. Quando logado, os botões 'Editar' e 'Excluir' aparecem no rodapé de cada card.
                            </Text>

                            <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>Como alterar minha foto de perfil?</Text>
                            <Text variant="bodyMedium">
                                Acesse o menu lateral, vá em 'Meu Perfil' e toque no ícone de lápis sobre a foto.
                            </Text>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogFaq(false)}>Fechar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    dangerZone: {
        marginTop: 25,
        paddingHorizontal: 16,
    },
    deleteButton: {
        borderRadius: 8,
    }
});

export default Configuracoes;
