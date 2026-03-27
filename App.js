import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export default function App() {
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState();
  const [listaProdutos, setListaProduto] = useState([]);
  const [produtoEditado, setProdutoEditado] = useState(null);

  // useEffect para buscar os dados salvo no AsyncStorage
  useEffect(() => {
    buscarProduto(); // Chama a função buscar dados salvo
  }, []);

  // Função para salvar produto no AsyncStorage
  async function salvar() {
    let produtos = []; //Inicializa array vazio

    // Verificar se já existe algum dado no AsyncStorage
    if ((await AsyncStorage.getItem("PRODUTOS")) != null) {
      // Carrega todos os produtos no array
      produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS"));
    }

    if (produtoEditado) {
      // Atualizando produto existente
      produtos[produtoEditado.index] = {
        nomeP: nomeProduto,
        precoP: precoProduto,
      };
    } else {
      // Salva o produto no array
      produtos.push({ nomeP: nomeProduto, precoP: precoProduto });
    }

    // Salva o produto no array
    produtos.push({ nomeP: nomeProduto, precoP: precoProduto });

    // Salva o produto do Async Storage
    await AsyncStorage.setItem("PRODUTOS", JSON.stringify(produtos));

    produtoEditado ? alert("PRODUTO EDITADO") : alert("PRODUTO SALVO");

    // Limpar o formulário...
    setNomeProduto("");
    setPrecoProduto("");

    // Volta o estao para null, para ficar default o cadastro
    setProdutoEditado(null)

    // Chamar a função para listar os produtos na flatlist
    buscarProduto();
  }

  // Função para buscar produtos
  async function buscarProduto() {
    const p = await AsyncStorage.getItem("PRODUTOS");
    setListaProduto(JSON.parse(p));
  }

  // Função para deletar o produto
  async function deletarProduto(index) {
    const tempDados = listaProdutos;
    const dados = tempDados.filter((item, ind) => {
      return ind !== index; //Filtra o item que será excluido da lista
    });

    setListaProduto(dados); // Atualiza o estado listaProduto
    await AsyncStorage.setItem("PRODUTOS", JSON, stringify(dados));
  }

  // Função para editar produto
  function editarProduto(index) {
    const produto = listaProdutos[index];
    setNomeProduto(produto.nomeP);
    setPrecoProduto(produto.precoP);
    setProdutoEditado({ index });
  }

  return (
    <View style={styles.container}>
      <Text>CADASTRO</Text>
      {/* Campo para digitar o nome do produto */}
      <TextInput
        placeholder="Digite o nome do produto"
        style={styles.input}
        value={nomeProduto}
        onChangeText={(value) => setNomeProduto(value)}
      />

      {/* Campo para digitar o preço do produto */}
      <TextInput
        placeholder="Digite o preço do produto"
        style={styles.input}
        value={precoProduto}
        onChangeText={(value) => setPrecoProduto(value)}
      />

      {/* Botão para salvar o produto */}
      <TouchableOpacity style={styles.btn} onPress={salvar}>
        <Text>{produtoEditado ? "ATUALIZAR" : "CADASTRAR"}</Text>
      </TouchableOpacity>

      {/* Botão para buscar o produto */}
      <TouchableOpacity style={styles.btn} onPress={buscarProduto}>
        <Text>BUSCAR DADOS</Text>
      </TouchableOpacity>

      <FlatList
        data={listaProdutos}
        ListEmptyComponent={<Text>Nenhum produto cadastrado</Text>}
        renderItem={({ item, index }) => {
          if (!item || !item.nomeP) return null; // Garante que o item não seja null antes da renderização
          return (
            <View style={styles.listaItens}>
              <Text>NOME PRODUTO:{item.nomeP}</Text>
              <Text>PREÇO PRODUTO:{item.precoP}</Text>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <TouchableOpacity
                  style={styles.btnDeletar}
                  onPress={() => deletarProduto(index)}
                >
                  <Text>DELETAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnDeletar, { backgroundColor: "orange" }]}
                  onPress={() => editarProduto(index)}
                >
                  <Text>EDITAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  input: {
    borderWidth: 1,
    height: 50,
    width: 300,
    borderRadius: 15,
  },
  btn: {
    borderWidth: 1,
    height: 50,
    width: 300,
    borderRadius: 15,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
  },
  listaItens: {
    width: 300,
    borderWidth: 1,
    borderRadius: 15,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 3,
  },
  btnDeletar: {
    backgroundColor: "#fb9797",
    borderRadius: 12,
    width: 90,
    alignItems: "center",
  },
});
