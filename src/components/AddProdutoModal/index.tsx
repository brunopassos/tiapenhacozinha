import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import  {useAsyncStorage} from '@react-native-async-storage/async-storage';


interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  handleGetProdutos: () => void
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  handleGetProdutos
}) => {
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');

  const { setItem, getItem } = useAsyncStorage("tiapenhacozinha")

  function handleSave(){
    handleCriarProduto()
    setProductName('');
    setProductQuantity('');
    handleGetProdutos()
  };

  async function handleCriarProduto() {
    try {
      const produto = {
        id: Date.now().toString(),
        nome: productName,
        quantidade: productQuantity
      };
  
      const existingData = await getItem();
      let newData = [];
  
      if (existingData) {
        try {
          newData = JSON.parse(existingData);
          if (!Array.isArray(newData)) {
            throw new Error('Data is not an array');
          }
        } catch (error) {
          console.error('Invalid data format in AsyncStorage:', error);
          newData = [];
        }
      }
  
      newData.push(produto);
  
      await setItem(JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Adicionar novo produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do produto"
            value={productName}
            onChangeText={(text) => setProductName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            value={productQuantity}
            onChangeText={(text) => setProductQuantity(text)}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});

export default AddProductModal;