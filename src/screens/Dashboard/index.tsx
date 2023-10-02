import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { Produto } from "./types";
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useState, useEffect} from "react"
import { FabButton } from "../../components/FabButton";
import AddProductModal from "../../components/AddProdutoModal";

export default function Dashboard() {

  const [produtos, setProdutos] = useState<Produto[]>()
  const [openModal, setOpenModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [incrementModalVisible, setIncrementModalVisible] = useState(false);
  const [decrementModalVisible, setDecrementModalVisible] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState('1');

  const {getItem, setItem} = useAsyncStorage("tiapenhacozinha")

  function handleOpenCloseModalAdicionarProduto(){
    setOpenModal(!openModal)
  }


  async function handleGetProdutos(){
    try {
      const data = await getItem();
      if (data) {
        const finalData = JSON.parse(data);
        if (Array.isArray(finalData)) {
          setProdutos(finalData);
        } else {
          console.error('Data is not an array:', finalData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  function handleIncrement(product: Produto) {
    setSelectedProduct(product);
    setIncrementModalVisible(true);
  }

  function handleDecrement(product: Produto) {
    setSelectedProduct(product);
    setDecrementModalVisible(true);
  }

  function incrementQuantity() {
    if (selectedProduct) {
      const updatedProducts = produtos.map((produto) => {
        if (produto.id === selectedProduct.id) {
          const newQuantity = Number(produto.quantidade) + parseInt(quantityToAdd);
          return {
            ...produto,
            quantidade: String(newQuantity),
          };
        }
        return produto;
      });
  
      setItem(JSON.stringify(updatedProducts)).then(() => {
        setIncrementModalVisible(false);
        handleGetProdutos(); 
      });
    }
  }

  function decrementQuantity() {
    if (selectedProduct) {
      const updatedProducts = produtos.map((produto) => {
        if (produto.id === selectedProduct.id) {
          const newQuantity =
            produto.quantidade - parseInt(quantityToAdd);
          return {
            ...produto,
            quantidade: String(newQuantity >= 0 ? newQuantity : 0),
          };
        }
        return produto;
      });
  
      setItem(JSON.stringify(updatedProducts)).then(() => {
        setDecrementModalVisible(false);
        handleGetProdutos(); 
      });
    }
  }

  async function deleteProduct(productId: string) {
    try {
      const { getItem, setItem } = useAsyncStorage('tiapenhacozinha'); // Substitua pela sua chave
      const data = await getItem();
      
      if (data) {
        const products = JSON.parse(data);
        const updatedProducts = products.filter((product) => product.id !== productId);
  
        // Atualize os dados no AsyncStorage após excluir o produto
        await setItem(JSON.stringify(updatedProducts));
        console.log('Produto excluído com sucesso.');
  
        // Você pode adicionar código adicional aqui, como atualizar o estado local, se necessário.
      }
    } catch (error) {
      console.error('Erro ao excluir produto do AsyncStorage:', error);
    }
  }


  useEffect(() => {
    handleGetProdutos()
  }, [produtos])


    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Estoque</Text>
        </View>
        <ScrollView style={styles.content} showsHorizontalScrollIndicator={false}>
          {produtos ? produtos.map((produto) => {
            return (
            <View style={styles.produto} key={produto.id}>
              <Text onPress={() => deleteProduct(produto.id)} style={styles.produtoTitulo}>
                {produto.nome}
              </Text>
              <Text style={styles.produtoQtd}>
                Qtd: {produto.quantidade}
              </Text>
              <TouchableOpacity
                style={[styles.botao, styles.incrementar]}
                onPress={() => handleIncrement(produto)}
              >
                <Text style={styles.botaoTitulo}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => handleDecrement(produto)}
              >
                <Text style={styles.botaoTitulo}>-</Text>
              </TouchableOpacity>
            </View>)
          })
        :
        <View><Text>Nenhum produto cadastrado</Text></View>
        } 

          
        </ScrollView>
        <Modal
          transparent={true}
          animationType="slide"
          visible={incrementModalVisible}
          onRequestClose={() => setIncrementModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Dar baixa no estoque</Text>
              <TextInput
                style={styles.input}
                placeholder="Quantidade a ser incrementada"
                value={quantityToAdd}
                onChangeText={(text) => setQuantityToAdd(text)}
                keyboardType="numeric"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={incrementQuantity}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.closeButton]}
                  onPress={() => setIncrementModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      {/* Modal de Decremento */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={decrementModalVisible}
        onRequestClose={() => setDecrementModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar ao estoque</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantidade a ser decrementada"
              value={quantityToAdd}
              onChangeText={(text) => setQuantityToAdd(text)}
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={decrementQuantity}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => setDecrementModalVisible(false)}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
        <FabButton handleOpenCloseModalAdicionarProduto={handleOpenCloseModalAdicionarProduto}/>
        <AddProductModal handleGetProdutos={handleGetProdutos} visible={openModal} onClose={handleOpenCloseModalAdicionarProduto} />
        
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%"
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        height: "15%",
    },
    title: {
        color: "#000"
    },
    content:{
      flex: 1,
      width: "100%",
    },
    produto: {
      marginBottom: 10,
      marginHorizontal: 10,
      flex:1,
      flexDirection: "row",
      height: 50,
      backgroundColor: "#e2e2e2",
      alignItems: "center",
      paddingLeft: 5
    },
    produtoTitulo:{
      fontSize: 16,
      width: 200,
    },
    produtoQtd: {
      width: 60
    },
    botao: {
      backgroundColor: "#7a7a7a",
      height: 40,
      width: 40,
      alignItems: "center",
      justifyContent: "center",
      marginRight:5
    },
    incrementar: {
      marginLeft: 10
    },
    botaoTitulo:{
      fontSize: 30
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '90%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      borderRadius: 5,
      padding: 15,
      alignItems: 'center',
      flex: 1,
    },
    saveButton: {
      backgroundColor: 'blue',
      marginLeft: 10, 
    },
    closeButton: {
      backgroundColor: 'red',
      marginRight: 10, 
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
    },
})