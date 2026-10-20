import React, { createContext, useState } from 'react';

// acaba criando o contexto (a nossa memória global)
export const AuthContext = createContext({});

// cria o provedor (quem vai distribuir essa memória para as telas)
export const AuthProvider = ({ children }) => {
    // o estado que guarda quem está logado e omeça como vazio (null).
    const [usuario, setUsuario] = useState(null);

    // função que chamaremos na tela de Login quando der sucesso
    const signIn = (dadosUsuario) => {
        setUsuario(dadosUsuario);
    };

    // função do botão de "sair"
    const signOut = () => {
        setUsuario(null);
    };

    // função para atualizar
    const atualizarUsuario = (novosDados) => {
        setUsuario(prev => ({ ...prev, ...novosDados }));
    };

    return (
        <AuthContext.Provider value={{ usuario, signIn, signOut, atualizarUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};