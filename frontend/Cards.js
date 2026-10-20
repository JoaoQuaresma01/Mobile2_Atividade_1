import { View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { styles } from './css/Styles';

const ModCard = ({ conteudo, onExcluir, onEditar }) => {
    const { usuario } = useContext(AuthContext);

    return (
        <Card style={styles.card}>
            {/* Título e Subtítulo dinâmicos vindos do banco */}
            <Card.Title 
                title={conteudo?.tituloConteudo || "Sem título"} 
                subtitle={conteudo?.subtituloConteudo || ""} 
                titleStyle={styles.cardTitle} 
            />

            {/* Imagem dinâmica vinda do banco */}
            <Card.Cover
                style={styles.cardCover}
                source={{
                    uri: conteudo?.urlImagemConteudo || 'https://picsum.photos/300/200'
                }}
            />

            <Card.Actions style={styles.cardActions}>
                <Button onPress={() => console.log('Ver detalhes:', conteudo?._id)}>
                    Ver
                </Button>

                {/* Apenas para usuários autenticados */}
                {usuario && (
                    <Button 
                        icon="pencil" 
                        onPress={() => onEditar ? onEditar(conteudo) : console.log('Editar:', conteudo)}
                    >
                        Editar
                    </Button>
                )}

                {usuario && (
                    <Button 
                        icon="delete" 
                        textColor="red" 
                        onPress={() => onExcluir ? onExcluir(conteudo?._id) : console.log('Excluir:', conteudo?._id)}
                    >
                        Excluir
                    </Button>
                )}
            </Card.Actions>
        </Card>
    );
};

export default ModCard;
