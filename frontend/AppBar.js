import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { styles } from './css/Styles';
import ModCard from './Cards';

const AppBar = ({ navigation }) => {
    return (
        <>
            <Appbar.Header style={styles.header}>
                <Appbar.Action icon="menu" iconColor="white" onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Technologic" style={styles.title} />
                <Appbar.Action icon="magnify"  onPress={() => navigation.navigate('Pesquisa')} />
                <Appbar.Action icon="account" onPress={() => navigation.navigate('Acesso')} />
            </Appbar.Header>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                style={styles.tabs}
                contentContainerStyle={styles.tabsContent}>

                <View style={styles.tab}>
                    <Text style={styles.tabText}>TELA 01</Text>
                </View>

                <View style={styles.tab}>
                    <Text style={styles.tabText}>TELA 02</Text>
                </View>

                <View style={styles.tab}>
                    <Text style={styles.tabText}>TELA 03</Text>
                </View>
                <View style={styles.tab}>
                    <Text style={styles.tabText}>TELA 04</Text>
                </View>
                <View style={styles.tab}>
                    <Text style={styles.tabText}>TELA 05</Text>
                </View>
            </ScrollView>

       

            <ScrollView
                style={styles.cards}
                contentContainerStyle={styles.cardsContent}
            >
                <ModCard />
                <ModCard />
                <ModCard />
            </ScrollView>
        </>
    );
}

export default AppBar;