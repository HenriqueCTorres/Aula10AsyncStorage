import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function App() {
  const[nomeProduto, setNomeProduto]=useState("")
  const[precoProduto, setPrecoProduto]=useState()
  const[listaProdutos,setListaProduto]=useState([])

  // Função para salvar produto no AsyncStorage
  async function salvar() {
    let produtos = [] //Inicializa array vazio

    // Verificar se já existe algum dado no 
    if(await AsyncStorage.getItem("PRODUTOS")!=null){
      // Carrega todos os produtos no array
      produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS"))
    }

    // Salva o produto no array
    produtos.push({nomeP:nomeProduto,precoP:precoProduto})

    // Salva o produto do Async Storage
    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(produtos))
    
    alert("PRODUTO SALVO")
  }

  // Função para buscar produtos
  async function buscarProdutos() {
    const p = await AsyncStorage.getItem("PRODUTOS")
    setListaProduto(JSON.parse(p))
  }
   
  return (
    <View style={styles.container}>
      <Text>CADASTRO</Text>
      {/* Campo para digitar o nome do produto */}
      <TextInput
        placeholder='Digite o nome do produto'
        style={styles.input}
        value={nomeProduto}
        onChangeText={(value)=>setNomeProduto(value)}      
      />

      {/* Campo para digitar o preço do produto */}
      <TextInput
        placeholder='Digite o preço do produto'
        style={styles.input}
        value={precoProduto}
        onChangeText={(value)=>setPrecoProduto(value)}      
      />

      {/* Botão para salvar o produto */}
      <TouchableOpacity 
        style={styles.btn}
        onPress={salvar}
      >
          <Text>CADASTRAR</Text>
      </TouchableOpacity>

      {/* Botão para buscar o produto */}
      <TouchableOpacity 
        style={styles.btn}
        onPress={buscarProdutos}
      >
          <Text>BUSCAR DADOS</Text>
      </TouchableOpacity>

      <FlatList
        data={listaProdutos}
        renderItem={({item})=>{
          return(
          <>
            <Text>NOME PRODUTO:{item.nomeP}</Text>
            <Text>PREÇO PRODUTO:{item.precoP}</Text>
          </>
          )
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap:5
  },
  input:{
    borderWidth:1,
    height:50,
    width:300,
    borderRadius:15
  },
  btn:{
    borderWidth:1,
    height:50,
    width:300,
    borderRadius:15,
    backgroundColor:"lightblue",
    justifyContent:"center",
    alignItems:"center"
  }
});
