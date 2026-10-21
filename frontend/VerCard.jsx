import React, { useContext } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { Appbar, Text, Button } from 'react-native-paper';
import { AuthContext } from './contexts/AuthContext';
import Colors from './theme/Colors';

const VerCard = ({ route, navigation }) => {
    const { usuario } = useContext(AuthContext);
    const { conteudo } = route.params || {};

    const titulo = conteudo?.tituloConteudo || 'Sem título';
    const subtitulo = conteudo?.subtituloConteudo || '';
    const urlImagem = conteudo?.urlImagemConteudo || 'https://picsum.photos/seed/tech/640/360';
    const descricao = conteudo?.descricaoConteudo || '';
    const categoria = conteudo?.categoriaConteudo || '';
    const emailLogado = (usuario?.email || usuario?.emailUsuario || '').trim().toLowerCase();
    const idLogado = String(usuario?.id || usuario?._id || '');
    const emailAutor = (conteudo?.emailUsuarioConteudo || '').trim().toLowerCase();
    const idAutor = String(conteudo?.idUsuarioConteudo || '');
    const ehDono = Boolean(
        (emailLogado && emailAutor && emailLogado === emailAutor) ||
        (idLogado && idAutor && idLogado === idAutor)
    );

    return (
        <View style={verStyles.tela}>
            <Appbar.Header style={verStyles.header}>
                <Appbar.BackAction iconColor={Colors.textOnDark} onPress={() => navigation.goBack()} />
                <Appbar.Content title="Detalhes" titleStyle={verStyles.headerTitulo} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={verStyles.conteudo} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: urlImagem }} style={verStyles.capa} resizeMode="cover" />

                {categoria !== '' && (
                    <Text variant="labelMedium" style={verStyles.categoria}>
                        {categoria}
                    </Text>
                )}

                <Text variant="headlineSmall" style={verStyles.titulo}>
                    {titulo}
                </Text>

                {subtitulo !== '' && (
                    <Text variant="titleMedium" style={verStyles.subtitulo}>
                        {subtitulo}
                    </Text>
                )}

                {descricao !== '' && (
                    <Text variant="bodyMedium" style={verStyles.descricao}>
                        {descricao}
                    </Text>
                )}

                {ehDono && (
                    <View style={verStyles.acoes}>
                        <Button
                            mode="contained"
                            icon="pencil"
                            buttonColor={Colors.accent}
                            textColor={Colors.textOnDark}
                            style={verStyles.botao}
                            onPress={() => navigation.navigate('EditarConteudo', { conteudo })}
                        >
                            Editar
                        </Button>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const verStyles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        backgroundColor: Colors.primary,
    },
    headerTitulo: {
        color: Colors.textOnDark,
        fontWeight: 'bold',
    },
    conteudo: {
        paddingBottom: 40,
    },
    capa: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: Colors.surfaceAlt,
    },
    categoria: {
        marginTop: 16,
        marginHorizontal: 20,
        color: Colors.accent,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    titulo: {
        marginTop: 8,
        marginHorizontal: 20,
        color: Colors.textPrimary,
        fontWeight: 'bold',
    },
    subtitulo: {
        marginTop: 6,
        marginHorizontal: 20,
        color: Colors.textSecondary,
    },
    descricao: {
        marginTop: 16,
        marginHorizontal: 20,
        color: Colors.textPrimary,
        lineHeight: 22,
    },
    acoes: {
        marginTop: 28,
        marginHorizontal: 20,
    },
    botao: {
        borderRadius: 8,
    },
});

export default VerCard;
