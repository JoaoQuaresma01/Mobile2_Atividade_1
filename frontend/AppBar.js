import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Appbar, ActivityIndicator } from 'react-native-paper';
import { styles } from './css/Styles';
import ModCard from './Cards';
import api from './services/api'; // seu axios configurado
import { useFocusEffect } from '@react-navigation/native';

const AppBar = ({ navigation }) => {
    const [listaConteudos, setListaConteudos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    // 1. Função para buscar conteúdos no backend
    const carregarConteudos = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/conteudo/listar');
            setListaConteudos(response.data);
        } catch (error) {
            console.error('Erro ao buscar conteúdos:', error);
        } finally {
            setCarregando(false);
        }
    };

    // Executa ao abrir a tela
    // useEffect(() => {
    //     carregarConteudos();
    // }, []);

    // Trocado por este useFocusEffect: Para ao editar o card ele atualizar automaticamente
    useFocusEffect(
        useCallback(() => {
            carregarConteudos();
        }, [])
    );


    // 2. Função de Excluir com confirmação
    const handleExcluir = (id) => {
        Alert.alert(
            "Confirmar exclusão",
            "Deseja realmente apagar este conteúdo?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await api.delete(`/conteudo/${id}`);
                            Alert.alert("Sucesso", "Conteúdo excluído com sucesso!");
                            // Remove da tela na hora sem precisar recarregar
                            setListaConteudos(prev => prev.filter(item => item._id !== id));
                        } catch (err) {
                            Alert.alert("Erro", "Não foi possível excluir o conteúdo.");
                        }
                    } 
                }
            ]
        );
    };

    return (
        <>
            <Appbar.Header style={styles.header}>
                {!usuario && (
                    <Appbar.Action icon="account" onPress={() => navigation.navigate('Acesso')} />
                )}
                <Appbar.Action icon="menu" iconColor="white" onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Technologic" style={styles.title} />
                <Appbar.Action icon="magnify" onPress={() => navigation.navigate('Pesquisa')} />
                <Appbar.Action icon="account" onPress={() => navigation.navigate('Acesso')} />
            </Appbar.Header>

            {/* Abas */}
            <ScrollView horizontal style={styles.tabs} contentContainerStyle={styles.tabsContent}>
                {['TELA 01', 'TELA 02', 'TELA 03', 'TELA 04', 'TELA 05'].map((tab, i) => (
                    <View key={i} style={styles.tab}>
                        <Text style={styles.tabText}>{tab}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Lista dinâmica de Cards */}
            <ScrollView style={styles.cards} contentContainerStyle={styles.cardsContent}>
                {carregando ? (
                    <ActivityIndicator style={{ marginTop: 20 }} color="#F2A900" />
                ) : listaConteudos.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum conteúdo cadastrado.</Text>
                ) : (
                    listaConteudos.map((item) => (
                        <ModCard 
                            key={item._id} 
                            conteudo={item} 
                            onExcluir={handleExcluir}
                            onEditar={(item) => navigation.navigate('EditarConteudo', { conteudo: item })}
                        />
                    ))
                )}
            </ScrollView>
        </>
    );
};

export default AppBar;
