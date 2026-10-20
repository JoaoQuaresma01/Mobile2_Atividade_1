import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Colors from './theme/Colors';

const ModCard = ({ conteudo, onExcluir, onEditar }) => {
    const { usuario } = useContext(AuthContext);

    const titulo    = conteudo?.tituloConteudo    || 'Sem título';
    const subtitulo = conteudo?.subtituloConteudo || '';
    const urlImagem = conteudo?.urlImagemConteudo || 'https://picsum.photos/seed/tech/640/360';
    const descricao = conteudo?.descricaoConteudo || '';

    return (
        <Card style={cardStyles.card}>
            {/* IMAGEM 16:9 */}
            <Image
                source={{ uri: urlImagem }}
                style={cardStyles.capa}
                resizeMode="cover"
            />

            {/* TEXTOS */}
            <View style={cardStyles.info}>
                <Text variant="titleSmall" style={cardStyles.titulo} numberOfLines={2}>
                    {titulo}
                </Text>
                {subtitulo !== '' && (
                    <Text variant="bodySmall" style={cardStyles.subtitulo} numberOfLines={1}>
                        {subtitulo}
                    </Text>
                )}
                {descricao !== '' && (
                    <Text variant="bodySmall" style={cardStyles.descricao} numberOfLines={2}>
                        {descricao}
                    </Text>
                )}
            </View>

            {/* AÇÕES — visíveis só para usuário logado */}
            {usuario && (
                <View style={cardStyles.acoes}>
                    <Button
                        compact
                        icon="pencil"
                        mode="text"
                        textColor={Colors.accent}
                        onPress={() => onEditar && onEditar(conteudo)}
                    >
                        Editar
                    </Button>
                    <Button
                        compact
                        icon="delete"
                        mode="text"
                        textColor={Colors.danger}
                        onPress={() => onExcluir && onExcluir(conteudo?._id)}
                    >
                        Excluir
                    </Button>
                </View>
            )}
        </Card>
    );
};

const cardStyles = StyleSheet.create({
    card: {
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: Colors.surface,
        elevation: 2,
        overflow: 'hidden',
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    capa: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: Colors.surfaceAlt,
    },
    info: {
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 6,
    },
    titulo: {
        fontWeight: 'bold',
        color: Colors.textPrimary,
        fontSize: 15,
        lineHeight: 20,
    },
    subtitulo: {
        color: Colors.textSecondary,
        marginTop: 2,
        fontSize: 13,
    },
    descricao: {
        color: Colors.textMuted,
        marginTop: 4,
        fontSize: 12,
        lineHeight: 17,
    },
    acoes: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 8,
        paddingBottom: 6,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        marginTop: 4,
    },
});

export default ModCard;
