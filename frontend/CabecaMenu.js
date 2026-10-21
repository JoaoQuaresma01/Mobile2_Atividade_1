import { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Avatar, Text, IconButton, Portal, Dialog, Button } from 'react-native-paper';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
// importando a lógica do AuthContext.js para usar os dados do usuário. (feature/frontend-menu-identificacao)
import { AuthContext } from './contexts/AuthContext';
import { menuStyles as styles } from './css/Styles';
const CabecalhoMenu = () => {


  // pegando informações do usuário. (feature/frontend-menu-identificacao)
  const { usuario, signOut } = useContext(AuthContext);

  const navigation = useNavigation();
  const [dialogSair, setDialogSair] = useState(false);

  // Função para sair do aplicativo (feature/frontend-menu-identificacao)
  const confirmarSaida = () => {
    setDialogSair(false);
    signOut(); // limpa o login
    navigation.navigate("Home");
  };
  return (

    <View style={styles.container}>

      {/* Área do usuário */}
      <View style={styles.usuario}>
        {/* Avatar */}
        {usuario && (usuario.foto || usuario.fotoUsuario) ? (
          <Avatar.Image
            size={65}
            source={{ uri: usuario.foto || usuario.fotoUsuario }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Icon
            size={65}
            icon="account"
            style={styles.avatar}
          />
        )}

        {/* Nome e e-mail  Mudança pra quando não tiver um usuário logado. (feature/frontend-menu-identificacao) */}
        <View style={styles.informacoes}>
          <Text variant="titleMedium" style={styles.nome}>
            {usuario ? (usuario.nome || usuario.nomeUsuario) : 'Olá, Visitante!'}
          </Text>
          {usuario ? (
            <Text variant="bodyMedium" style={styles.email} numberOfLines={1}>
              {usuario.email || usuario.emailUsuario}
            </Text>
          ) : (
            <Text
              variant="bodyMedium"
              style={[styles.email, { fontWeight: 'bold', textDecorationLine: 'underline', marginTop: 4 }]}
              onPress={() => navigation.navigate('Login')}
            >
              Toque aqui para fazer login
            </Text>
          )}
        </View>

      </View>


      {usuario && (
        <Pressable
          style={styles.perfil}
          onPress={() => {
            navigation.navigate('Início', { screen: 'CriarCard' });
          }}
        >
          <Text variant="bodyMedium" style={styles.perfilTexto}>
            Criar card
          </Text>
          <IconButton
            icon="card-plus-outline"
            iconColor="white"
            size={24}
          />
        </Pressable>
      )}

      {/* Área do perfil */}
      <Pressable
        style={styles.perfil}
        onPress={() => {
          if (!usuario) {
            navigation.navigate('Login');
          } else {
            navigation.navigate('Perfil');
          }
        }}
      >
        <Text variant="bodyMedium" style={styles.perfilTexto}>
          Meu perfil
        </Text>
        <IconButton
          icon="account"
          iconColor="white"
          size={24}
        />
      </Pressable>


      {/* Área do Notificação */}
      <Pressable 
        style={styles.perfil} 
        onPress={() => navigation.navigate('Notificacoes')}
      >
        <Text
          variant="bodyMedium"
          style={styles.perfilTexto}>
          Notificação
        </Text>
        <IconButton
          icon="bell"
          iconColor="white"
          size={24}
          onPress={() => navigation.navigate('Notificacoes')}
        />
      </Pressable>

      {/* Área de Configuração */}
      <Pressable 
        style={styles.perfil} 
        onPress={() => navigation.navigate('Configuracoes')}
      >
        <Text
          variant="bodyMedium"
          style={styles.perfilTexto}>
          Configuração
        </Text>
        <IconButton
          icon="cog"
          iconColor="white"
          size={24}
          onPress={() => navigation.navigate('Configuracoes')}
        />
      </Pressable>

      {/* Área do sair */}
      <View style={styles.perfil}>
        <Text
          variant="bodyMedium"
          style={styles.perfilTexto}>
          Sair
        </Text>
        <IconButton
          icon="logout"
          iconColor="white"
          size={24}
          onPress={() => setDialogSair(true)}
        />

      </View>


      {/* Dialog de confirmação */}
      <Portal>
        <Dialog
          visible={dialogSair}
          onDismiss={() => setDialogSair(false)}>
          <Dialog.Title>Confirmar saída</Dialog.Title>
          <Dialog.Content>
            <Text>
              Deseja realmente sair do aplicativo?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDialogSair(false)}>
              Cancelar
            </Button>

            <Button
              onPress={confirmarSaida}   >
              Sair
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
};

export { CabecalhoMenu };